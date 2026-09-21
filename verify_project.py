from pathlib import Path
import json, re, hashlib, sys

ROOT=Path(__file__).resolve().parent
errors=[]
notes=[]

pkg=json.loads((ROOT/'package.json').read_text())
app=json.loads((ROOT/'app.json').read_text())
if pkg.get('version')!='4.6.1': errors.append('package.json version is not 4.6.1')
if app.get('expo',{}).get('version')!='4.6.1': errors.append('app.json version is not 4.6.1')
if app.get('expo',{}).get('ios',{}).get('supportsTablet') is not True: errors.append('tablet support is not enabled')

js=list(ROOT.glob('*.js'))
for file in js:
    text=file.read_text()
    for rel in re.findall(r"from\s+['\"](\./[^'\"]+)['\"]", text):
        target=(file.parent/rel)
        if target.suffix:
            ok=target.exists()
        else:
            ok=target.with_suffix('.js').exists() or (target/'index.js').exists()
        if not ok: errors.append(f'{file.name}: missing import {rel}')

assets=json.loads((ROOT/'snack-assets.json').read_text())
local={str(p.relative_to(ROOT)) for p in (ROOT/'assets'/'cards').glob('*.jpg')}
local|={str(p.relative_to(ROOT)) for p in (ROOT/'assets'/'brands').glob('*.png')}
if set(assets)!=local:
    errors.append(f'snack asset manifest mismatch: manifest={len(assets)}, local={len(local)}')
else:
    for rel, meta in assets.items():
        p=ROOT/rel
        if hashlib.sha256(p.read_bytes()).hexdigest()!=meta.get('sha256'):
            errors.append(f'asset hash mismatch: {rel}')

model=(ROOT/'AuthModel.js').read_text()
for needle in ['AUTH_ITERATIONS=180000','LEGACY_AUTH_ITERATIONS=600000','SUPPORTED_AUTH_ITERATIONS']:
    if needle not in model: errors.append('AuthModel compatibility marker missing: '+needle)

required=['App.js','AuthScreen.js','Zenvault3.js','SmartTransfer.js','engine.js','CardArtwork.js','Membership.js','ThemeCatalog.js']
for name in required:
    if not (ROOT/name).exists(): errors.append('missing core file: '+name)

print(f'Zenvault {pkg.get("version")} verification')
print(f'- JavaScript modules: {len(js)}')
print(f'- Snack assets: {len(local)}')
print(f'- Total project files: {sum(1 for p in ROOT.rglob("*") if p.is_file())}')
if errors:
    print('\nFAILED')
    for e in errors: print(' -',e)
    sys.exit(1)
print('\nOK — structure, versions, imports, asset hashes and auth compatibility checks passed.')
