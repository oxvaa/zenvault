"""Create a Snack payload with resolved dependency handles, not versions alone."""
import json
import hashlib
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
package = json.loads((root / 'package.json').read_text())
core = {'expo', 'react', 'react-native', 'react-dom', 'react-native-web'}
versions = {name: version for name, version in package['dependencies'].items() if name not in core}
resolved = json.loads((root / 'snack-dependencies.json').read_text())
if set(resolved) != set(versions) or any(
    not meta.get('handle') or meta.get('version') != versions[name]
    for name, meta in resolved.items()
):
    raise SystemExit('Resolve changed dependencies with Expo Snack before publishing. Each dependency requires its returned handle and peerDependencies.')
files = sorted(root.glob('*.js')) + [root / 'app.json']
assets = json.loads((root / 'snack-assets.json').read_text())
local_assets = {str(file.relative_to(root)) for file in (root / 'assets' / 'cards').glob('*.jpg')}
local_assets.update(str(file.relative_to(root)) for file in (root / 'assets' / 'brands').glob('*.png'))
if set(assets) != local_assets:
    raise SystemExit('Upload every card illustration to Snack and update snack-assets.json before publishing.')
for path, asset in assets.items():
    if (hashlib.sha256((root / path).read_bytes()).hexdigest() != asset['sha256']
            or not asset['url'].startswith('https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/')):
        raise SystemExit('Changed or missing Snack asset: ' + path)
payload = {
    'manifest': {'sdkVersion': '54.0.0', 'name': 'Zenvault Bank & Co. ' + package['version'],
                 'description': 'Zenvault 5 — Your Money OS. Premium Czech banking frontend with local data.', 'dependencies': versions},
    'code': {file.name: {'type': 'CODE', 'contents': file.read_text()} for file in files},
    'dependencies': resolved,
    'isDraft': False,
}
payload['code'].update({path: {'type': 'ASSET', 'contents': asset['url']} for path, asset in assets.items()})
out = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'snack-payload.json'
out.write_text(json.dumps(payload))
print('Prepared', len(files), 'code files,', len(assets), 'assets and', len(resolved), 'resolved dependencies')
