/**
 * ビルド時プリレンダリング（SSG）。
 *
 * `vite build`（クライアント）と `vite build --ssr`（サーバー用エントリ）のあとに実行され、
 * インデックス対象の全ルートについて dist/<route>/index.html を生成する。
 * 生成されるHTMLには
 *   - そのページ固有の title / description / canonical / OGP
 *   - Reactでレンダリング済みの本文HTML
 * が含まれるので、クローラーはJavaScriptを実行しなくてもページの中身を読める。
 *
 * あわせて sitemap.xml と robots.txt も SITE_URL から生成する。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getRouteMeta, INDEXABLE_ROUTES } from '../src/seo/routeMeta';
import { absoluteUrl, SITE_NAME, SITE_URL } from '../src/seo/siteConfig';
import type { RouteMeta } from '../src/seo/routeMeta';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SSR_ENTRY = join(ROOT, '.prerender', 'entry-server.js');

const HEAD_START = '<!--seo-head-start-->';
const HEAD_END = '<!--seo-head-end-->';
const SSR_OUTLET = '<!--ssr-outlet-->';

/** プリレンダリングは日本語で行う（サイトの主要ターゲットが日本語検索のため） */
const PRERENDER_LOCALE = 'ja' as const;

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** src/seo/useSeo.ts がクライアント側で作るのと同じタグを静的HTMLとして組み立てる */
function buildHead(meta: RouteMeta): string {
  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME[PRERENDER_LOCALE])}" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
  ];
  if (meta.noindex) tags.push(`<meta name="robots" content="noindex, follow" />`);
  return tags.map((t) => `    ${t}`).join('\n');
}

/** '/' → dist/index.html、'/explain/foo' → dist/explain/foo/index.html */
function outputPath(route: string): string {
  return route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
}

function buildSitemap(routes: string[]): string {
  const urls = routes.map((r) => `  <url><loc>${escapeAttr(absoluteUrl(r))}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots(): string {
  // /params・/input・/result は計算の操作途中の画面で、単独では固有のコンテンツを持たない
  // （プリレンダリングもしていない）。クロールさせても重複コンテンツになるだけなので除外する。
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /params',
    'Disallow: /input',
    'Disallow: /result',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

async function main(): Promise<void> {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');

  for (const marker of [HEAD_START, HEAD_END, SSR_OUTLET]) {
    if (!template.includes(marker)) {
      throw new Error(
        `dist/index.html に ${marker} が見つかりません。` +
          `index.html を確認するか、先に \`npm run build\` を実行してください。`,
      );
    }
  }

  const { render } = (await import(pathToFileURL(SSR_ENTRY).href)) as {
    render: (url: string) => string;
  };

  const headStart = template.indexOf(HEAD_START);
  const headEnd = template.indexOf(HEAD_END) + HEAD_END.length;

  for (const route of INDEXABLE_ROUTES) {
    const meta = getRouteMeta(route, PRERENDER_LOCALE);
    const body = render(route);

    if (!body.includes('<main')) {
      throw new Error(`${route} のレンダリング結果が空か不完全です。`);
    }

    // 置換文字列ではなく関数を渡すこと。文字列を渡すと本文中の `$$`（MathJaxの
    // ディスプレイ数式デリミタ）が置換パターンとして解釈され `$` に潰れてしまう。
    const html =
      template.slice(0, headStart) +
      buildHead(meta).trimStart() +
      template.slice(headEnd).replace(SSR_OUTLET, () => body);

    const file = outputPath(route);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html, 'utf8');
  }

  await writeFile(join(DIST, 'sitemap.xml'), buildSitemap(INDEXABLE_ROUTES), 'utf8');
  await writeFile(join(DIST, 'robots.txt'), buildRobots(), 'utf8');

  console.log(
    `prerender: ${INDEXABLE_ROUTES.length} ページ + sitemap.xml / robots.txt を生成しました（${SITE_URL}）`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
