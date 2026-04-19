import { Sidebar, SidebarNav } from "../../types.ts";

export const sidebar = [
  {
    title: "入门",
    items: [
      {
        title: "快速开始",
        href: "/deploy/classic/",
      },
      {
        title: "部署基础",
        items: [
          { title: "游乐场", href: "/deploy/classic/playgrounds/" },
          { title: "如何部署", href: "/deploy/classic/how-to-deploy/" },
          { title: "CI 和 GitHub Actions", href: "/deploy/classic/ci_github/" },
          { title: "deployctl", href: "/deploy/classic/deployctl/" },
          { title: "地区", href: "/deploy/classic/regions/" },
          {
            title: "定价与限制",
            href: "/deploy/pricing_and_limits/",
          },
        ],
      },
    ],
  },
  {
    title: "部署平台",
    items: [
      {
        title: "部署",
        href: "/deploy/classic/deployments/",
      },
      {
        title: "自定义域名",
        href: "/deploy/classic/custom-domains/",
      },
      {
        title: "环境变量",
        href: "/deploy/classic/environment-variables/",
      },
      {
        title: "组织",
        href: "/deploy/classic/organizations/",
      },
      {
        title: "应用程序日志",
        href: "/deploy/classic/logs/",
      },
      {
        title: "队列",
        href: "/deploy/classic/queues/",
      },
      {
        title: "Cron 任务",
        href: "/deploy/classic/cron/",
      },
      {
        title: "边缘缓存",
        href: "/deploy/classic/edge-cache/",
      },
    ],
  },
  {
    title: "连接到数据库",
    items: [
      {
        title: "Deno KV",
        href: "/deploy/classic/kv_on_deploy/",
      },
      {
        title: "第三方数据库",
        items: [
          { title: "DynamoDB", href: "/deploy/classic/dynamodb/" },
          { title: "Firebase", href: "/deploy/classic/firebase/" },
          { title: "Postgres", href: "/deploy/classic/postgres/" },
          { title: "Neon Postgres", href: "/deploy/classic/neon-postgres/" },
          {
            title: "Prisma Postgres",
            href: "/deploy/classic/prisma-postgres/",
          },
        ],
      },
    ],
  },
  {
    title: "参考",
    items: [
      { title: "API 参考", href: "/deploy/classic/api/" },
      { title: "文件系统 API", href: "/deploy/classic/api/runtime-fs/" },
      { title: "Node.js 内置 API", href: "/deploy/classic/api/runtime-node/" },
      { title: "压缩响应体", href: "/deploy/classic/api/compression/" },
      {
        title: "TCP 套接字和 TLS",
        href: "/deploy/classic/api/runtime-sockets/",
      },
      {
        title: "BroadcastChannel",
        href: "/deploy/classic/api/runtime-broadcast-channel/",
      },
      { title: "HTTP 请求（fetch）", href: "/deploy/classic/api/runtime-fetch/" },
      {
        title: "HTTP 请求",
        href: "/deploy/classic/api/runtime-request/",
      },
      {
        title: "HTTP 响应",
        href: "/deploy/classic/api/runtime-response/",
      },
      {
        title: "HTTP 请求头",
        href: "/deploy/classic/api/runtime-headers/",
      },
      { title: "动态导入", href: "/deploy/classic/api/dynamic-import/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deploy Classic";
export const sectionHref = "/deploy/classic/";
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
