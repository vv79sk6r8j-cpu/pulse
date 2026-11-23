#!/usr/bin/env python3
"""Generate distributable PDFs from locally stored PULSE document template sources.

Run: python scripts/build-document-pdfs.py
Outputs: src/documents/preoperative-questionnaire.pdf, patient-memos.pdf
No external document links or services are used.
"""
import json
import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "src" / "documents"
FONT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
FONT_BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
if not FONT.exists():
    raise RuntimeError("Install DejaVu Sans font to generate Cyrillic PDFs")
pdfmetrics.registerFont(TTFont("DejaVu", str(FONT)))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", str(FONT_BOLD)))

style = ParagraphStyle("body", fontName="DejaVu", fontSize=9.5, leading=15, textColor=colors.HexColor("#1c3038"), spaceAfter=5*mm, alignment=TA_LEFT, wordWrap="CJK")
heading = ParagraphStyle("heading", parent=style, fontName="DejaVu-Bold", fontSize=15, leading=21, spaceAfter=9*mm)

def read_field(ts: str, field: str) -> str:
    match = re.search(r"^  " + re.escape(field) + r": (.+?)(?:,)?$", ts, re.M)
    if not match:
        raise ValueError("Missing " + field)
    return json.loads(match.group(1).rstrip(","))

def build(filename: str):
    source = DOCS / (filename + ".ts")
    text = source.read_text(encoding="utf-8")
    title = read_field(text, "title")
    body = read_field(text, "content")
    output = DOCS / (filename + ".pdf")
    document = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=20*mm, bottomMargin=20*mm, title=title, author="PULSE")
    story = [Paragraph(escape(title), heading)]
    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            story.append(Spacer(1, 2.2*mm))
            continue
        # Preserve the original wording and question order; convert plain lines to wrapped PDF paragraphs.
        story.append(Paragraph(escape(line), style))
    document.build(story)
    print(output, output.stat().st_size)

for filename in ("preoperative-questionnaire", "patient-memos"):
    build(filename)
