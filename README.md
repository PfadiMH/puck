# Puck - Website Builder for Pfadi MH

A drag-and-drop website builder for the Pfadi MH website, built with the Puck visual editor and Next.js.

### Helpful Documentation

Before you start, these resources might be useful:

- **[Puck Editor Docs](https://puckeditor.com/docs)**: The visual editor our project is built upon.
- **[Next.js Docs](https://nextjs.org/docs)**: The React framework used for this project.
- **[Tailwind CSS](https://tailwindcss.com/docs)**: The CSS framework that is used to style the application.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
- [Using the Editor](#using-the-editor)
- [How to Contribute](#how-to-contribute)
  - [Contribution Workflow](#contribution-workflow)
  - [Pull Request Guidelines](#pull-request-guidelines)
- [Project Structure](#project-structure)
- [License](#license)

## Getting Started

Follow these instructions to get the project set up and running on your local machine for development.

### Prerequisites

Make sure you have the following tools installed on your system:

- **[Bun](https://bun.sh/)**: The JavaScript runtime and package manager.
- **[Git](https://git-scm.com/)**: For version control.
- **[Docker](https://www.docker.com/)**: To easily run a local MongoDB instance.

### Local Development Setup

1.  **Fork the Repository**

    Click the **Fork** button at the top-right of this page to create a copy of this repository under your GitHub account.

2.  **Clone Your Fork**

    Clone your forked repository to your local machine. Replace `YOUR_USERNAME` with your GitHub username.

    ```bash
    git clone https://github.com/YOUR_USERNAME/puck.git
    cd puck
    ```

3.  **Add the `upstream` Remote**

    This allows you to sync changes from the original repository (`PfadiMH/puck`).

    ```bash
    git remote add upstream https://github.com/PfadiMH/puck.git
    ```

4.  **Start Local MongoDB Database**

    You can start a local database using either `docker compose`.

    ```bash
    docker compose up -d
    ```

5.  **Set Up Environment Variables**

    Copy the example environment file to create your local configuration.

    ```bash
    cp .env.example .env
    ```

The default values in this file are already configured for the local Docker database, so no changes are required to get started.

    Optional:  
    To enable form spam protection, set ALTCHA_HMAC_KEY to a random string:
    
    *openssl rand -hex 32*

    Forms work without it (a default key is used), but a custom key is recommended for production. See the https://altcha.org/docs for more details.

6. **Install Dependencies**

   Install all project dependencies using Bun.

   ```bash
   bun install
   ```

7. **Run the Development Server**

   You're all set! Start the Next.js development server.

   ```bash
   bun run dev
   ```

   The application will be running at [http://localhost:3000](http://localhost:3000).

## Using the Editor

The core of this project is the admin dashboard, where you can visually create and manage all pages.

**Viewing Pages:**
Any page you create can be viewed at its public path (e.g., `http://localhost:3000/some-page`).

**Editing and Creating Pages:**
All content management is done through the central admin dashboard.

1.  Navigate to the admin panel: **[http://localhost:3000/admin](http://localhost:3000/admin)**
2.  From the dashboard, you can either **create a new page** (e.g., with the path `/hello/world`) or select an existing one to edit.
3.  Once you publish your changes in the editor, the page will be live and viewable at its designated path.

## How to Contribute

We welcome contributions from everyone!

### Contribution Workflow

1.  **Sync Your Fork**: Before starting work, ensure your `main` branch is up-to-date with the `upstream` repository.

    ```bash
    git checkout main
    git pull upstream main
    git push origin main
    ```

2.  **Create a New Branch**: Use a descriptive branch name (e.g., `feature/new-component` or `fix/styling-issue`).

    ```bash
    git checkout -b feature/new-puck-component
    ```

3.  **Make Your Changes**: Write your code and create amazing things!

4.  **Commit Your Changes**: Use clear and concise commit messages.

    ```bash
    git commit -m "feat: add new Card component for Puck"
    ```

5.  **Push to Your Fork**:

    ```bash
    git push origin feature/new-puck-component
    ```

6.  **Open a Pull Request (PR)**: Go to the original repository on GitHub. You should see a prompt to "Compare & pull request". Click it to start your PR.

### Pull Request Guidelines

- **Title**: Your PR title should be clear (e.g., `feat: Add dark mode toggle`).
- **Description**: Explain the "what," "why," and "how" of your changes. Link any related issues using keywords like `Closes #123`.
- **Checks**: Ensure all automated CI checks (linting, tests) are passing.

## Project Structure

Here is a high-level overview of the project's directory structure:

```
.
├── app/                      # The main directory for the Next.js App Router, containing all routes and pages.
│   ├── admin/                # Contains the routes for the admin dashboard and editor UI.
│   ├── globals.css           # Global CSS style definitions for the entire application.
│   └── [[...puckPath]]/      # A dynamic, catch-all route that renders public-facing pages using the content defined with the editor UI.
├── components                # Contains all the components used throughout the application.
│   ├── contexts/             # React Context Providers to share state across the component tree (e.g., for theming).
│   ├── footer/               # Components specifically for building the site's footer.
│   ├── graphics/             # SVG icons and illustrations, typically exported as React components.
│   ├── misc/                 # Miscellaneous or general-purpose utility components that don't fit in other categories.
│   ├── navbar/               # Components for rendering the site's navigation bar.
│   ├── page/                 # Components used to construct and render a standard content page.
│   │   └── admin/            # Components specifically for the admin dashboard's user interface.
│   ├── Providers.tsx         # A single component that wraps the application with all necessary context providers.
│   ├── puck/                 # The core visual building blocks component that users can drag-and-drop within the Puck editor.
│   │   └── navbar/           # Puck components for building an editable navigation bar.
│   ├── puck-fields/          # Custom input fields for the Puck editor's sidebar.
│   ├── puck-overrides/       # Components that replace or customize the default UI of the Puck editor itself.
│   └── ui/                   # Generic, reusable, low-level UI components like Buttons, Inputs, Cards, etc.
├── lib/                      # Contains non-component code like utility functions, configurations, and business logic.
│   ├── assets/               # Static assets like custom fonts that are referenced in the code.
│   ├── config/               # Core configuration files for Puck, defining available components, fields, and editable regions.
│   ├── contexts/             # The actual creation of React Context objects (the definition, not the provider component).
│   ├── custom-field-types.ts # Type definitions for the custom Puck fields defined in `components/puck-fields`.
│   └── db/                   # Logic for connecting to and interacting with the database
└── stories/                  # Contains Storybook files for developing and showcasing components in isolation.
```
