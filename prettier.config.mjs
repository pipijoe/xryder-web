/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const sortConfig = {
  importOrder: [
    '^react$', // React 单独一组
    '^react-router-dom$', // React Router 单独一组
    '^(?!react$|react-router-dom$)[a-z]', // 其他第三方库（以字母开头的模块）
    '^@/.*$', // 内部模块（使用 @ 作为路径别名）
    '^[./]', // 相对路径导入
    '^.+\\.(css|scss|sass)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

const tailwindConfig = {
  tailwindAttributes: ['className'],
}

const config = {
  trailingComma: 'es5',
  semi: false,
  singleQuote: true,
  printWidth: 80,
  ...sortConfig,
  ...tailwindConfig,

  plugins: [
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],
}

export default config
