# Sora JSON Prompt Crafter

![Banner displaying an infernal scenario and a prompt running away from ghosts](https://github.com/user-attachments/assets/0f19ca8e-acd1-4fa7-aa96-cadf479956fc)

![License](https://img.shields.io/github/license/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Build](https://img.shields.io/github/actions/workflow/status/supermarsx/sora-json-prompt-crafter/ci.yml?style=for-the-badge)
![Commits](https://img.shields.io/github/commit-activity/t/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/supermarsx/sora-json-prompt-crafter?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/supermarsx/sora-json-prompt-crafter?style=for-the-badge)




Sora JSON Prompt Crafter is a web interface for building configuration files for Sora's generative models. Adjust sliders and dropdowns to fine‑tune parameters like style preset, aspect ratio, video duration and more. The app generates a JSON snippet you can copy and use directly with Sora.

### Quick Start

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

### Test Instance

A test instance is available at [https://sora-json-prompt-crafter.lovable.app/](https://sora-json-prompt-crafter.lovable.app/).


### Features

- Edit prompts and negative prompts with live JSON output
- Edit prompts and optionally include negative prompts via a checkbox
- Select model versions and quality presets
- Adjust dimensions, aspect ratio and output format
- Configure camera movement, motion strength and video length
- Toggle advanced options like high‑res fix and safety filter

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

### Screenshots

![image](https://github.com/user-attachments/assets/6d254018-994f-47cf-b4d6-9ea6e6f08c12)

Add a screenshot of the app here (e.g. `public/placeholder.svg`).




## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- 

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/supermarsx/sora-json-prompt-crafter

# Step 2: Navigate to the project directory.
cd sora-json-prompt-crafter

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```


## How can I deploy this project?

You can deploy the built application to any static hosting service. Below is a
typical workflow using [Vercel](https://vercel.com) as an example. If you
prefer, you can simply open
 [Lovable](https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181)
and click **Share → Publish**.

### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd sora-json-prompt-crafter
```

### 2. Install dependencies

```sh
npm install
```

### 3. Build the project

```sh
npm run build
```

This generates a `dist` directory containing the production build.

### 4. Deploy to Vercel

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

### Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

### Disclaimer

The full legal disclaimer displayed in the application is stored in
`public/disclaimer.txt`. This file is copied to the `dist` directory during the
build so it can be viewed at `/disclaimer.txt` in production.

### License

This project is licensed under the MIT License.
