import { SecondaryNav, Sidebar } from "../../types.ts";

export const sidebar = [
  {
    title: "关于早期访问",
    href: "/deploy/early-access/",
  },
  {
    title: "入门",
    href: "/deploy/early-access/getting_started/",
  },
  {
    title: "参考",
    href: "/deploy/early-access/reference/",
    items: [
      {
        title: "账户",
        href: "/deploy/early-access/reference/accounts/",
      },
      {
        title: "组织",
        href: "/deploy/early-access/reference/organizations/",
      },
      {
        title: "应用程序",
        href: "/deploy/early-access/reference/apps/",
      },
      {
        title: "构建",
        href: "/deploy/early-access/reference/builds/",
      },
      {
        title: "环境变量和上下文",
        href: "/deploy/early-access/reference/env-vars-and-contexts/",
      },
      {
        title: "时间线",
        href: "/deploy/early-access/reference/timelines/",
      },
      {
        title: "可观测性",
        href: "/deploy/early-access/reference/observability/",
      },
      {
        title: "自定义域名",
        href: "/deploy/early-access/reference/domains/",
      },
      {
        title: "数据库",
        href: "/deploy/early-access/reference/databases/",
      },
      {
        title: "云连接",
        href: "/deploy/early-access/reference/cloud-connections/",
      },
      {
        title: "运行时",
        href: "/deploy/early-access/reference/runtime/",
      },
      {
        title: "框架支持",
        href: "/deploy/early-access/reference/frameworks/",
      },
      {
        title: "CDN 和缓存",
        href: "/deploy/early-access/reference/caching/",
      },
      {
        title: "Deploy 按钮",
        href: "/deploy/early-access/reference/button/",
      },
      {
        title: "使用和限制",
        href: "/deploy/early-access/usage/",
      },
      {
        title: "支持",
        href: "/deploy/early-access/support/",
      },
    ],
  },
  {
    title: "更新日志",
    href: "/deploy/early-access/changelog/",
  },
  {
    title: "支持与反馈",
    href: "/deploy/early-access/support/",
  },
] satisfies Sidebar;

export const sectionTitle = "Deno Deploy<sup>EA</sup>";
export const sectionHref = "/deploy/early-access/";
export const secondaryNav = [
  {
    title: "Deno Deploy<sup>EA</sup>",
    href: "/deploy/early-access/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/manual/",
  },
  {
    title: "子托管",
    href: "/subhosting/manual/",
  },
] satisfies SecondaryNav;
