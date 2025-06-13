import { SecondaryNav, Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "入门",
    items: [
      {
        title: "快速开始",
        href: "/deploy/manual/",
      },
      {
        title: "Deploy 基础知识",
        items: [
          { title: "用例", href: "/deploy/manual/use-cases/" },
          { title: "游乐场", href: "/deploy/manual/playgrounds/" },
          { title: "如何部署", href: "/deploy/manual/how-to-deploy/" },
          { title: "GitHub CI", href: "/deploy/manual/ci_github/" },
          { title: "deployctl", href: "/deploy/manual/deployctl/" },
          { title: "地区", href: "/deploy/manual/regions/" },
          {
            title: "定价和限制",
            href: "/deploy/manual/pricing-and-limits/",
          },
        ],
      },
    ],
  },
  {
    title: "Deploy 平台",
    items: [
      {
        title: "部署",
        href: "/deploy/manual/deployments/",
      },
      {
        title: "绑定域名",
        href: "/deploy/manual/custom-domains/",
      },
      {
        title: "环境变量",
        href: "/deploy/manual/environment-variables/",
      },
      {
        title: "组织",
        href: "/deploy/manual/organizations/",
      },
      {
        title: "日志",
        href: "/deploy/manual/logs/",
      },
      {
        title: "KV",
        items: [
          { title: "概述", href: "/deploy/kv/manual/" },
          { title: "键空间", href: "/deploy/kv/manual/key_space/" },
          { title: "操作", href: "/deploy/kv/manual/operations/" },
          {
            title: "键过期",
            href: "/deploy/kv/manual/key_expiration/",
          },
          {
            title: "辅助索引",
            href: "/deploy/kv/manual/secondary_indexes/",
          },
          { title: "交易", href: "/deploy/kv/manual/transactions/" },
          { title: "Node", href: "/deploy/kv/manual/node/" },
          {
            title: "数据建模",
            href: "/deploy/kv/manual/data_modeling_typescript/",
          },
          { title: "备份", href: "/deploy/kv/manual/backup/" },
        ],
      },
      {
        title: "队列",
        href: "/deploy/kv/manual/queue_overview/",
      },
      {
        title: "定时任务",
        href: "/deploy/kv/manual/cron/",
      },
      {
        title: "边缘缓存",
        href: "/deploy/manual/edge-cache/",
      },
    ],
  },
  {
    title: "连接到数据库",
    items: [
      {
        title: "Deno KV",
        href: "/deploy/kv/manual/on_deploy/",
      },
      {
        title: "第三方数据库",
        items: [
          { title: "DynamoDB", href: "/deploy/manual/dynamodb/" },
          { title: "FaunaDB", href: "/deploy/manual/faunadb/" },
          { title: "Firebase", href: "/deploy/manual/firebase/" },
          { title: "Postgres", href: "/deploy/manual/postgres/" },
          { title: "Neon Postgres", href: "/deploy/manual/neon-postgres/" },
        ],
      },
    ],
  },
  {
    title: "政策和限制",
    items: [
      {
        title: "可接受使用政策",
        href: "/deploy/manual/acceptable-use-policy/",
      },
      {
        title: "履行政策",
        href: "/deploy/manual/fulfillment-policy/",
      },
      { title: "隐私政策", href: "/deploy/manual/privacy-policy/" },
      { title: "Security", href: "/deploy/manual/security/" },
      {
        title: "条款和条件",
        href: "/deploy/manual/terms-and-conditions/",
      },
    ],
  },
  {
    title: "教程与示例",
    items: [
      {
        title: "部署教程",
        items: [
          { title: "概述", href: "/deploy/tutorials/" },
          {
            title: "Discord 斜杠命令",
            href: "/deploy/tutorials/discord-slash/",
          },
          { title: "Fresh 框架", href: "/deploy/tutorials/fresh/" },
          { title: "简单 API", href: "/deploy/tutorials/simple-api/" },
          { title: "静态站点", href: "/deploy/tutorials/static-site/" },
          {
            title: "Fresh 博客教程",
            href: "/deploy/tutorials/tutorial-blog-fresh/",
          },
          {
            title: "DynamoDB 集成",
            href: "/deploy/tutorials/tutorial-dynamodb/",
          },
          {
            title: "FaunaDB 集成",
            href: "/deploy/tutorials/tutorial-faunadb/",
          },
          {
            title: "Firebase 集成",
            href: "/deploy/tutorials/tutorial-firebase/",
          },
          {
            title: "HTTP 服务器",
            href: "/deploy/tutorials/tutorial-http-server/",
          },
          { title: "Hugo 博客", href: "/deploy/tutorials/tutorial-hugo-blog/" },
          {
            title: "Postgres 集成",
            href: "/deploy/tutorials/tutorial-postgres/",
          },
          {
            title: "WordPress 前端",
            href: "/deploy/tutorials/tutorial-wordpress-frontend/",
          },
          { title: "Vite", href: "/deploy/tutorials/vite/" },
          {
            title: "日程通知",
            href: "/deploy/kv/tutorials/schedule_notification/",
          },
          {
            title: "Webhook 处理器",
            href: "/deploy/kv/tutorials/webhook_processor/",
          },
        ],
      },
      {
        title: "KV 教程",
        href: "/deploy/kv/tutorials/",
      },
      {
        title: "更多关于 Deno 的示例",
        href: "/examples/",
      },
    ],
  },
  {
    title: "参考",
    items: [
      { title: "运行时 API", href: "/deploy/api" },
      { title: "运行时 FS", href: "/deploy/api/runtime-fs/" },
      { title: "运行时 Node", href: "/deploy/api/runtime-node/" },
      { title: "压缩", href: "/deploy/api/compression/" },
      { title: "运行时 Sockets", href: "/deploy/api/runtime-sockets/" },
      {
        title: "运行时广播频道",
        href: "/deploy/api/runtime-broadcast-channel/",
      },
      { title: "运行时 Fetch", href: "/deploy/api/runtime-fetch/" },
      { title: "运行时 Request", href: "/deploy/api/runtime-request/" },
      { title: "运行时 Response", href: "/deploy/api/runtime-response/" },
      { title: "运行时 Headers", href: "/deploy/api/runtime-headers/" },
      { title: "动态导入", href: "/deploy/api/dynamic-import/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deno Deploy";
export const sectionHref = "/deploy/manual/";
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
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SecondaryNav;
