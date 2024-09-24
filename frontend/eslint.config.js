import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginJest from "eslint-plugin-jest";



export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.jest, React: true, process: true, JSX: true} }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      react: pluginReact,  // Add react plugin
      jest: eslintPluginJest,  // Add Jest plugin
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "react/react-in-jsx-scope": "off",  // Disable React-in-JSX-scope since it's not needed in React 17+
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react/prop-types": "off",  // Disable PropTypes since TypeScript handles types
    },
    settings: {
      react: {
        version: "detect",  // Automatically detect React version
      },
    },
  }
];