import { Linter } from "eslint";

const config: Linter.FlatConfig = [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: require.resolve("@typescript-eslint/parser"),
            ecmaVersion: 2021,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            import: require("eslint-plugin-import"),
        },
        env: {
            browser: true,
            es2021: true,
        },
        rules: {
            "no-console": "warn",
        },
        extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/recommended", "plugin:import/typescript", "prettier"],
    },
];

export default config;
