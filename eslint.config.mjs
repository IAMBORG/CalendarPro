import powerbiVisualsConfigs from "eslint-plugin-powerbi-visuals";
// eslint.config.mjs
import path from "node:path"; // Using node: prefix is recommended for built-ins
import { fileURLToPath } from "node:url"; // Using node: prefix is recommended for built-ins

// Recreate __filename and __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".vscode/**",
      ".tmp/**",
      "webpack.statistics.*.html",
    ],
  },
  powerbiVisualsConfigs.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"], // Path relative to tsconfigRootDir
        tsconfigRootDir: __dirname, // Set to the absolute path of the current directory
        // ... other parserOptions
      },
    },
  },
];
