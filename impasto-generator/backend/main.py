import zipfile
import uuid
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from database import create_job, get_job, init_db
from generator import generate_variants

app = FastAPI(title="Impasto Texture Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@app.on_event("startup")
async def startup():
    init_db()


@app.post("/api/upload")
async def upload_image(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(400, "File exceeds 10 MB limit")

    job_id = str(uuid.uuid4())
    ext = Path(file.filename or "upload.jpg").suffix or ".jpg"
    upload_path = UPLOAD_DIR / f"{job_id}{ext}"
    upload_path.write_bytes(content)

    create_job(job_id, str(upload_path))
    background_tasks.add_task(generate_variants, job_id, str(upload_path))

    return {"job_id": job_id, "status": "queued"}


@app.get("/api/job/{job_id}")
async def get_job_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@app.get("/api/job/{job_id}/download")
async def download_zip(job_id: str):
    job = get_job(job_id)
    if not job or job["status"] != "completed":
        raise HTTPException(400, "Job not ready for download")

    zip_path = OUTPUT_DIR / f"{job_id}.zip"
    if not zip_path.exists():
        job_output_dir = OUTPUT_DIR / job_id
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in sorted(job_output_dir.iterdir()):
                zf.write(f, f.name)

    return FileResponse(
        zip_path,
        filename=f"impasto_{job_id[:8]}.zip",
        media_type="application/zip",
    )
