#!/usr/bin/env python3
import base64
from pathlib import Path
root = Path(__file__).resolve().parents[1]
src = root / 'scripts' / 'daily-b64'
out = root / 'downloads'
out.mkdir(exist_ok=True)
for p in sorted(src.glob('*.xlsx.b64')):
    raw = ''.join(p.read_text().split())
    dest = out / p.name.replace('.b64', '')
    dest.write_bytes(base64.b64decode(raw))
    print('wrote', dest, dest.stat().st_size)
