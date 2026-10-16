/**
 * Only for unit test
 */

// Still not used
export const mockInquirerReturn = {
  selectFolder: "api",
  selectPkgManager: "npm",
  inputPkg: "inquirer",
  depsConfirm: true,
  finishConfirm: true,
};

// Still not used
export const mockingTable = {
  tableWorkspacePkg: {
    message: "Select the Workspace to install the package.",
    multiple: true,
    columns: [
      {
        title: "Api",
        value: "api",
      },
      {
        title: "Client",
        value: "client",
      },
      {
        title: "Root",
        value: "root",
      },
    ],
    rows: [
      {
        value: "react",
        title: "REACT",
      },
      {
        value: "tsup",
        title: "TSUP",
      },
    ],
  },
};

// Still not used
export const mockedOptions = {
  ws_folders: {
    message: "Select a workspace folder",
    choices: [
      {
        name: "api",
        value: "api",
        description: "mocked api folder",
      },
      {
        name: "client",
        value: "client",
        description: "mocked client folder",
      },
    ],
  },
};

// Still not used
export const mockStringData =
  '[{"name": "firstName", "path": "//path_1"}, {"name": "secondName", "path": "//path_2"}, {"name": "thirdName", "path": "//path_3"}]';

// Still not used
export const mockingCommandArgs = [
  {
    selectFolder: "web",
    selectPkgManager: "npm",
    inputPkg: "react",
    depsConfirm: true,
  },
  {
    selectFolder: "package",
    selectPkgManager: "pnpm",
    inputPkg: "tsup",
    depsConfirm: true,
  },
  {
    selectFolder: "api",
    selectPkgManager: "yarn",
    inputPkg: "inquirer",
    depsConfirm: true,
  },
];

// Still not used
export const mockNode = "node -v";

// Still not used
export const mockCommandReturn = [
  {
    first: "npm i",
    second: "react",
    third: "--workspace=web -D",
  },
  {
    first: "pnpm add",
    second: "-D tsup",
    third: "--filter package",
  },
  {
    first: "yarn workspace",
    second: "api -D",
    third: "inquirer",
  },
];

// Still not used
export const mockReturn = {
  quizChoices: {
    selectionTable: [
      {
        choice: {
          value: "react",
          title: "REACT",
        },
        answers: ["api"],
      },
    ],
    pkgManager: "npm",
  },
  confirmChoices: true,
};

// Still not used
export const mockFragmentSingle = [
  {
    packageManager: "npm",
    package: "react",
    workspaces: ["api"],
    devDep: false,
  },
];

// Still not used
export const mockFragmentMultiple = [
  {
    packageManager: "npm",
    package: "react",
    workspaces: ["api"],
    devDep: false,
  },
  {
    packageManager: "npm",
    package: "node",
    workspaces: ["api"],
    devDep: false,
  },
  {
    packageManager: "npm",
    package: "nodemon",
    workspaces: ["api", "client"],
    devDep: true,
  },
];

// Still not used
export const mockStringAssembled =
  "npm install react --workspace=api && npm install node --workspace=api && npm install nodemon --workspace=api-client --save-dev";
