import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "入门",
    items: [
      {
        label: "关于子托管",
        id: "/subhosting/manual/",
      },
      {
        label: "快速入门",
        id: "/subhosting/manual/quick_start/",
      },
      {
        label: "规划您的实施",
        id: "/subhosting/manual/planning_your_implementation/",
      },
      {
        label: "定价与限制",
        id: "/subhosting/manual/pricing_and_limits/",
      },
    ],
  },
  {
    title: "REST API",
    items: [
      {
        label: "资源",
        id: "/subhosting/api/",
      },
      {
        label: "身份验证",
        id: "/subhosting/api/authentication/",
      },
      {
        label: "事件",
        id: "/subhosting/manual/events/",
      },
      {
        label: "API 参考文档",
        href: "https://apidocs.deno.com",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "子托管";
export const sectionHref = "/subhosting/manual/";
