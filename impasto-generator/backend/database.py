import json
import sqlite3

DB_PATH = "impasto.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            status TEXT NOT NULL DEFAULT 'queued',
            input_path TEXT,
            variants TEXT DEFAULT '{}',
            error TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


def create_job(job_id: str, input_path: str):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO jobs (id, status, input_path) VALUES (?, 'queued', ?)",
        (job_id, input_path),
    )
    conn.commit()
    conn.close()


def update_job(job_id: str, status: str, variants: dict = None, error: str = None):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "UPDATE jobs SET status=?, variants=?, error=? WHERE id=?",
        (status, json.dumps(variants or {}), error, job_id),
    )
    conn.commit()
    conn.close()


def get_job(job_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    row = conn.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
    conn.close()
    if not row:
        return None
    result = dict(row)
    result["variants"] = json.loads(result["variants"] or "{}")
    return result
