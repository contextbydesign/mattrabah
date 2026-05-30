export default {
  "*.{md,mdx,json}": "prettier --write",
  "*.{astro,js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
};
