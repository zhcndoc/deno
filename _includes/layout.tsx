export default function Layout(data: Lume.Data) {
  const reference = data.url.startsWith("/api");
  const description = data.description ||
    "深入的文档、指南和参考材料，用于构建安全、高性能的 JavaScript 和 TypeScript 应用程序，使用 Deno。";

  return (
    <html
      lang="zh-CN"
      class={`light ${reference ? "" : "h-dvh"}`}
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{data.title ? `${data.title} - Deno 中文文档`: 'Deno 中文文档 - 适用于现代网络的开源 JavaScript 运行时'}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="preload"
          href="/fonts/inter/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
        <link
          rel="preload"
          href="/fonts/inter/Inter-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@deno_land" />
        <link rel="me" href="https://fosstodon.org/@deno_land" />
        <meta name="twitter:title" content={data.title} />
        <meta property="og:title" content={data.title} />

        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="description" content={description} />

        <meta name="twitter:image" content="/img/og.webp" />
        <meta
          name="twitter:image:alt"
          content="Deno 中文文档 - 适用于现代网络的开源 JavaScript 运行时"
        />
        <meta property="og:image" content="/img/og.webp" />
        <meta
          property="og:image:alt"
          content="Deno 中文文档 - 适用于现代网络的开源 JavaScript 运行时"
        />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Deno 中文文档" />
        <meta property="og:locale" content="zh_CN" />

        <meta
          name="keywords"
          content="Deno, JavaScript, TypeScript, reference, documentation, guide, tutorial, example"
        />

        <link rel="stylesheet" href="/gfm.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/overrides.css" />
        <script src="/js/darkmode.client.js"></script>
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/components.css" />
        <script type="module" src="/sidebar.client.js"></script>
        <script type="module" src="/lint_rules.client.js"></script>
        <script type="module" src="/copy.client.js"></script>
        <script type="module" src="/tabs.client.js"></script>
        <script type="module" src="/feedback.client.js"></script>
        <script type="module" src="/youtube-lite.client.js"></script>
        <script type="module" src="/components.js"></script>
        <script
          async
          src="https://www.zhcndoc.com/js/common.js"
        >
        </script>
        <link rel="preconnect" href="https://www.googletagmanager.com"></link>
        <script>
          {/*js*/ `
          /* Without this, @media theme preference will override manual theme selection, if different. A little janky but works ok for now, especially since it's just the one edge case where a user's global preference doesn't match their chosen docs theme preference */
          window.onload = () => {
            const colorThemes = document.querySelectorAll('[data-color-mode]');
            const ps = document.querySelectorAll('p');
            colorThemes.forEach((el) => {
              el.setAttribute('data-color-mode', localStorage.denoDocsTheme || 'auto');
            });
          }`}
        </script>
      </head>
      <body
        class={`bg-background-primary text-foreground-primary ${
          reference ? "" : "h-dvh"
        }`}
      >
        <a
          href="#content"
          class="opacity-0 absolute top-2 left-2 p-2 border -translate-y-12 transition-all focus:translate-y-0 focus:opacity-100 z-50 bg-background-primary font-bold"
        >
          Skip to main content <span aria-hidden="true">-&gt;</span>
        </a>
        <data.comp.Header
          data={data}
          url={data.url}
          hasSidebar={!!data.sidebar}
        />
        {data.children}
      </body>
    </html>
  );
}
