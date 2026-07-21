import type { Locale } from '../i18n/LocaleContext';
import type { TestResult } from '../types';
import { translateStatsText } from './statsLabels';

/** 検定統計量の記号（APA形式のレポート文で使用） */
const STAT_SYMBOL: Record<string, string> = {
  't-test-independent': 't',
  't-test-paired': 't',
  't-test-one-sample': 't',
  'welch-t-test': 't',
  'one-way-anova': 'F',
  'repeated-measures-anova': 'F',
  'f-test-variance': 'F',
  'levene-test': 'F',
  'mann-whitney-u': 'U',
  'wilcoxon-signed-rank': 'W',
  'kruskal-wallis': 'H',
  'chi-square-independence': 'χ²',
  'chi-square-goodness': 'χ²',
  'friedman-test': 'χ²',
  'mcnemar-test': 'χ²',
  'cochran-q': 'Q',
  'shapiro-wilk': 'W',
};

/** 統計量が0〜1に収まり、先頭0を省略する慣例がある検定（シャピロ・ウィルクのW値など） */
const BOUNDED_STAT_IDS = new Set(['shapiro-wilk']);

const CORRELATION_SYMBOL: Record<string, string> = {
  'pearson-correlation': 'r',
  'spearman-correlation': 'ρs',
  'kendall-tau': 'τb',
};

/** p値をAPA形式に整形する（先頭0省略・3桁、p<.001は不等号表記） */
function formatApaP(p: number): string {
  if (p < 0.001) return 'p < .001';
  const noZero = p.toFixed(3).replace(/^0\./, '.');
  return `p = ${noZero}`;
}

/** 検定統計量（t・F・χ²・U など、絶対値が1未満でも0を残す）を2桁に整形する */
function formatApaValue(v: number): string {
  if (!Number.isFinite(v)) return '∞';
  return v.toFixed(2);
}

/** -1〜1に収まる相関係数（r・ρ・τ）を2桁に整形する（先頭0は省略） */
function formatApaBounded(v: number): string {
  const s = Math.abs(v).toFixed(2);
  const sign = v < 0 ? '-' : '';
  return sign + s.replace(/^0\./, '.');
}

/** extraStatsから指定ラベルを含む値を探す */
function findExtra(result: TestResult, labelIncludes: string): string | undefined {
  return result.extraStats?.find((e) => e.label.includes(labelIncludes))?.value;
}

/**
 * 検定結果をAPA(米国心理学会)形式に近いレポート文に整形する。
 * 検定の種類によって書式が異なるため、種類ごとに分岐する。
 */
export function formatApa(result: TestResult, locale: Locale = 'ja'): string {
  const testId = result.testId;
  const pPart = formatApaP(result.pValue);

  // 相関係数を報告する検定（ピアソン・スピアマン・ケンドール）
  const corrSymbol = CORRELATION_SYMBOL[testId];
  if (corrSymbol && result.correlation) {
    const rStr = formatApaBounded(result.correlation.r);
    if (result.df) {
      return `${corrSymbol}(${result.df}) = ${rStr}, ${pPart}`;
    }
    const n = result.summaries?.[0]?.n;
    return n ? `${corrSymbol} = ${rStr}, ${pPart} (N = ${n})` : `${corrSymbol} = ${rStr}, ${pPart}`;
  }

  // 二元配置分散分析：要因ごとに1行ずつ
  if (result.anovaRows) {
    return result.anovaRows
      .map(
        (row) =>
          `${translateStatsText(row.source, locale)}: F(${row.df}) = ${formatApaValue(row.f)}, ${formatApaP(row.p)}`,
      )
      .join('\n');
  }

  // フィッシャーの正確確率検定：検定統計量を持たず正確確率のみ報告する
  if (testId === 'fisher-exact') {
    return locale === 'en'
      ? `Fisher's exact test, ${pPart} (two-sided)`
      : `Fisher's exact test, ${pPart}（両側）`;
  }

  // 符号検定：二項検定として報告する
  if (testId === 'sign-test') {
    const pos = findExtra(result, '正の差');
    const n = findExtra(result, '有効ペア数');
    return locale === 'en'
      ? `Sign test: positive = ${pos}, valid pairs = ${n}, ${pPart}`
      : `符号検定：正${pos}／有効${n}, ${pPart}`;
  }

  // マクネマー検定：正確二項検定の場合は検定統計量を持たない
  if (testId === 'mcnemar-test' && result.approxNote?.includes('二項検定')) {
    return `McNemar's exact test, ${pPart}`;
  }

  // 一般形：記号(自由度) = 値, p = ...
  const symbol = STAT_SYMBOL[testId] ?? result.statLabel.replace(/値$/, '');
  const valueStr = BOUNDED_STAT_IDS.has(testId)
    ? formatApaBounded(result.statValue)
    : formatApaValue(result.statValue);
  if (result.df) {
    return `${symbol}(${result.df}) = ${valueStr}, ${pPart}`;
  }
  return `${symbol} = ${valueStr}, ${pPart}`;
}
