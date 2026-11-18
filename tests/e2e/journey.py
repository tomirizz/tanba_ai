"""Browser test of the whole user journey, in English and Kazakh.

It opens the running app in a hidden Chrome window and acts like a user:
switches language, tries wrong files, runs a sample label through all three
steps, edits the translation, downloads the text file, and repeats on a
phone-sized screen. Screenshots of every step are saved as evidence.

The app must run in demo mode (no GEMINI_API_KEY), because the test expects
the "AI is not connected" message for an uploaded photo.

Setup (once):   pip install playwright && playwright install chromium
Run:            npm run build && npm run start      (in one terminal)
                python tests/e2e/journey.py http://localhost:3000 screenshots public/samples/oat-cookies.png
"""
import os
import sys, json
from playwright.sync_api import sync_playwright
BASE = sys.argv[1]; SHOTS = sys.argv[2]; SAMPLE = sys.argv[3]
os.makedirs(SHOTS, exist_ok=True)
res = []
def ok(name, cond, extra=""):
    res.append((name, bool(cond), extra)); print(("PASS " if cond else "FAIL ") + name, extra)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1280, "height": 900}, accept_downloads=True)
    pg = ctx.new_page()
    errors = []
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(BASE, wait_until="networkidle")
    ok("EN heading", "Turn a foreign food label" in pg.inner_text("h1"))
    pg.screenshot(path=f"{SHOTS}/1-upload-en.png", full_page=True)

    # language switch + persistence
    pg.get_by_role("button", name="ҚАЗ").click()
    ok("KZ heading", "Шетелдік азық-түлік" in pg.inner_text("h1"))
    ok("html lang kk", pg.evaluate("document.documentElement.lang") == "kk")
    pg.reload(wait_until="networkidle")
    ok("KZ persists after reload", "Шетелдік" in pg.inner_text("h1"))
    pg.screenshot(path=f"{SHOTS}/2-upload-kk.png", full_page=True)

    # boundary: wrong file type
    pg.set_input_files("#label-photo", {"name": "label.pdf", "mimeType": "application/pdf", "buffer": b"%PDF-1.4"})
    ok("KZ error wrong type", "қолдау көрсетілмейді" in pg.inner_text("[role=alert]"))
    pg.screenshot(path=f"{SHOTS}/3-error-type-kk.png", full_page=True)
    pg.get_by_role("button", name="EN").click()
    ok("EN error wrong type", "not supported" in pg.inner_text("[role=alert]"))
    # boundary: too large
    pg.set_input_files("#label-photo", {"name": "big.png", "mimeType": "image/png", "buffer": b"\x89PNG" + b"0" * (8 * 1024 * 1024 + 10)})
    ok("EN error too large", "larger than 8 MB" in pg.inner_text("[role=alert]"))
    # boundary: own photo while AI is not connected (demo mode)
    pg.set_input_files("#label-photo", SAMPLE)
    pg.wait_for_selector("[data-error=aiNotConfigured]")
    ok("EN error AI not connected", "AI is not connected" in pg.inner_text("[role=alert]"))
    pg.screenshot(path=f"{SHOTS}/4-error-ai-en.png", full_page=True)

    # core journey with a sample, in English
    pg.get_by_role("button", name="Oat cookies, label in English").click()
    pg.wait_for_selector(".review")
    ok("review heading focused", pg.evaluate("document.activeElement.tagName") == "H1")
    ok("summary 8 of 10", "8 of 10" in pg.inner_text(".check-summary"), pg.inner_text(".check-summary"))
    ok("demo note shown", pg.locator(".demo-note").count() == 1)
    pg.screenshot(path=f"{SHOTS}/5-review-en.png", full_page=True)
    pg.get_by_label("Importer and address, Kazakh").fill("«Алма Импорт» ЖШС, Астана қ., Қабанбай батыр даңғ., 1")
    pg.get_by_label("Importer and address, Russian").fill("ТОО «Алма Импорт», г. Астана, пр. Кабанбай батыра, 1")
    ok("summary 9 of 10 after edit", "9 of 10" in pg.inner_text(".check-summary"))
    pg.get_by_label("The package has the EAC mark").check()
    ok("summary 10 of 10", "10 of 10" in pg.inner_text(".check-summary"))
    ok("warning gone", pg.locator(".actions-bar .warning").count() == 0)
    pg.get_by_role("button", name="Continue to download").click()
    pg.wait_for_selector(".sticker")
    st = pg.inner_text(".sticker")
    ok("sticker has KZ + RU + importer", "Сұлы печеньесі" in st or "сұлы печеньесі" in st)
    ok("sticker RU", "Овсяное печенье" in st and "Алма Импорт" in st)
    pg.screenshot(path=f"{SHOTS}/6-download-en.png", full_page=True)
    with pg.expect_download() as d:
        pg.get_by_role("button", name="Download text file").click()
    path = d.value.path()
    txt = open(path, encoding="utf-8-sig").read()
    ok("txt file content", "Құрамы:" in txt and "Состав:" in txt and "Импортёр и адрес:" in txt, f"{len(txt)} chars")
    open(f"{SHOTS}/tanba-label.txt", "w", encoding="utf8").write(txt)
    # print layout
    pg.emulate_media(media="print")
    pg.screenshot(path=f"{SHOTS}/7-print.png", full_page=True)
    pg.emulate_media(media="screen")
    # back to editing keeps edits
    pg.get_by_role("button", name="Back to editing").click()
    ok("edits kept", "Алма Импорт" in pg.get_by_label("Importer and address, Russian").input_value())

    # second sample in Kazakh, on a phone-sized screen
    pg.get_by_role("button", name="Choose another photo").click()
    pg.get_by_role("button", name="ҚАЗ").click()
    pg.set_viewport_size({"width": 390, "height": 800})
    pg.screenshot(path=f"{SHOTS}/8-upload-kk-mobile.png", full_page=True)
    pg.get_by_role("button", name="Жаңғақты шоколад, түрік тіліндегі заттаңба").click()
    pg.wait_for_selector(".review")
    ok("KZ summary 6 / 10", "6 / 10" in pg.inner_text(".check-summary"), pg.inner_text(".check-summary"))
    pg.screenshot(path=f"{SHOTS}/9-review-kk-mobile.png", full_page=True)
    pg.get_by_role("button", name="Жүктеп алуға өту").click()
    pg.wait_for_selector(".sticker")
    ok("KZ warning on download", "жетіспейтін" in pg.inner_text(".download-head"))
    pg.screenshot(path=f"{SHOTS}/10-download-kk-mobile.png", full_page=True)
    w = pg.evaluate("document.documentElement.scrollWidth")
    ok("no horizontal scroll on phone", w <= 390, str(w))
    errors = [e for e in errors if "status of 503" not in e]  # the 503 is the expected "AI not connected" answer
    ok("no unexpected console errors", not errors, json.dumps(errors[:5], ensure_ascii=False))
    b.close()
bad = [r for r in res if not r[1]]
print(f"\n{len(res) - len(bad)}/{len(res)} passed")
sys.exit(1 if bad else 0)
