# Sora JSON Prompt Crafter

![Banner displaying an infernal scenario and a prompt running away from ghosts](https://github.com/user-attachments/assets/0f19ca8e-acd1-4fa7-aa96-cadf479956fc)

![License](https://img.shields.io/github/license/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Commits](https://img.shields.io/github/commit-activity/t/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Forks](https://img.shields.io/github/forks/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Watchers](https://img.shields.io/github/watchers/supermarsx/sora-json-prompt-crafter?style=for-the-badge)

![Build](https://img.shields.io/github/actions/workflow/status/supermarsx/sora-json-prompt-crafter/ci.yml?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/supermarsx/sora-json-prompt-crafter?style=for-the-badge)


Sora JSON Prompt Crafter is a web interface for building configuration files for Sora's generative models. Adjust sliders and dropdowns to fine‑tune parameters like style preset, aspect ratio, video duration and more. The app generates a JSON snippet you can copy and use directly with Sora. The app has a privacy-first approach where everything is kept on your browser, no prompt data is shared or tracked.

[![Go to Lovable](https://img.shields.io/badge/Demo-at%20%F0%9F%92%96%20Lovable-white?style=for-the-badge&logo=lovable)](https://sora-json-prompt-crafter.lovable.app)


## Features

- Live JSON generation with diff highlighting
- Edit prompts and negative prompts
- Privacy-first local storage only data
- Optional JSON composition based on sections
- Extensive quality, ambient and setting presets
- Lots of pop culture presets
- Specific framing, dimension and base presets
- Presets and options for video like camera and motion
- Advanced specialized prompting options
- Artifact and defect correction presets

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

To start using the prompt crafterr locally clone and run using the following commands:

```sh
git clone https://github.com/supermarsx/sora-json-prompt-crafter
cd sora-json-prompt-crafter
npm install
npm run dev
```
Then open http://localhost:8080 in your browser.

### Running Tests

```sh
npm test
```

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

- **`VITE_MEASUREMENT_ID`** (optional) – Google Analytics measurement ID. Defaults to `G-RVR9TSBQL7` if not set.

## Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

## Disclaimer

The full legal disclaimer displayed in the application is stored in
`public/disclaimer.txt`. This file is copied to the `dist` directory during the
build so it can be viewed at `/disclaimer.txt` in production.

## Tracking/Analytics

Theres only anonymous usage that tracks actions but not data from the users that you 
can enable or disable from the manage button dropdown. Be aware that disabling tracking 
disables user side action log too. We ask kindly for you to still allow tracking for 
statistical and improvement purposes. No prompt data or inputs are ever tracked.

## License

This project is licensed under the MIT License. Check `license.md` for more information.
