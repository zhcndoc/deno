import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "入门",
    items: [
      {
        title: "关于子托管",
        href: "/subhosting/manual/",
      },
      {
        title: "快速入门",
        href: "/subhosting/manual/quick_start/",
      },
      {
        title: "规划您的实施",
        href: "/subhosting/manual/planning_your_implementation/",
      },
      {
        title: "定价与限制",
        href: "/subhosting/manual/pricing_and_limits/",
      },
    ],
  },
  {
    title: "REST API",
    items: [
      {
        title: "资源",
        href: "/subhosting/api/",
      },
      {
        title: "身份验证",
        href: "/subhosting/api/authentication/",
      },
      {
        title: "事件",
        href: "/subhosting/manual/events/",
      },
      {
        title: "v1 API 参考（旧版）",
        href: "https://apidocs.deno.com",
      },
      {
        title: "v2 API 参考",
        href: "https://api.deno.com/v2/docs",
      },
      {
        title: "迁移指南（v1 到 v2）",
        href: "/subhosting/manual/api_migration_guide/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "子托管";
export const sectionHref = "/subhosting/manual/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
  },
  {
    title: "Deno Sandbox",
    href: "/sandbox/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SidebarNav;
