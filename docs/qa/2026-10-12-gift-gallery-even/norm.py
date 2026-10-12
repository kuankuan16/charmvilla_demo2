# Normalise a tea gift box gallery photograph: same neutral grey gradient, same product size, soft shadow kept/added.
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
OW,OH=1856,2320               # 4:5 output
C0=np.array([232,231,229.]); C1=np.array([219,218,216.])   # target gradient, top-left -> bottom-right (neutral grey)
def target_bg(w,h):
    yy,xx=np.mgrid[0:h,0:w]; t=((xx/w)+(yy/h))/2
    return C0[None,None,:]*(1-t[...,None])+C1[None,None,:]*t[...,None]
def fit_bg(a):
    H,W,_=a.shape; b=10
    m=np.zeros((H,W),bool); m[:b]=m[-b:]=m[:,:b]=m[:,-b:]=True
    yy,xx=np.mgrid[0:H,0:W]
    N=max(W,H); A=np.c_[xx[m],yy[m],(xx*yy)[m]/N,(xx*xx)[m]/N,(yy*yy)[m]/N,np.ones(m.sum())]
    bg=np.zeros_like(a)
    for c in range(3):
        coef,*_=np.linalg.lstsq(A,a[:,:,c][m],rcond=None)
        bg[:,:,c]=coef[0]*xx+coef[1]*yy+coef[2]*xx*yy/N+coef[3]*xx*xx/N+coef[4]*yy*yy/N+coef[5]
    return bg
def product_mask(a,bg,thr=0.085,clip=None):
    r=a/np.maximum(bg,1)
    spread=r.max(2)-r.min(2); mean=r.mean(2)
    m=(spread>thr)|(mean>1.04+(thr-0.085))|(mean<0.55)
    if clip: cm=np.zeros_like(m); cm[clip[1]:clip[3],clip[0]:clip[2]]=True; m&=cm
    m=ndi.binary_opening(m,iterations=2); m=ndi.binary_closing(m,iterations=4)
    lab,n=ndi.label(m)
    if n>1:
        sizes=ndi.sum(m,lab,range(1,n+1)); keep=np.isin(lab,1+np.where(sizes>sizes.max()*0.02)[0]); m=keep
    m=ndi.binary_fill_holes(m)
    import os
    if os.environ.get('HULL'):
        from scipy.spatial import ConvexHull
        from PIL import ImageDraw
        er=ndi.binary_erosion(m,iterations=int(os.environ['HULL'])); lab,n=ndi.label(er); lab=np.where(m,ndi.grey_dilation(lab,size=2*int(os.environ['HULL'])+3),0); out=Image.new('L',(m.shape[1],m.shape[0]),0); d=ImageDraw.Draw(out)
        for i in range(1,n+1):
            ys,xs=np.where(lab==i)
            if len(xs)<500: continue
            pts=np.c_[xs,ys]; h=ConvexHull(pts); d.polygon([tuple(map(int,pts[v])) for v in h.vertices],fill=255)
        m=np.asarray(out)>0
    if os.environ.get('POLY'):
        import json as _j
        from PIL import ImageDraw
        out=Image.fromarray((m*255).astype(np.uint8)); d=ImageDraw.Draw(out)
        for poly in _j.loads(os.environ['POLY']): d.polygon([tuple(p) for p in poly],fill=255)
        m=np.asarray(out)>0
    return m
def run(src,dst,target_w,max_h,cutout=False,preview=None,thr=0.085,clip=None):
    im=Image.open(src)
    if cutout:
        rgba=np.asarray(im.convert('RGBA')).astype(float)
        alpha=rgba[...,3]/255; ys,xs=np.where(alpha>0.08)
        x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
        pw,ph=x1-x0,y1-y0
        area=(alpha>0.5).sum(); s=min(target_w*OW/np.sqrt(area), max_h*OH/ph, 0.80*OW/pw)
        crop=im.convert('RGBA').crop((x0,y0,x1+1,y1+1)); crop=crop.resize((round(crop.width*s),round(crop.height*s)),Image.LANCZOS)
        out=target_bg(OW,OH)
        px=(OW-crop.width)//2; py=(OH-crop.height)//2
        A=np.asarray(crop).astype(float); al=A[...,3:]/255
        # faint contact shadow: blurred alpha, offset down-right, multiply the ground
        sh=Image.fromarray((al[...,0]*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(OW*0.018))
        shadow=np.zeros((OH,OW)); sa=np.asarray(sh)/255.
        ox,oy=px+int(OW*0.008),py+int(OW*0.022)
        shadow[oy:oy+sa.shape[0],ox:ox+sa.shape[1]]=sa[:OH-oy,:OW-ox]
        out=out*(1-0.16*shadow[...,None])
        reg=out[py:py+crop.height,px:px+crop.width]
        out[py:py+crop.height,px:px+crop.width]=A[...,:3]*al+reg*(1-al)
        Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(dst,quality=92,method=6)
        return dict(src=src,scale=round(s,3),box=[int(pw*s),int(ph*s)],area=round(float(np.sqrt(area))*s/OW,3))
    a=np.asarray(im.convert('RGB')).astype(float); H,W,_=a.shape
    bg=fit_bg(a); m=product_mask(a,bg,thr,clip)
    ys,xs=np.where(m); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max(); pw,ph=x1-x0,y1-y0
    area=m.sum(); s=min(target_w*OW/np.sqrt(area), max_h*OH/ph, 0.80*OW/pw)
    ratio=np.clip(a/np.maximum(bg,1),0,1.0)        # ground + shadow as a multiplier of the old ground
    yy,xx=np.mgrid[0:H,0:W]; dist=np.minimum.reduce([xx,yy,W-1-xx,H-1-yy])/(0.12*min(W,H)); wgt=np.clip(dist,0,1); wgt=wgt*wgt*(3-2*wgt)
    ratio=1+(ratio-1)*wgt[...,None]
    soft=ndi.gaussian_filter(m.astype(float),1.2)
    # scale both layers, centring the product's box in the frame
    def scaled(arr):
        img=Image.fromarray(arr.astype(np.float32)) if arr.ndim==2 else None
        return img
    nw,nh=round(W*s),round(H*s)
    cx,cy=(x0+x1)/2*s,(y0+y1)/2*s
    offx,offy=round(OW/2-cx),round(OH/2-cy)
    def place(arr,fill):
        chans=[arr] if arr.ndim==2 else [arr[...,c] for c in range(arr.shape[2])]
        outc=[]
        for ch in chans:
            r=Image.fromarray(ch.astype(np.float32)).resize((nw,nh),Image.LANCZOS)
            canvas=np.full((OH,OW),fill,np.float32)
            sx0,sy0=max(0,-offx),max(0,-offy); dx0,dy0=max(0,offx),max(0,offy)
            w=min(nw-sx0,OW-dx0); h=min(nh-sy0,OH-dy0)
            canvas[dy0:dy0+h,dx0:dx0+w]=np.asarray(r)[sy0:sy0+h,sx0:sx0+w]
            outc.append(canvas)
        return outc[0] if arr.ndim==2 else np.stack(outc,-1)
    R=place(ratio,1.0); P=place(a,0); M=np.clip(place(soft,0),0,1)[...,None]
    tb=target_bg(OW,OH)
    out=tb*R*(1-M)+P*M
    Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(dst,quality=92,method=6)
    if preview:
        pv=a.copy(); edge=m ^ ndi.binary_erosion(m,iterations=4); pv[edge]=[255,0,0]
        Image.fromarray(pv.astype(np.uint8)).resize((W//4,H//4)).save(preview)
    return dict(src=src,scale=round(s,3),box=[int(pw*s),int(ph*s)],area=round(float(np.sqrt(area))*s/OW,3),edge_src=[int(x0),int(y0),int(W-x1),int(H-y1)])
if __name__=='__main__':
    import json
    print(json.dumps(run(sys.argv[1],sys.argv[2],float(sys.argv[3]),float(sys.argv[4]),sys.argv[5]=='1',sys.argv[6] if len(sys.argv)>6 else None, float(sys.argv[7]) if len(sys.argv)>7 else 0.085, json.loads(sys.argv[8]) if len(sys.argv)>8 else None)))
