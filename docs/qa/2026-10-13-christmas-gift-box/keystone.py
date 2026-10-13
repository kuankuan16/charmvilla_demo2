# straighten a cut-out front photo: map the box's traced quad (TL, TR, BR, BL) onto an upright rectangle
import sys, json, numpy as np
from PIL import Image
src,dst,quad=sys.argv[1],sys.argv[2],json.loads(sys.argv[3])
im=Image.open(src).convert('RGBA')
(tlx,tly),(trx,try_),(brx,bry),(blx,bly)=quad
L,R=min(tlx,blx),max(trx,brx); T,B=min(tly,try_),max(bly,bry)
dstq=[(L,T),(R,T),(R,B),(L,B)]
def coeffs(pa,pb):
    A=[];b=[]
    for (x,y),(X,Y) in zip(pa,pb):
        A+= [[x,y,1,0,0,0,-X*x,-X*y],[0,0,0,x,y,1,-Y*x,-Y*y]]; b+=[X,Y]
    return np.linalg.solve(np.array(A,float),np.array(b,float)).tolist()
c=coeffs(dstq,quad)   # output coords -> input coords
out=im.transform(im.size,Image.PERSPECTIVE,c,Image.BICUBIC)
out.save(dst)
