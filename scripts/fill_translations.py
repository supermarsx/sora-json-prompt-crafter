import json
import glob
import os
from googletrans import Translator

translator = Translator()

en_file = 'src/locales/en-US.json'
with open(en_file, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

for path in glob.glob('src/locales/*.json'):
    if path.endswith('en-US.json'):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    missing = []
    for key, val in en_data.items():
        if key not in data:
            missing.append(key)
    if not missing:
        continue
    lang_code = os.path.basename(path).split('.')[0].split('-')[0]
    for key in missing:
        text = en_data[key]
        try:
            trans = translator.translate(text, dest=lang_code).text
        except Exception:
            trans = text
        data[key] = trans
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{path}: added {len(missing)} keys')
