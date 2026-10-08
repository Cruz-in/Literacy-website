# Builds the treeline of hero.jpg as an alpha mask (opaque = forest,
# clear = sky), so a copy of the photo can sit in front of the hero
# title. Written into styles.css as a data: URI on `--ridge`, because
# browsers fetch mask images in CORS mode and file:// fails that.
# Run from the site folder; re-run if hero.jpg changes.
import base64, io, re
from PIL import Image, ImageFilter
import numpy as np

img = Image.open("images/hero.jpg").convert("L").filter(ImageFilter.GaussianBlur(1.5))
lum = np.asarray(img).astype(int)
h, w = lum.shape
dark = lum < 100            # trees ~35-90, sky and lit cloud ~110-215
RUN, START = 25, 400        # forest = 25 dark rows in a row; skip the dark clouds up top

ridge = np.empty(w)
for x in range(w):
    col = dark[START:, x]
    # first row from which the next RUN rows are all dark
    runs = np.convolve(col, np.ones(RUN, int), "valid") == RUN
    ridge[x] = START + (int(np.argmax(runs)) if runs.any() else h - START)

# a dark cloud or a misty patch makes the ridge jump; treetops only
# poke up a few dozen px. Walk the ridge from the left (clean there)
# and keep a column only if it's near the last kept one; the rest
# are redrawn as a straight line between their good neighbours.
xs, good, last = np.arange(w), np.zeros(w, bool), ridge[0]
for x in xs:
    if abs(ridge[x] - last) < 60:
        good[x], last = True, ridge[x]
ridge = np.interp(xs, xs[good], ridge[good])
# that catches sudden jumps (the cloud) but follows a gentle dip (the
# mist notch), so also drop columns far below a smooth fitted curve
for _ in range(3):
    fit = np.polyval(np.polyfit(xs[good], ridge[good], 4), xs)
    good = ridge - fit < 40
ridge = np.interp(xs, xs[good], ridge[good])

alpha = np.zeros((h, w), np.uint8)
for x in range(w):
    alpha[int(ridge[x]):, x] = 255

mask = Image.new("L", (w, h), 0)
mask.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1)))
buf = io.BytesIO()
mask.resize((w // 2, h // 2), Image.LANCZOS).save(buf, "PNG", optimize=True)
uri = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

css = open("styles.css", encoding="utf-8").read()
css = re.sub(r'--ridge: url\("[^"]*"\)', f'--ridge: url("{uri}")', css)
open("styles.css", "w", encoding="utf-8").write(css)
