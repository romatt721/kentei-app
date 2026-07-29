/**
 * サイト全体のURL設定。
 *
 * 独自ドメインに移行するときは、この定数1行を書き換えるだけで
 * canonical・OGP・sitemap.xml・robots.txt のすべてが追従します。
 * （末尾のスラッシュは付けないでください）
 */
export const SITE_URL = 'https://kentei-app-silk.vercel.app';

/** OGPの og:site_name / タイトル末尾に付けるサイト名 */
export const SITE_NAME: Record<'ja' | 'en', string> = {
  ja: '有意差検定の計算サイト',
  en: 'Significance Test Calculator',
};

/** パスを絶対URLに変換する（'/' はルートURLそのもの） */
export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
