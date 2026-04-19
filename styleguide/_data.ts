import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "风格指南",
    href: "/styleguide/",
    items: [
      {
        title: "排版",
        href: "/styleguide/typography/",
      },
      {
        title: "组件",
        href: "/styleguide/components/",
      },
      {
        title: "OG 图像",
        href: "/styleguide/og/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "风格指南";
export const sectionHref = "/styleguide/";
