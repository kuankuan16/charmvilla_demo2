R=/Users/kuan/Documents/Codex/10-02-charmvilla-demo2/public/media/site
S=$(dirname "$0")
T=${1:-0.5}
while read f c; do
  extra=""
  if [ "$f" = studio-reunion-paulownia-gift-box-unboxed-v5 ]; then
    POLY='[[[640,380],[1760,760],[1748,860],[1540,1400],[400,1060],[400,712]]]' HULL=25 $S/../venv/bin/python $S/norm.py $R/$f.webp $S/out2/$f.webp $T 0.52 $c $S/pv/$f.png 0.16 "[50,360,1790,2140]" 2>/dev/null | python3 -c 'import json,sys;d=json.load(sys.stdin);print("'$f'",d["scale"],d["box"],d["area"])'
  else
    $S/../venv/bin/python $S/norm.py $R/$f.webp $S/out2/$f.webp $T 0.52 $c $S/pv/$f.png 2>/dev/null | python3 -c 'import json,sys;d=json.load(sys.stdin);print("'$f'",d["scale"],d["box"],d["area"])'
  fi
done < $S/list.txt
