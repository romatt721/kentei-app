import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';
import { getRouteMeta } from './routeMeta';
import { SITE_NAME } from './siteConfig';

/**
 * headのタグを「あれば書き換え、なければ作る」。
 * ビルド時のプリレンダリングが同じタグを出力しているため、
 * 初回表示では既存タグの書き換えになり、タグが二重になることはない。
 */
function upsertTag<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  selector: string,
  attrs: Record<string, string>,
): void {
  let el = document.head.querySelector<HTMLElementTagNameMap[K]>(selector);
  if (!el) {
    el = document.createElement(tagName);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

function upsertMetaName(name: string, content: string): void {
  upsertTag('meta', `meta[name="${name}"]`, { name, content });
}

function upsertMetaProperty(property: string, content: string): void {
  upsertTag('meta', `meta[property="${property}"]`, { property, content });
}

function removeTag(selector: string): void {
  document.head.querySelector(selector)?.remove();
}

/**
 * 現在のルートと言語に対応した title / description / canonical / OGP を
 * <head> に反映する。SPAのクライアント遷移でもタグが正しく追従するようにする。
 *
 * ビルド時のプリレンダリング（scripts/prerender.ts）が同じ内容を静的HTMLに
 * 埋め込むので、クローラーはJS実行前にこの情報を読める。
 */
export function useSeo(): void {
  const { pathname } = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    const meta = getRouteMeta(pathname, locale);

    document.title = meta.title;
    upsertMetaName('description', meta.description);
    upsertTag('link', 'link[rel="canonical"]', { rel: 'canonical', href: meta.canonical });

    upsertMetaProperty('og:type', 'website');
    upsertMetaProperty('og:site_name', SITE_NAME[locale]);
    upsertMetaProperty('og:locale', locale === 'ja' ? 'ja_JP' : 'en_US');
    upsertMetaProperty('og:title', meta.title);
    upsertMetaProperty('og:description', meta.description);
    upsertMetaProperty('og:url', meta.canonical);

    upsertMetaName('twitter:card', 'summary');
    upsertMetaName('twitter:title', meta.title);
    upsertMetaName('twitter:description', meta.description);

    if (meta.noindex) {
      upsertMetaName('robots', 'noindex, follow');
    } else {
      removeTag('meta[name="robots"]');
    }
  }, [pathname, locale]);
}
