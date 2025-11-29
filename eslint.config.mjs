import stylisticConfig from "@stylistic/eslint-plugin"
import tsConfig from "@typescript-eslint/eslint-plugin"
import parserTs from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import vueConfig from "eslint-plugin-vue"
import parserVue from "vue-eslint-parser"

export default [
    ...vueConfig.configs["flat/recommended"],
    {
        files: ["**/*.{mjs,js,ts,vue}"],
        plugins: {
            "vue": vueConfig,
            "@typescript-eslint": tsConfig,
            "@stylistic": stylisticConfig,
            "import": importPlugin
        },
        languageOptions: {
            parser: parserVue,
            parserOptions: {
                parser: parserTs
            }
        },
        rules: {
            // 📦 Импорты
            "import/order": [
                "error", {
                    "groups": [
                        "builtin", "external", "internal", "parent", "sibling", "index"
                    ],
                    "pathGroups": [
                        {
                            pattern: "@/assets/**",
                            group: "internal",
                            position: "after"
                        }
                    ],
                    "pathGroupsExcludedImportTypes": ["builtin", "external"],
                    "newlines-between": "always",
                    "alphabetize": {
                        order: "asc",
                        caseInsensitive: true
                    }
                }
            ],
            "sort-imports": [
                "error", {
                    ignoreDeclarationSort: true,
                    ignoreCase: true,
                    memberSyntaxSortOrder: [
                        "none", "all", "multiple", "single"
                    ]
                }
            ],
            "no-duplicate-imports": ["error", { includeExports: true }],

            // 📐 Форматирование
            "object-curly-spacing": ["error", "always"],
            "@stylistic/indent": ["error", 4],
            "vue/html-indent": ["error", 4],
            "@stylistic/semi": ["error", "never"],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/brace-style": ["error", "1tbs"],
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/quote-props": ["error", "consistent-as-needed"],
            "@stylistic/member-delimiter-style": [
                "error", {
                    multiline: {
                        delimiter: "semi",
                        requireLast: false
                    }
                }
            ],
            "@stylistic/keyword-spacing": [
                "error", {
                    overrides: {
                        if: { after: false },
                        for: { after: false },
                        while: { after: false }
                    }
                }
            ],
            "@stylistic/space-before-function-paren": ["error", "never"],

            // 🧹 Доп. форматирование
            "no-multi-spaces": ["error"],
            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "return" },
                {
                    blankLine: "always", prev: [
                        "const", "let", "var"
                    ], next: "*" 
                },
                {
                    blankLine: "any", prev: [
                        "const", "let", "var"
                    ], next: [
                        "const", "let", "var"
                    ] 
                },
                {
                    blankLine: "always", prev: "*", next: [
                        "if", "for", "while", "switch", "try"
                    ] 
                },
                {
                    blankLine: "always", prev: [
                        "if", "for", "while", "switch", "try"
                    ], next: "*" 
                }
            ],
            "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
            "@stylistic/key-spacing": [
                "error", {
                    beforeColon: false,
                    afterColon: true,
                    mode: "strict"
                }
            ],
            "@stylistic/space-infix-ops": ["error"],
            "@stylistic/comma-spacing": ["error", { before: false, after: true }],
            "@stylistic/object-curly-newline": [
                "error", {
                    multiline: true,
                    consistent: true
                }
            ],
            "@stylistic/array-bracket-newline": ["error", { multiline: true, minItems: 3 }],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/space-before-blocks": ["error", "always"],
            "@stylistic/array-bracket-spacing": ["error", "never"],

            // 🧩 Vue специфичное
            "vue/multi-word-component-names": "off",
            "vue/attribute-hyphenation": ["error", "never"],
            "vue/v-on-event-hyphenation": ["error", "never"],
            "vue/html-self-closing": [
                "warn", {
                    html: {
                        void: "always"
                    }
                }
            ],
            "vue/max-attributes-per-line": [
                "warn", {
                    singleline: {
                        max: 3
                    },
                    multiline: {
                        max: 1
                    }
                }
            ],
            "vue/singleline-html-element-content-newline": "off",
            "vue/no-v-html": "off",

            // 🔡 TypeScript
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "interface",
                    format: ["PascalCase"]
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"]
                },
                {
                    selector: "enum",
                    format: ["PascalCase"]
                },
                {
                    selector: "function",
                    format: ["camelCase"]
                }
            ],
            "@typescript-eslint/no-duplicate-enum-values": "off"
        }
    },
    {
        ignores: [
            "node_modules", "dist", ".output", ".nuxt"
        ]
    }
]










