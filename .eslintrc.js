module.exports = {
    root: true,
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",   // ignore 'any'
        "@typescript-eslint/no-unused-vars": "off",   // ignore unused vars
    },
};
