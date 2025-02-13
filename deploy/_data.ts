import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "入门",
    items: [
      {
        label: "快速开始",
        id: "/deploy/manual/",
      },
      {
        label: "Deploy 基础知识",
        items: [
          "/deploy/manual/use-cases/",
          "/deploy/manual/playgrounds/",
          "/deploy/manual/how-to-deploy/",
          "/deploy/manual/ci_github/",
          "/deploy/manual/deployctl/",
          "/deploy/manual/regions/",
          "/deploy/manual/pricing-and-limits/",
        ],
      },
    ],
  },
  {
    title: "Deploy 平台",
    items: [
      {
        label: "部署",
        id: "/deploy/manual/deployments/",
      },
      {
        label: "绑定域名",
        id: "/deploy/manual/custom-domains/",
      },
      {
        label: "环境变量",
        id: "/deploy/manual/environment-variables/",
      },
      {
        label: "组织",
        id: "/deploy/manual/organizations/",
      },
      {
        label: "日志",
        id: "/deploy/manual/logs/",
      },
      {
        label: "KV",
        items: [
          "/deploy/kv/manual/",
          "/deploy/kv/manual/key_space/",
          "/deploy/kv/manual/operations/",
          "/deploy/kv/manual/key_expiration/",
          "/deploy/kv/manual/secondary_indexes/",
          "/deploy/kv/manual/transactions/",
          "/deploy/kv/manual/node/",
          "/deploy/kv/manual/data_modeling_typescript/",
          "/deploy/kv/manual/backup/",
        ],
      },
      {
        label: "队列",
        id: "/deploy/kv/manual/queue_overview/",
      },
      {
        label: "定时任务",
        id: "/deploy/kv/manual/cron/",
      },
      {
        label: "边缘缓存",
        id: "/deploy/manual/edge-cache/",
      },
    ],
  },
  {
    title: "连接到数据库",
    items: [
      {
        label: "Deno KV",
        id: "/deploy/kv/manual/on_deploy/",
      },
      {
        label: "第三方数据库",
        items: [
          "/deploy/manual/dynamodb/",
          "/deploy/manual/faunadb/",
          "/deploy/manual/firebase/",
          "/deploy/manual/postgres/",
          "/deploy/manual/neon-postgres/",
        ],
      },
    ],
  },
  {
    title: "政策和限制",
    items: [
      "/deploy/manual/acceptable-use-policy/",
      "/deploy/manual/fulfillment-policy/",
      "/deploy/manual/privacy-policy/",
      "/deploy/manual/security/",
      "/deploy/manual/terms-and-conditions/",
    ],
  },
  {
    title: "教程与示例",
    items: [
      {
        label: "部署教程",
        items: [
          "/deploy/tutorials/",
          "/deploy/tutorials/discord-slash/",
          "/deploy/tutorials/fresh/",
          "/deploy/tutorials/simple-api/",
          "/deploy/tutorials/static-site/",
          "/deploy/tutorials/tutorial-blog-fresh/",
          "/deploy/tutorials/tutorial-dynamodb/",
          "/deploy/tutorials/tutorial-faunadb/",
          "/deploy/tutorials/tutorial-firebase/",
          "/deploy/tutorials/tutorial-http-server/",
          "/deploy/tutorials/tutorial-hugo-blog/",
          "/deploy/tutorials/tutorial-postgres/",
          "/deploy/tutorials/tutorial-wordpress-frontend/",
          "/deploy/tutorials/vite/",
          "/deploy/kv/tutorials/schedule_notification/",
          "/deploy/kv/tutorials/webhook_processor/",
        ],
      },
      {
        label: "KV 教程",
        id: "/deploy/kv/tutorials/",
      },
      {
        label: "更多关于 Deno 的示例",
        href: "/examples/",
      },
    ],
  },
  {
    title: "参考",
    items: [
      {
        label: "运行时 API",
        href: "/deploy/api",
      },
      "/deploy/api/runtime-fs/",
      "/deploy/api/runtime-node/",
      "/deploy/api/compression/",
      "/deploy/api/runtime-sockets/",
      "/deploy/api/runtime-broadcast-channel/",
      "/deploy/api/runtime-fetch/",
      "/deploy/api/runtime-request/",
      "/deploy/api/runtime-response/",
      "/deploy/api/runtime-headers/",
      "/deploy/api/dynamic-import/",
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deno Deploy";
export const sectionHref = "/deploy/manual/";
