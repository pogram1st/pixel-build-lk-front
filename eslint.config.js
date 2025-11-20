import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-multiple-template-root': 'off',
        'vue/html-indent': 'off',
        'vue/script-indent': 'off',
        'vue/html-self-closing': 'off',
        'vue/attributes-order': 'off',
        'vue/require-default-prop': 'off',
        'no-console': 'off',
        'no-empty': 'off',
        'nuxt/prefer-import-meta': 'off',
        'prefer-const': 'error',
        'no-var': 'error',
    },
})
