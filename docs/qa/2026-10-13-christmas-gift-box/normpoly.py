import sys, json, numpy as np
sys.path.insert(0,'/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/docs/qa/2026-10-12-gift-gallery-even')
import norm
from PIL import Image, ImageDraw
poly=[tuple(p) for p in json.loads(sys.argv[3])]
def pm(a,bg,thr=0.085,clip=None):
    im=Image.new('L',(a.shape[1],a.shape[0]),0); ImageDraw.Draw(im).polygon(poly,fill=255); return np.asarray(im)>0
norm.product_mask=pm
print(norm.run(sys.argv[1],sys.argv[2],0.5,0.52,False,sys.argv[4]))
