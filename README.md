# Prognosis

## NodeJS Setup

Ensure you have NodeJS and NPM installed. The best way to manage your NodeJS
installation is with [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm).

To install nvm run

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

To install the use the latest version of node run

```sh
nvm install node
```

## Project Setup

**Note:** This setup process assumes you are using VS Code as your editor.

In a directory of your choosing run

```sh
git clone https://github.com/ejrbuss/prognosis.git
```

Then open the directory in VS Code.

Now install project dependencies with

```sh
npm install
```

Perform a first time build with

```sh
npm run build
```

The following are other useful commands

```sh
npm run test    # Run unit tests
npm run clean   # Remove all build artifacts
npm run serve   # Run a deve server (localhost:8080)
npm run dev     # Run a deve server (localhost:8080) and watch for file updates
npm run release # Create a release (release.zip)
```

## Code Formatting

[Prettier](https://prettier.io/) is used for formatting code. If you are going
to be contributing please install the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).