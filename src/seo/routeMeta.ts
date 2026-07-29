import { getTestById, tests } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import type { Locale } from '../i18n/LocaleContext';
import { absoluteUrl, SITE_NAME } from './siteConfig';

export interface RouteMeta {
  /** <title> */
  title: string;
  /** <meta name="description"> */
  description: string;
  /** <link rel="canonical"> の絶対URL */
  canonical: string;
  /** trueなら <meta name="robots" content="noindex"> を出す */
  noindex: boolean;
}

/** 各言語の固定ページ用メタ情報（trailing のサイト名は付けない生のタイトル） */
interface StaticMeta {
  title: string;
  description: string;
}

const STATIC_PAGES: Record<Locale, Record<string, StaticMeta>> = {
  ja: {
    '/': {
      title: '有意差検定の計算サイト｜t検定・ANOVAやP値をブラウザで簡単計算',
      description:
        '有意差検定を無料でブラウザ計算。t検定・分散分析（ANOVA）・カイ二乗検定などP値が求まる23種類の統計的検定に対応。データはサーバーに送信されません。日本語・英語対応。',
    },
    '/guide': {
      title: '検定の選び方ガイド｜質問に答えるだけで使うべき統計手法がわかる',
      description:
        'データの尺度・群の数・対応の有無などの質問に答えるだけで、使うべき統計的検定を診断します。t検定・分散分析・ノンパラメトリック検定の選び分けに。',
    },
    '/explain': {
      title: '統計的検定23種の一覧と解説｜t検定・ANOVA・ノンパラメトリック検定',
      description:
        '対応のあり／なしのt検定、一元・二元配置分散分析、マン・ホイットニーU検定、カイ二乗検定など23種類の統計的検定を、目的・帰無仮説・前提条件・計算式つきで解説します。',
    },
    '/about': {
      title: '運営者情報',
      description: '「有意差検定の計算サイト」の運営者情報と、サイトの目的・運営方針について。',
    },
    '/faq': {
      title: 'よくある質問（FAQ）',
      description:
        '有意差検定の計算サイトについてのよくある質問。データの取り扱い、対応している検定、P値の解釈、計算精度などにお答えします。',
    },
    '/verification': {
      title: '計算結果の検証について｜Rや統計数表との照合方法',
      description:
        '本サイトの検定統計量・P値が正しいことを、R（stats パッケージ）の出力や統計数表と照合して検証しています。検算スクリプトの内容もあわせて公開しています。',
    },
    '/contact': {
      title: 'お問い合わせ',
      description: '有意差検定の計算サイトへのご質問・不具合のご報告・ご要望はこちらから。',
    },
    '/privacy': {
      title: 'プライバシーポリシー',
      description:
        '本サイトにおける個人情報・Cookie・アクセス解析・広告配信の取り扱いについて説明します。入力された数値データはサーバーに送信されません。',
    },
    '/terms': {
      title: '利用規約',
      description: '有意差検定の計算サイトの利用規約・免責事項について。',
    },
    '/credits': {
      title: 'オープンソースライセンス',
      description: '本サイトの構築に利用しているオープンソースソフトウェアとフォントの一覧です。',
    },
  },
  en: {
    '/': {
      title: 'Significance Test Calculator | Run t-tests, ANOVA and P-values in Your Browser',
      description:
        'Free browser-based significance testing. 23 statistical tests including t-tests, ANOVA and chi-square, with p-values. Your data never leaves your browser. Japanese and English.',
    },
    '/guide': {
      title: 'Which Statistical Test Should I Use? | Guided Test Selector',
      description:
        'Answer a few questions about your data — measurement scale, number of groups, paired or unpaired — and find the right statistical test.',
    },
    '/explain': {
      title: '23 Statistical Tests Explained | t-test, ANOVA and Nonparametric Tests',
      description:
        'Paired and unpaired t-tests, one-way and two-way ANOVA, Mann-Whitney U, chi-square and more — each explained with its purpose, null hypothesis, assumptions and formula.',
    },
    '/about': {
      title: 'About',
      description: 'About the Significance Test Calculator: who runs it and why it exists.',
    },
    '/faq': {
      title: 'Frequently Asked Questions',
      description:
        'Common questions about the Significance Test Calculator: data handling, supported tests, interpreting p-values and numerical accuracy.',
    },
    '/verification': {
      title: 'How Results Are Verified | Cross-checked Against R',
      description:
        'Every test statistic and p-value on this site is cross-checked against R (stats package) and published statistical tables. The verification script is public.',
    },
    '/contact': {
      title: 'Contact',
      description: 'Questions, bug reports and feature requests for the Significance Test Calculator.',
    },
    '/privacy': {
      title: 'Privacy Policy',
      description:
        'How this site handles personal data, cookies, analytics and advertising. The numbers you enter are never sent to a server.',
    },
    '/terms': {
      title: 'Terms of Use',
      description: 'Terms of use and disclaimer for the Significance Test Calculator.',
    },
    '/credits': {
      title: 'Open Source Licenses',
      description: 'Open source software and fonts used to build this site.',
    },
  },
};

/**
 * 検索エンジンにインデックスさせたい全ルート。
 * sitemap.xml とプリレンダリング対象はこの配列から生成されます。
 */
export const INDEXABLE_ROUTES: string[] = [
  '/',
  '/guide',
  '/explain',
  ...tests.map((t) => `/explain/${t.id}`),
  '/about',
  '/faq',
  '/verification',
  '/contact',
  '/privacy',
  '/terms',
  '/credits',
];

/** 「ページ名｜サイト名」の形に整える（トップページはそのまま） */
function withSiteName(title: string, locale: Locale): string {
  const site = SITE_NAME[locale];
  if (title.includes(site)) return title;
  return locale === 'ja' ? `${title}｜${site}` : `${title} | ${site}`;
}

/** 個別検定の説明ページ（/explain/:testId）のメタ情報 */
function explainDetailMeta(testId: string, locale: Locale): StaticMeta | null {
  const def = getTestById(testId);
  if (!def) return null;
  const { name, description } = getLocalizedTest(def, locale);
  return locale === 'ja'
    ? {
        title: `${name}とは｜目的・前提条件・計算式とP値の求め方`,
        description: `${description} 帰無仮説・前提条件・計算式をわかりやすく解説し、ブラウザ上で無料で計算できます。`,
      }
    : {
        title: `${name}: Purpose, Assumptions and Formula`,
        description: `${description} Learn the null hypothesis, assumptions and formula, then run the test for free in your browser.`,
      };
}

/**
 * パスと言語からページのメタ情報を返す。
 * 未知のパスはトップページのメタ情報をnoindexで返す（SPAのフォールバック用）。
 */
export function getRouteMeta(pathname: string, locale: Locale): RouteMeta {
  // 末尾スラッシュを正規化（'/' はそのまま）
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
  const pages = STATIC_PAGES[locale];

  const explainMatch = /^\/explain\/([^/]+)$/.exec(path);
  if (explainMatch) {
    const meta = explainDetailMeta(explainMatch[1], locale);
    if (meta) {
      return {
        title: withSiteName(meta.title, locale),
        description: meta.description,
        canonical: absoluteUrl(path),
        noindex: false,
      };
    }
    // 存在しない検定IDは /explain へリダイレクトされるのでインデックス不要
    return {
      title: withSiteName(pages['/explain'].title, locale),
      description: pages['/explain'].description,
      canonical: absoluteUrl('/explain'),
      noindex: true,
    };
  }

  const staticMeta = pages[path];
  if (staticMeta) {
    return {
      title: path === '/' ? staticMeta.title : withSiteName(staticMeta.title, locale),
      description: staticMeta.description,
      canonical: absoluteUrl(path),
      noindex: false,
    };
  }

  // /params・/input・/result・その他未知のパス
  return {
    title: withSiteName(pages['/'].title, locale),
    description: pages['/'].description,
    canonical: absoluteUrl('/'),
    noindex: true,
  };
}
