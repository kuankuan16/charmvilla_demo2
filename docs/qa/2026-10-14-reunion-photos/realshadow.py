# keep the photograph's own shadow: norm.py's non-cutout mode (ground replaced by the site grey, shadow kept as a multiplier), large frame
import sys, json
sys.path.insert(0,'/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/docs/qa/2026-10-12-gift-gallery-even')
import norm
norm.OW,norm.OH=3200,4000
print(norm.run(sys.argv[1],sys.argv[2],0.45,0.52,False,sys.argv[3]))
