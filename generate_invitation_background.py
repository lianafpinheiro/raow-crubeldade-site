#!/usr/bin/env python3
"""
Generate the background image for the interactive Kallyni invitation.
This creates a celestial-themed invitation card without the guest name.
"""

from PIL import Image, ImageDraw, ImageFont
import random
import math


def create_invitation_background(width=800, height=1200, output_path="assets/convite_base_sem_nome.png"):
    """
    Create a beautiful celestial-themed invitation background.

    Args:
        width: Image width in pixels
        height: Image height in pixels
        output_path: Path to save the generated image
    """
    # Create base image with gradient background
    img = Image.new('RGB', (width, height), color='#020614')
    draw = ImageDraw.Draw(img)

    # Create celestial gradient background
    for y in range(height):
        # Multi-stop gradient from dark blue to deeper dark blue
        ratio = y / height
        if ratio < 0.3:
            # Top: lighter blue
            r = int(7 + (11 - 7) * (ratio / 0.3))
            g = int(27 + (35 - 27) * (ratio / 0.3))
            b = int(51 + (73 - 51) * (ratio / 0.3))
        elif ratio < 0.6:
            # Middle: transition to dark
            local_ratio = (ratio - 0.3) / 0.3
            r = int(11 - 9 * local_ratio)
            g = int(35 - 29 * local_ratio)
            b = int(73 - 53 * local_ratio)
        else:
            # Bottom: darkest
            local_ratio = (ratio - 0.6) / 0.4
            r = int(2 + 3 * local_ratio)
            g = int(6 + 2 * local_ratio)
            b = int(20 - 6 * local_ratio)

        color = (r, g, b)
        draw.line([(0, y), (width, y)], fill=color)

    # Add stars
    random.seed(42)  # Reproducible stars
    for _ in range(150):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(1, 3)
        brightness = random.randint(180, 255)

        # Draw star with slight glow
        for i in range(size, 0, -1):
            alpha = int(brightness * (i / size))
            star_color = (alpha, alpha, alpha)
            draw.ellipse(
                [x - i, y - i, x + i, y + i],
                fill=star_color
            )

    # Add some larger, twinkling stars
    for _ in range(20):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(2, 5)

        # Gold-tinted stars
        draw.ellipse(
            [x - size, y - size, x + size, y + size],
            fill=(243, 217, 164, 200)
        )

        # Cross effect
        draw.line([x - size*2, y, x + size*2, y], fill=(243, 217, 164), width=1)
        draw.line([x, y - size*2, x, y + size*2], fill=(243, 217, 164), width=1)

    # Try to load fonts, fall back to default if not available
    try:
        # Title fonts
        font_title_main = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 60)
        font_title_script = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf", 80)
        font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 36)
        font_details = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except:
        # Fallback to default font with different sizes
        font_title_main = ImageFont.load_default()
        font_title_script = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_details = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Text color (gold)
    gold_color = (243, 217, 164)
    gold_intense = (247, 199, 107)

    # Draw decorative border
    border_margin = 40
    draw.rectangle(
        [border_margin, border_margin, width - border_margin, height - border_margin],
        outline=gold_color,
        width=2
    )

    # Draw inner decorative corners
    corner_size = 30
    corners = [
        (border_margin, border_margin),  # Top-left
        (width - border_margin, border_margin),  # Top-right
        (border_margin, height - border_margin),  # Bottom-left
        (width - border_margin, height - border_margin)  # Bottom-right
    ]

    for cx, cy in corners:
        # Draw decorative corner elements
        offset = 10
        if cx < width / 2 and cy < height / 2:  # Top-left
            draw.line([cx + offset, cy + offset, cx + corner_size, cy + offset], fill=gold_intense, width=2)
            draw.line([cx + offset, cy + offset, cx + offset, cy + corner_size], fill=gold_intense, width=2)
        elif cx > width / 2 and cy < height / 2:  # Top-right
            draw.line([cx - offset, cy + offset, cx - corner_size, cy + offset], fill=gold_intense, width=2)
            draw.line([cx - offset, cy + offset, cx - offset, cy + corner_size], fill=gold_intense, width=2)
        elif cx < width / 2 and cy > height / 2:  # Bottom-left
            draw.line([cx + offset, cy - offset, cx + corner_size, cy - offset], fill=gold_intense, width=2)
            draw.line([cx + offset, cy - offset, cx + offset, cy - corner_size], fill=gold_intense, width=2)
        else:  # Bottom-right
            draw.line([cx - offset, cy - offset, cx - corner_size, cy - offset], fill=gold_intense, width=2)
            draw.line([cx - offset, cy - offset, cx - offset, cy - corner_size], fill=gold_intense, width=2)

    # Title section (top)
    y_pos = 120

    # Main title: "VOCÊ ESTÁ CONVIDADO PARA"
    title_text = "VOCÊ ESTÁ CONVIDADO PARA"
    bbox = draw.textbbox((0, 0), title_text, font=font_details)
    text_width = bbox[2] - bbox[0]
    x_centered = (width - text_width) // 2

    # Draw text with shadow for depth
    draw.text((x_centered + 2, y_pos + 2), title_text, fill=(0, 0, 0), font=font_details)
    draw.text((x_centered, y_pos), title_text, fill=gold_color, font=font_details)

    # Event title
    y_pos += 100
    title_text = "15 ANOS DA"
    bbox = draw.textbbox((0, 0), title_text, font=font_title_main)
    text_width = bbox[2] - bbox[0]
    x_centered = (width - text_width) // 2

    draw.text((x_centered + 3, y_pos + 3), title_text, fill=(0, 0, 0), font=font_title_main)
    draw.text((x_centered, y_pos), title_text, fill=gold_intense, font=font_title_main)

    # Kallyni (script style)
    y_pos += 90
    kallyni_text = "Kallyni"
    bbox = draw.textbbox((0, 0), kallyni_text, font=font_title_script)
    text_width = bbox[2] - bbox[0]
    x_centered = (width - text_width) // 2

    draw.text((x_centered + 4, y_pos + 4), kallyni_text, fill=(0, 0, 0), font=font_title_script)
    draw.text((x_centered, y_pos), kallyni_text, fill=gold_color, font=font_title_script)

    # Subtitle
    y_pos += 110
    subtitle_text = "A Canção do Céu Azul"
    bbox = draw.textbbox((0, 0), subtitle_text, font=font_subtitle)
    text_width = bbox[2] - bbox[0]
    x_centered = (width - text_width) // 2

    draw.text((x_centered + 2, y_pos + 2), subtitle_text, fill=(0, 0, 0), font=font_subtitle)
    draw.text((x_centered, y_pos), subtitle_text, fill=(232, 237, 247), font=font_subtitle)

    # Decorative line
    y_pos += 80
    line_width = 300
    draw.line(
        [(width // 2 - line_width // 2, y_pos), (width // 2 + line_width // 2, y_pos)],
        fill=gold_color,
        width=2
    )

    # Guest name placeholder (empty space)
    # This is where the JavaScript will add the personalized name
    y_pos += 60  # Space for guest name (around y=620)

    # Decorative line
    y_pos += 60
    draw.line(
        [(width // 2 - line_width // 2, y_pos), (width // 2 + line_width // 2, y_pos)],
        fill=gold_color,
        width=2
    )

    # Event details
    y_pos += 80
    details = [
        "20 de Dezembro de 2025",
        "19h30",
        "",
        "Cantina Nostra",
        "Rua 10 de Novembro"
    ]

    for detail in details:
        if detail:
            bbox = draw.textbbox((0, 0), detail, font=font_details)
            text_width = bbox[2] - bbox[0]
            x_centered = (width - text_width) // 2

            draw.text((x_centered + 2, y_pos + 2), detail, fill=(0, 0, 0), font=font_details)
            draw.text((x_centered, y_pos), detail, fill=(232, 237, 247), font=font_details)

        y_pos += 45

    # RSVP text
    y_pos += 40
    rsvp_text = "Confirme sua presença:"
    bbox = draw.textbbox((0, 0), rsvp_text, font=font_small)
    text_width = bbox[2] - bbox[0]
    x_centered = (width - text_width) // 2

    draw.text((x_centered, y_pos), rsvp_text, fill=(200, 200, 200), font=font_small)

    y_pos += 35
    phone_text = "+55 54 99638-1003"
    bbox = draw.textbbox((0, 0), phone_text, font=font_details)
    text_width = bbox[2] - bbox[0]
    x_centered = (width - text_width) // 2

    draw.text((x_centered + 2, y_pos + 2), phone_text, fill=(0, 0, 0), font=font_details)
    draw.text((x_centered, y_pos), phone_text, fill=gold_intense, font=font_details)

    # Save the image
    img.save(output_path, quality=95)
    print(f"✨ Invitation background generated successfully: {output_path}")
    print(f"   Dimensions: {width}x{height}px")


if __name__ == "__main__":
    import os

    # Ensure assets directory exists
    os.makedirs("assets", exist_ok=True)

    # Generate the invitation background
    create_invitation_background()

    print("\n🎉 All done! The background image is ready for the interactive invitation generator.")
