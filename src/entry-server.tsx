import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './App';
import { AppProvider } from './context/AppContext';
import { LocaleProvider } from './i18n/LocaleContext';

/**
 * ビルド時プリレンダリング用のエントリポイント。
 * scripts/prerender.ts から各ルートについて呼ばれ、#root の中身のHTMLを返す。
 *
 * 言語は日本語に固定する。Node上では navigator.language が 'en-US' になるため
 * 明示しないと英語ページが生成されてしまう。
 */
export function render(url: string): string {
  return renderToString(
    <LocaleProvider initialLocale="ja">
      <AppProvider>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProvider>
    </LocaleProvider>,
  );
}
