import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: "500" }}>Generative.js</span>,
  project: {
    link: "https://github.com/codewithcheese/Generative.js",
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: "https://github.com/codewithcheese/Generative.js",
  footer: {
    text: "",
  },
  nextThemes: {
    defaultTheme: "dark",
  },
};

export default config;
