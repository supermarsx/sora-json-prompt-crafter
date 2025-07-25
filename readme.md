# Sora JSON Prompt Crafter

![Banner displaying an infernal scenario and a prompt running away from ghosts](https://github.com/user-attachments/assets/0f19ca8e-acd1-4fa7-aa96-cadf479956fc)

![License](https://img.shields.io/github/license/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Commits](https://img.shields.io/github/commit-activity/t/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Forks](https://img.shields.io/github/forks/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Watchers](https://img.shields.io/github/watchers/supermarsx/sora-json-prompt-crafter?style=for-the-badge)

![Build](https://img.shields.io/github/actions/workflow/status/supermarsx/sora-json-prompt-crafter/ci.yml?style=for-the-badge)
![Coverage](./coverage.svg)
![Issues](https://img.shields.io/github/issues/supermarsx/sora-json-prompt-crafter?style=for-the-badge)

Sora JSON Prompt Crafter is a web interface for building specially crafted prompts for Sora's
generative models. Adjust sliders and dropdowns to fine‑tune parameters like style preset,
aspect ratio, video duration and more. The app generates a JSON snippet you can copy and
use directly with Sora. The app has a privacy-first approach where everything is kept on your
browser, no prompt data is shared or tracked. Dark mode is used as default for those of us that
go "my eyes!" when there's bright white lights.

[![Go to Lovable](https://img.shields.io/badge/Demo-at%20%F0%9F%92%96%20Lovable-white?style=for-the-badge&logo=lovable)](https://sora-json-prompt-crafter.lovable.app)

## Features

- Always on-screen live JSON generation with diff highlighting
- Edit prompts and negative prompts
- Privacy-first local storage only data
- Dark mode first for eye confort
- 100% locally generated JSON
- Optional JSON composition based on option sections
- JSON generation lifecycle functions
- Current generated JSON persists through page reloads
- Stores up to 100 copied JSON prompts in a dedicated history panel
- Import and Export functions for copied JSON entries
- Extensive quality, ambient and setting presets
- Lots of pop culture presets
- Specific framing, dimension and base presets
- Presets and options for video like camera and motion
- Advanced specialized prompting options
- Artifact and defect correction presets
- No-fuss tracking toggle
- Internationalization support
- Works offline thanks to service worker caching of assets

Example JSON output:

```json
{
  "prompt": "A breathtaking cinematic scene ...",
  "negative_prompt": "blurry, low-res, ...",
  "seed": 1337,
  "aspect_ratio": "16:9",
  "duration_seconds": 5
}
```

## Quick Start

Requires **Node.js 22** or higher.
Run `nvm use` to match the version in `.nvmrc`.

To start using the prompt crafter locally clone and run using the following commands:

```sh
git clone https://github.com/supermarsx/sora-json-prompt-crafter
cd sora-json-prompt-crafter
npm install
npm run dev
```

Copy `.env.example` to `.env` and adjust the variables. `VITE_MEASUREMENT_ID` holds your Google Analytics ID and `VITE_DISABLE_ANALYTICS` disables tracking. `VITE_DISABLE_STATS` disables the GitHub stats fetch. `VITE_DISCLAIMER_URL` can point to a custom path and should include a `{locale}` placeholder. Set `VITE_GTAG_DEBUG` to `true` to enable GA debug mode.
Then open http://localhost:8080 in your browser.

### Docker

Build and run a containerized version of the app:

```sh
docker build -t sora-json-prompt-crafter .
docker run -p 8080:8080 sora-json-prompt-crafter
```

The application will then be available at http://localhost:8080.

### Running Tests

```sh
npm test
```

You can also run `npm run typecheck` to verify TypeScript types.

### Formatting Code

```sh
npm run format
```

Runs Prettier with the project's configuration to automatically format all files.

## Screenshots

![Base Screenshot](https://github.com/user-attachments/assets/6d254018-994f-47cf-b4d6-9ea6e6f08c12)

## Technology

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

You can deploy the built application to any static hosting service. Below is a
typical workflow using [Vercel](https://vercel.com) as an example. If you
prefer, you can simply open
[Lovable](https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181)
and click **Share → Publish**.

### Deploy on Lovable

Go to [Lovable](https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181) and remix
the project.

### Deploy to Vercel

Clone, install dependencies and build:

```sh
git clone <YOUR_GIT_URL>
cd sora-json-prompt-crafter
npm install
npm run build
```

The build generates a `dist` directory containing the production build.

First install the Vercel CLI if you haven't already:

```sh
npm install -g vercel
```

Run the deploy command and follow the prompts:

```sh
vercel --prod
```

After completing the prompts, Vercel will upload the `dist` folder and provide a
URL where your application is hosted. You can use any other hosting provider in
a similar fashion by pointing it to the `dist` folder.

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

- **`VITE_MEASUREMENT_ID`** (optional) – Google Analytics measurement ID. Defaults to `G-RVR9TSBQL7` if not set. See `.env.example` for the placeholder.
- **`VITE_DISABLE_ANALYTICS`** (optional) – Set to `true` to disable all analytics tracking. Example provided in `.env.example`.
- **`VITE_DISABLE_STATS`** (optional) – Set to `true` to disable fetching GitHub stats. Example provided in `.env.example`.
- **`VITE_DISCLAIMER_URL`** (optional) – Path pattern for the disclaimer text. Include `{locale}` to load the correct language. Defaults to `/disclaimers/disclaimer.{locale}.txt`.
- **`VITE_GTAG_DEBUG`** (optional) – Set to `true` to enable Google Analytics debug mode.

## Custom Presets

Preset lists live under `src/data/`. You can add your own files there or merge
presets at runtime. Use `importCustomPresets` from `src/lib/presetLoader` to load
a JSON object (or URL via `loadCustomPresetsFromUrl`). The JSON can include
`stylePresets`, `cameraPresets`, `locationPresets` and `dndPresets` keys
matching the built‑in structures. Imported values are merged with existing
presets so they become available in the UI.

## Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

## Disclaimer

The full legal disclaimers are located under `public/disclaimers/`. They are
copied to the `dist` directory during the build so they can be accessed from
`/disclaimers/`. You can change the location by setting `VITE_DISCLAIMER_URL` to
your own path pattern.

### Supported Languages

- English (US) (`disclaimer.en-US.txt`)
- Spanish (Spain) (`disclaimer.es-ES.txt`)
- Portuguese (Portugal) (`disclaimer.pt-PT.txt`)
- Russian (`disclaimer.ru-RU.txt`)
- Portuguese (Brazil) (`disclaimer.pt-BR.txt`)
- French (`disclaimer.fr-FR.txt`)
- German (Germany) (`disclaimer.de-DE.txt`)
- Chinese (Simplified) (`disclaimer.zh-CN.txt`)
- Italian (`disclaimer.it-IT.txt`)
- Spanish (Mexico) (`disclaimer.es-MX.txt`)
- English (UK) (`disclaimer.en-GB.txt`)
- Bengali (`disclaimer.bn-IN.txt`)
- Japanese (`disclaimer.ja-JP.txt`)
- English (Pirate) (`disclaimer.en-PR.txt`)
- Korean (`disclaimer.ko-KR.txt`)
- Romanian (`disclaimer.ro-RO.txt`)
- Swedish (`disclaimer.sv-SE.txt`)
- Ukrainian (`disclaimer.uk-UA.txt`)
- Nepali (`disclaimer.ne-NP.txt`)
- Danish (`disclaimer.da-DK.txt`)
- Estonian (`disclaimer.et-EE.txt`)
- Finnish (`disclaimer.fi-FI.txt`)
- Greek (`disclaimer.el-GR.txt`)
- Thai (`disclaimer.th-TH.txt`)
- German (Austria) (`disclaimer.de-AT.txt`)
- French (Belgium) (`disclaimer.fr-BE.txt`)
- Spanish (Argentina) (`disclaimer.es-AR.txt`)

To add a new language, place `disclaimer.<locale>.txt` in
`public/disclaimers/` and update the language list as needed.

## Tracking/Analytics

Theres only anonymous usage that tracks actions but not data from the users that you
can enable or disable from the manage button dropdown. Be aware that disabling tracking
disables user side action log too. We ask kindly for you to still allow tracking for
statistical and improvement purposes. No prompt data or inputs are ever tracked.

## License

This project is licensed under the MIT License. Check `license.md` for more information.
