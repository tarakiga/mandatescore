// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", "storybook-static/**", "node_modules/**"]
  },
  ...nextVitals,
  ...nextTs,
  ...storybook.configs["flat/recommended"]
];

export default config;
