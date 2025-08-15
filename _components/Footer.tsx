export default function Footer_new() {
  return (
    <footer class="text-smaller bg-gray-50 dark:bg-gray-950 p-4 pt-12 sm:px-8 border-t border-t-foreground-tertiary">
      <nav className="flex flex-col gap-x-4 gap-y-12 max-w-7xl md:flex-row md:flex-wrap md:justify-between md:w-full md:gap-y-8 md:mx-auto">
        {data.map((category) => (
          <section class="flex-auto">
            <h3 class="mb-2 uppercase font-bold text-foreground-primary whitespace-pre">
              {category.title}
            </h3>
            <ul class="m-0 p-0 pl-3 border-l border-l-background-tertiary list-none">
              {category.items.map((item) => (
                <li>
                  <a
                    class="block mb-2 hover:text-primary hover:underline"
                    href={item.to ?? item.href}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <p class="m-0 mt-16 mx-auto text-center text-xs text-foreground-secondary">
        <a target="_blank" href="https://www.zhcndoc.com">
          简中文档
        </a>
        ｜
        <a rel="nofollow" target="_blank" href="https://beian.miit.gov.cn">
          沪ICP备2024070610号-3
        </a>
      </p>
    </footer>
  );
}

interface FooterCategory {
  title: string;
  items: FooterItem[];
}

type FooterItem = {
  label: string;
  to: string;
} | {
  label: string;
  href: string;
};

const data = [
  {
    title: "Deno 文档",
    items: [
      {
        label: "Deno 运行时",
        to: "/runtime/",
      },
      {
        label: "示例",
        href: "/examples/",
      },
      {
        label: "标准库",
        href: "https://jsr.io/@std",
      },
      {
        label: "Deno API Reference",
        href: "/api/deno/~/Deno",
      },
    ],
  },
  {
    title: "服务文档",
    items: [
      {
        label: "Deno Deploy <sup>公测版</sup>",
        to: "/deploy/early-access/",
      },
      {
        label: "Deno Deploy 经典版",
        to: "/deploy/manual/",
      },
      {
        label: "Deno 子托管",
        to: "/subhosting/manual/",
      },
    ],
  },
  {
    title: "社区",
    items: [
      {
        label: "Discord",
        href: "https://discord.gg/deno",
      },
      {
        label: "GitHub",
        href: "https://github.com/denoland",
      },
      {
        label: "YouTube",
        href: "https://youtube.com/@deno_land",
      },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/deno.land",
      },
      {
        label: "Mastodon",
        href: "https://fosstodon.org/@deno_land",
      },
      {
        label: "Twitter",
        href: "https://twitter.com/deno_land",
      },
      {
        label: "Newsletter",
        href: "https://deno.news/",
      },
    ],
  },
  {
    title: "帮助与反馈",
    items: [
      {
        label: "社区支持",
        href: "https://discord.gg/deno",
      },
      {
        label: "部署系统状态",
        href: "https://denostatus.com",
      },
      {
        label: "部署反馈",
        href: "https://github.com/denoland/deploy_feedback",
      },
      {
        label: "报告问题",
        href: "mailto:support@deno.com",
      },
    ],
  },
  {
    title: "公司",
    items: [
      {
        label: "Deno Website",
        href: "https://deno.com/",
      },
      {
        label: "Blog",
        href: "https://deno.com/blog",
      },
      {
        label: "招聘",
        href: "https://deno.com/jobs",
      },
      {
        label: "周边商品",
        href: "https://merch.deno.com/",
      },
      {
        label: "隐私政策",
        href: "/deploy/manual/privacy-policy",
      },
    ],
  },
] satisfies FooterCategory[];
