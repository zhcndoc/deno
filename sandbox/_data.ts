import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Deno 沙箱",
    items: [
      { title: "关于", href: "/sandbox/" },
      {
        title: "快速入门",
        href: "/sandbox/getting_started/",
      },
      {
        title: "创建沙箱",
        href: "/sandbox/create/",
      },
      {
        title: "通过 CLI 管理",
        href: "/sandbox/cli/",
      },
    ],
  },
  {
    title: "概念",
    items: [
      {
        title: "暴露 HTTP",
        href: "/sandbox/expose_http/",
      },
      {
        title: "暴露 SSH",
        href: "/sandbox/ssh/",
      },
      {
        title: "管理 Deno Deploy 应用",
        href: "/sandbox/apps/",
      },
      {
        title: "持久卷与快照",
        href: "/sandbox/volumes/",
      },
      {
        title: "沙盒生命周期",
        href: "/sandbox/timeouts/",
      },
      {
        title: "安全",
        href: "/sandbox/security/",
      },
    ],
  },
  {
    title: "参考",
    items: [
      {
        title: "SDK 参考",
        href: "https://jsr.io/@deno/sandbox/doc/~/Sandbox",
      },
      {
        title: "REST API",
        href: "https://api.deno.com/v2/docs",
      },
      {
        title: "沙箱 CLI 命令",
        href: "/runtime/reference/cli/sandbox/",
      },
      {
        title: "示例",
        href: "/examples/#sandbox",
      },
      {
        title: "定价",
        href: "https://deno.com/deploy/sandbox#sandbox-pricing",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deno 沙箱";
export const sectionHref = "/sandbox/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
  },
  {
    title: "Deno 沙箱",
    href: "/sandbox/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "子托管",
    href: "/subhosting/manual/",
  },
] satisfies SidebarNav;
