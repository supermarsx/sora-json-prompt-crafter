# Sora JSON Prompt Crafter

![20250621_1737_AI's Infernal Escape_simple_compose_01jy9nh238fvabsq6x9kpv6f49](https://github.com/user-attachments/assets/76094d07-48cb-49ef-a342-e3afdd036dcd)


Sora JSON Prompt Crafter is a web interface for building configuration files for Sora's generative models. Adjust sliders and dropdowns to fine‑tune parameters like style preset, aspect ratio, video duration and more. The app generates a JSON snippet you can copy and use directly with Sora.

### Quick Start

```sh
git clone https://github.com/supermarsx/sora-json-prompt-crafter
cd sora-json-prompt-crafter
npm install
npm run dev
```
Then open http://localhost:5173 in your browser.
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

### Contributing

Pull requests are welcome. Please open an issue first to discuss major changes.

### Disclaimer

The full legal disclaimer displayed in the application is stored in
`public/disclaimer.txt`. This file is copied to the `dist` directory during the
build so it can be viewed at `/disclaimer.txt` in production.

### License

This project is licensed under the MIT License.

## Project info

**URL**: https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181

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
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

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

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
