import Logo from "./Logo.tsx";
export default function Header({
  data,
  url,
  hasSidebar,
}: {
  data: Lume.Data;
  url: string;
  hasSidebar?: boolean;
}) {
  const reference = url.startsWith("/api");
  return (
    <header
      class={`bg-background-primary text-foreground-primary border-b border-foreground-tertiary z-30 ${
        reference ? "" : "sticky top-0 left-0 right-0"
      }`}
    >
      <nav class="p-4 py-3 md:px-6 min-h-16 flex items-center justify-between">
        <div class="flex items-center">
          {hasSidebar && (
            <button class="mr-2 xl:hidden" id="sidebar-open">
              <svg
                width="24"
                height="24"
                viewBox="0 0 30 30"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  d="M4 7h22M4 15h22M4 23h22"
                >
                </path>
              </svg>
            </button>
          )}
          <a class="flex gap-2.5 mr-5" href="/">
            <div class="w-auto h-9">
              <Logo />
            </div>
            {/* custom font size for logo */}
          </a>
          <HeaderItem
            url={url}
            activeOn="/runtime"
            href="/runtime/"
            name="手册"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/api"
            href="/api/deno"
            name="API 参考"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/examples"
            href="/examples"
            name="示例"
            hideOnMobile
          />
          <span class="hidden xl:inline-block text-foreground-secondary mx-2">
            //
          </span>
          <HeaderItem
            url={url}
            activeOn="/deploy"
            href="/deploy/manual"
            name="Deno Deploy"
            hideOnMobile
          />
          <HeaderItem
            url={url}
            activeOn="/subhosting"
            href="/subhosting/manual"
            name="子托管"
            hideOnMobile
          />
        </div>

        <div class="flex items-center gap-2">
          <HeaderItem
            url={url}
            href="https://www.zhcndoc.com"
            name="简中文档"
            external
            hideOnMobile
          />
          <data.comp.SearchInput />
          <data.comp.ThemeToggle />
        </div>
      </nav>

      {reference &&
        (
          <nav className="px-4 md:px-6 py-3 text-sm bg-background-primary flex items-center justify-between border-box border-t border-foreground-tertiary z-[1000]">
            <ul className="flex">
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/deno"
                  href="/api/deno"
                  name="Deno APIs"
                  firstItem={true}
                />
              </li>
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/web"
                  href="/api/web"
                  name="Web APIs"
                />
              </li>
              <li>
                <HeaderItem
                  url={url}
                  activeOn="/api/node"
                  href="/api/node"
                  name="Node APIs"
                />
              </li>
            </ul>
          </nav>
        )}
    </header>
  );
}

function HeaderItem({
  url,
  activeOn,
  href,
  name,
  external,
  hideOnMobile,
  firstItem,
}: {
  url: string;
  activeOn?: string;
  href: string;
  name: string;
  external?: boolean;
  hideOnMobile?: boolean;
  firstItem?: boolean;
}) {
  return (
    <a
      class={`${
        firstItem ? "ml-0" : ""
      } mx-1 px-2 text-md hover:bg-background-secondary ring-1 ring-transparent hover:ring-background-tertiary hover:rounded transition-colors duration-200 ease-in-out text-nowrap flex items-center ${
        activeOn && url.startsWith(activeOn)
          ? "text-primary underline font-semibold underline-offset-[6px] decoration-primary/20"
          : "[letter-spacing:0.2px]"
      } ${hideOnMobile ? "max-xl:!hidden" : ""}`}
      href={href}
    >
      {name}
      {external &&
        (
          <svg
            width="10"
            height="10"
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="inline  ml-2"
          >
            <path
              fill="currentColor"
              d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
            >
            </path>
          </svg>
        )}
    </a>
  );
}
