import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import configPrettierRecommended from "eslint-plugin-prettier/recommended";

const typescriptEslintConfig = tseslint.config({
  files: ["**/*.ts"],
  extends: [eslint.configs.recommended, tseslint.configs.recommended],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
});

export default [...typescriptEslintConfig, configPrettierRecommended];
