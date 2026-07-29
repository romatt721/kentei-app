import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { UI_EN } from './ui.en';
import { UI_JA } from './ui.ja';

export type Locale = 'ja' | 'en';

const STORAGE_KEY = 'stat-app-locale';

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  ja: UI_JA,
  en: UI_EN,
};

function detectInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {
    // localStorageが使えない環境（プライベートモード等）ではブラウザ言語検出にフォールバック
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'ja';
  return nav.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /**
   * UI文言の翻訳関数。キーが見つからない場合はキー自体を返す。
   * varsを渡すと文字列内の {{name}} をvars.nameで置換する。
   */
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = 'ja',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // ビルド時にプリレンダリングしたHTML（日本語）とハイドレーション結果を一致させるため、
  // 初回レンダリングは必ずinitialLocaleで行い、localStorage・ブラウザ言語の反映は
  // マウント後に回す。サーバー側にはwindow/localStorageが無いという事情もある。
  useEffect(() => {
    const detected = detectInitialLocale();
    setLocaleState((current) => (current === detected ? current : detected));
  }, []);

  // <html lang>属性を現在の言語に同期させる（アクセシビリティ・SEO対策）
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // 保存できなくても表示上の切り替えには支障ない
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let s = DICTIONARIES[locale][key] ?? DICTIONARIES.ja[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.split(`{{${k}}}`).join(String(v));
        }
      }
      return s;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale は LocaleProvider の内側で使用してください');
  }
  return ctx;
}
