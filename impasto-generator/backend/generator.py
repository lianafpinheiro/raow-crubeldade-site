import asyncio
import base64
import colorsys
import json
import os
import random
from pathlib import Path

import httpx
from PIL import Image

from database import update_job

OUTPUT_DIR = Path("outputs")


def analyze_image(image_path: str) -> dict:
    img = Image.open(image_path).convert("RGB").resize((50, 50))
    pixels = list(img.getdata())

    avg_r = sum(p[0] for p in pixels) / len(pixels)
    avg_g = sum(p[1] for p in pixels) / len(pixels)
    avg_b = sum(p[2] for p in pixels) / len(pixels)

    brightness = (avg_r + avg_g + avg_b) / 3
    h, s, _ = colorsys.rgb_to_hsv(avg_r / 255, avg_g / 255, avg_b / 255)
    hue = h * 360

    if s < 0.2:
        palette = "warm ivory, charcoal, and stone gray"
    elif hue < 30 or hue > 330:
        palette = "deep crimson, burnt sienna, and cream"
    elif hue < 70:
        palette = "warm ochre, raw sienna, and charcoal"
    elif hue < 150:
        palette = "olive, moss green, and ivory"
    elif hue < 220:
        palette = "teal, sage, and warm white"
    elif hue < 270:
        palette = "slate blue, prussian blue, and silver"
    else:
        palette = "dusty mauve, violet ash, and gold"

    if brightness < 100:
        light = "dark shadows and moody atmosphere"
    elif brightness < 180:
        light = "balanced luminosity with soft shadows"
    else:
        light = "high-key luminous atmosphere"

    return {"palette": palette, "lighting": light, "brightness": round(brightness, 1)}


def build_prompts(analysis: dict) -> dict:
    p = analysis["palette"]
    l = analysis["lighting"]

    return {
        "A1": (
            f"Architectural negative cut-out geometry, deep sculptural shadows, "
            f"ultra-thick impasto paint, three-layer relief structure, "
            f"{p} palette with one accent color, matte surface with subtle metallic highlights, "
            f"{l}, minimalist composition, museum-grade material study, "
            f"macro photography, extreme surface texture, fine art"
        ),
        "A2": (
            f"Organic tactile relief, curvilinear biomorphic forms, "
            f"{p} warm earth palette, heavy palette knife impasto technique, "
            f"three-layer paint structure with visible brushwork, handcrafted appearance, "
            f"deep dramatic shadows, minimalist abstract composition, "
            f"{l}, natural material study, macro texture photography"
        ),
        "A3": (
            f"High contrast graphic planes, cool architectural abstraction, "
            f"thick impasto layers with sharp geometric edges, "
            f"{p} with metallic edge accents, "
            f"strong single-source directional lighting, minimalist luxury aesthetic, "
            f"{l}, ultra-fine surface grain, product photography style, material design"
        ),
    }


async def generate_single_variant(
    client: httpx.AsyncClient,
    prompt: str,
    variant: str,
    job_output_dir: Path,
    analysis: dict,
) -> dict:
    seed = random.randint(10000, 99999)

    response = await client.post(
        "https://api.openai.com/v1/images/generations",
        json={
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "quality": "hd",
            "response_format": "b64_json",
        },
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"},
        timeout=120.0,
    )
    response.raise_for_status()

    img_b64 = response.json()["data"][0]["b64_json"]
    img_bytes = base64.b64decode(img_b64)

    full_path = job_output_dir / f"{variant}_full.png"
    full_path.write_bytes(img_bytes)

    img = Image.open(full_path)
    w, h = img.size
    crop_size = min(w, h, 800)
    left = (w - crop_size) // 2
    top = (h - crop_size) // 2
    cropped = img.crop((left, top, left + crop_size, top + crop_size))
    crop_path = job_output_dir / f"{variant}_crop.png"
    cropped.save(crop_path, "PNG")

    metadata = {
        "variation": variant,
        "seed": seed,
        "palette": analysis["palette"],
        "resolution": f"{w}x{h}",
        "crop": f"{crop_size}x{crop_size}",
        "lighting": "single_directional",
        "surface": "matte_impasto",
    }
    meta_path = job_output_dir / f"{variant}_metadata.json"
    meta_path.write_text(json.dumps(metadata, indent=2))

    return {
        "full": f"outputs/{job_output_dir.name}/{variant}_full.png",
        "crop": f"outputs/{job_output_dir.name}/{variant}_crop.png",
        "metadata": metadata,
    }


async def generate_variants(job_id: str, input_path: str):
    try:
        update_job(job_id, "analyzing")
        analysis = analyze_image(input_path)
        prompts = build_prompts(analysis)

        job_output_dir = OUTPUT_DIR / job_id
        job_output_dir.mkdir(exist_ok=True)

        update_job(job_id, "generating")

        async with httpx.AsyncClient() as client:
            tasks = [
                generate_single_variant(client, prompts[v], v, job_output_dir, analysis)
                for v in ("A1", "A2", "A3")
            ]
            results = await asyncio.gather(*tasks, return_exceptions=True)

        variants = {}
        for variant, result in zip(("A1", "A2", "A3"), results):
            if isinstance(result, Exception):
                variants[variant] = {"error": str(result)}
            else:
                variants[variant] = result

        update_job(job_id, "completed", variants)

    except Exception as e:
        update_job(job_id, "failed", error=str(e))
