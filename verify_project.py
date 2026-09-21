from pathlib import Path
import json, re, hashlib, sys

ROOT=Path(__file__).resolve().parent
errors=[]
notes=[]

pkg=json.loads((ROOT/'package.json').read_text())
app=json.loads((ROOT/'app.json').read_text())
if pkg.get('version')!='5.0.0': errors.append('package.json version is not 5.0.0')
if app.get('expo',{}).get('version')!='5.0.0': errors.append('app.json version is not 5.0.0')
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


# Static require() assets must exist locally.
for file in js:
    text=file.read_text()
    for rel in re.findall(r"require\(['\"](\./assets/[^'\"]+)['\"]\)", text):
        target=(file.parent/rel)
        if not target.exists(): errors.append(f'{file.name}: missing asset {rel}')

# Validate the distributable Snack payload and Pages importer.
payload_path=ROOT/'snack-payload-5.0.0.json'
if payload_path.exists():
    payload=json.loads(payload_path.read_text())
    code=payload.get('code',{})
    code_count=sum(1 for v in code.values() if v.get('type')=='CODE')
    asset_count=sum(1 for v in code.values() if v.get('type')=='ASSET')
    if payload.get('manifest',{}).get('name')!='Zenvault Bank & Co. 5.0.0': errors.append('Snack payload manifest has wrong name/version')
    if code_count!=len(js)+1: errors.append(f'Snack code count mismatch: payload={code_count}, expected={len(js)+1}')
    if asset_count!=len(local): errors.append(f'Snack asset count mismatch: payload={asset_count}, expected={len(local)}')
    if len(payload.get('dependencies',{}))!=7: errors.append('Snack payload does not contain 7 resolved dependencies')
    for name in ['App.js','Home5.js','Zenvault5.js','app.json']:
        if name not in code: errors.append('Snack payload missing '+name)
index_path=ROOT/'index.html'
if index_path.exists() and 'snack-payload-5.0.0.json' not in index_path.read_text(): errors.append('index.html does not target the 5.0.0 Snack payload')

required=['App.js','AuthScreen.js','Zenvault3.js','Zenvault5.js','Home5.js','SmartTransfer.js','engine.js','CardArtwork.js','Membership.js','ThemeCatalog.js','index.html','RELEASE-NOTES-5.0.0.md','snack-payload-5.0.0.json']
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
