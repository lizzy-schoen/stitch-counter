#!/usr/bin/env python3
"""Generate skill icons for Craft Count Alexa skill."""

from PIL import Image, ImageDraw, ImageFont
import math

def draw_icon(size):
    """Create a Craft Count icon at the given size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factor relative to 512
    s = size / 512

    # Background: warm coral/salmon rounded rectangle
    bg_color = (232, 119, 104)  # warm coral
    draw.rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=int(80 * s),
        fill=bg_color
    )

    # Draw a yarn ball (circle with curved lines)
    yarn_cx = int(256 * s)
    yarn_cy = int(240 * s)
    yarn_r = int(120 * s)
    yarn_color = (255, 255, 255)

    # Main yarn ball circle
    draw.ellipse(
        [yarn_cx - yarn_r, yarn_cy - yarn_r, yarn_cx + yarn_r, yarn_cy + yarn_r],
        fill=yarn_color
    )

    # Draw curved lines on the yarn ball to give it texture
    line_color = (210, 95, 80)  # slightly darker than bg
    line_width = max(int(4 * s), 1)

    # Horizontal curved line
    points = []
    step = max(int(3 * s), 1)
    for x in range(-yarn_r + int(20 * s), yarn_r - int(20 * s), step):
        # Sine wave across the ball
        rel_x = x / yarn_r
        y_offset = int(15 * s * math.sin(rel_x * math.pi * 2))
        # Only draw within the circle
        max_y = math.sqrt(max(0, yarn_r**2 - x**2))
        if abs(y_offset) < max_y:
            points.append((yarn_cx + x, yarn_cy + y_offset))
    if len(points) > 1:
        draw.line(points, fill=line_color, width=line_width)

    # Upper curved line
    points = []
    for x in range(-yarn_r + int(30 * s), yarn_r - int(30 * s), step):
        rel_x = x / yarn_r
        y_offset = int(-40 * s + 12 * s * math.sin(rel_x * math.pi * 1.5))
        max_y = math.sqrt(max(0, yarn_r**2 - x**2))
        if abs(y_offset) < max_y:
            points.append((yarn_cx + x, yarn_cy + y_offset))
    if len(points) > 1:
        draw.line(points, fill=line_color, width=line_width)

    # Lower curved line
    points = []
    for x in range(-yarn_r + int(30 * s), yarn_r - int(30 * s), step):
        rel_x = x / yarn_r
        y_offset = int(45 * s + 10 * s * math.sin(rel_x * math.pi * 1.8))
        max_y = math.sqrt(max(0, yarn_r**2 - x**2))
        if abs(y_offset) < max_y:
            points.append((yarn_cx + x, yarn_cy + y_offset))
    if len(points) > 1:
        draw.line(points, fill=line_color, width=line_width)

    # Draw a knitting needle (diagonal line through the yarn ball)
    needle_color = (80, 60, 50)  # dark brown
    needle_width = max(int(8 * s), 2)

    # Needle goes from upper-right through ball to lower-left
    needle_start = (int(340 * s), int(130 * s))
    needle_end = (int(170 * s), int(360 * s))
    draw.line([needle_start, needle_end], fill=needle_color, width=needle_width)

    # Needle tip (small circle at the top)
    tip_r = max(int(6 * s), 2)
    draw.ellipse(
        [needle_start[0] - tip_r, needle_start[1] - tip_r,
         needle_start[0] + tip_r, needle_start[1] - tip_r + tip_r * 2],
        fill=needle_color
    )

    # Draw a small "count" indicator - a tiny number badge
    badge_cx = int(350 * s)
    badge_cy = int(340 * s)
    badge_r = int(45 * s)
    badge_color = (255, 220, 100)  # golden yellow
    draw.ellipse(
        [badge_cx - badge_r, badge_cy - badge_r, badge_cx + badge_r, badge_cy + badge_r],
        fill=badge_color,
        outline=(200, 170, 60),
        width=max(int(3 * s), 1)
    )

    # Draw "42" in the badge (a fun row count)
    try:
        font_size = int(36 * s)
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except (OSError, IOError):
        font = ImageFont.load_default()

    text = "42"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(
        (badge_cx - tw // 2, badge_cy - th // 2 - int(4 * s)),
        text,
        fill=(80, 60, 50),
        font=font
    )

    return img.convert('RGB')


if __name__ == '__main__':
    import os

    icon_dir = os.path.join(os.path.dirname(__file__), 'skill-package')

    # Generate 512x512
    large = draw_icon(512)
    large_path = os.path.join(icon_dir, 'icon-512.png')
    large.save(large_path)
    print(f"Created {large_path}")

    # Generate 108x108 by downscaling the large icon (better quality)
    small = large.resize((108, 108), Image.LANCZOS)
    small_path = os.path.join(icon_dir, 'icon-108.png')
    small.save(small_path)
    print(f"Created {small_path}")
