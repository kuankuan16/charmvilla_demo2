import sys, json, numpy as np
sys.path.insert(0,'/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/docs/qa/2026-10-12-gift-gallery-even')
import norm
norm.OW,norm.OH=3200,4000  # photographer original 4763px: large frame so detail survives
from PIL import Image, ImageDraw, ImageFilter
src,dst,poly=sys.argv[1],sys.argv[2],sys.argv[3]
im=Image.open(src).convert('RGB'); a=np.asarray(im).astype(float)
if poly=='auto':
    m=norm.product_mask(a,norm.fit_bg(a)); mask=Image.fromarray((m*255).astype(np.uint8))
else:
    mask=Image.new('L',im.size,0); ImageDraw.Draw(mask).polygon([tuple(p) for p in json.loads(poly)],fill=255)
mask=mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
rgba=im.convert('RGBA'); rgba.putalpha(mask); tmp=dst+'.png'; rgba.save(tmp)
print(norm.run(tmp,dst,0.45,0.52,True))
