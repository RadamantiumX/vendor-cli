# vendor-cli

[![npm version](https://img.shields.io/npm/v/vendor-cli.svg)](https://www.npmjs.com/package/vendor-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An easy-to-use CLI tool for installing packages, dependencies, and libraries across your **Turborepo** workspaces. `vendor-cli` automatically detects all existing workflows and workspaces within your current Turborepo project, providing an interactive console prompt to manage installations effortlessly.

## ✨ Features

- **Automatic Workspace Detection**: Scans and detects all existing workflows/workspaces in your Turborepo monorepo.
- **Interactive CLI Prompts**: Intuitive terminal interface to select target workspaces and packages.
- **Streamlined Dependency Management**: Install packages and libraries without manually typing long workspace filter flags.

## 📦 Installation

Install `vendor-cli` as a development dependency at the root of your Turborepo project:

```bash
# Using npm
npm install -D @complements/vendor-cli

# Using yarn
yarn add -D -W @complements/vendor-cli

# Using pnpm
pnpm add -D -w @complements/vendor-cli
```

## ⚙️ Setup

To execute the CLI prompts in your console, add a script entry to the `"scripts"` property in your root `package.json` file:

```json
{
  "name": "my-turborepo",
  "private": true,
  "scripts": {
    "vendor": "vendor-cli"
  },
  "devDependencies": {
    "vendor-cli": "latest"
  }
}
```

## 🚀 Usage

Once configured in your `package.json`, run the script from your terminal to launch the interactive prompts:

```bash
# Using npm
npm run vendor

# Using yarn
yarn vendor

# Using pnpm
pnpm vendor
```

Follow the on-screen prompts to:
1. Select the detected Turborepo workspace(s) / workflow(s).
2. Enter the package(s) or dependencies you want to install.
3. Confirm and let `vendor-cli` handle the installation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).