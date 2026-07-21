import { getLocalizedTest } from '../data/tests.en';
import type { Locale } from '../i18n/LocaleContext';
import type { ParamsState, TestDef, TestResult } from '../types';
import { chiSquareGoodness } from './chiSquareGoodness';
import { chiSquareIndependence } from './chiSquareIndependence';
import { cochranQ } from './cochranQ';
import { fisherExact } from './fisherExact';
import { friedmanTest } from './friedmanTest';
import { fTestVariance } from './fTestVariance';
import { kendallTau } from './kendallTau';
import { kruskalWallis } from './kruskalWallis';
import { leveneTest } from './leveneTest';
import { mannWhitneyU } from './mannWhitneyU';
import { mcnemarTest } from './mcnemarTest';
import { oneWayAnova } from './oneWayAnova';
import { pearsonCorrelation } from './pearsonCorrelation';
import { repeatedMeasuresAnova } from './repeatedMeasuresAnova';
import { shapiroWilk } from './shapiroWilk';
import { signTest } from './signTest';
import { spearmanCorrelation } from './spearmanCorrelation';
import { tTestIndependent } from './tTestIndependent';
import { tTestOneSample } from './tTestOneSample';
import { tTestPaired } from './tTestPaired';
import { twoWayAnova } from './twoWayAnova';
import { StatError } from './utils';
import { welchTTest } from './welchTTest';
import { wilcoxonSigned } from './wilcoxonSigned';

export { StatError };

/** 画面Cの列ラベルを検定・パラメータ・言語から決定する */
export function getColumnLabels(def: TestDef, params: ParamsState, locale: Locale = 'ja'): string[] {
  const localized = getLocalizedTest(def, locale);
  const kind = localized.input?.kind;
  const isEn = locale === 'en';
  if (kind === 'goodness') {
    return isEn ? ['Observed', 'Expected ratio'] : ['観測度数', '期待比率'];
  }
  if (params.kind === 'matrix') {
    if (localized.input?.matrixColLabels) return localized.input.matrixColLabels;
    return Array.from({ length: params.cols }, (_, j) => (isEn ? `Column ${j + 1}` : `列${j + 1}`));
  }
  if (params.kind === 'twoWay') {
    const labels: string[] = [];
    for (let i = 0; i < params.a; i++) {
      for (let j = 0; j < params.b; j++) {
        // 「A1・B1」表記は言語に依存しないためそのまま使う
        labels.push(`A${i + 1}・B${j + 1}`);
      }
    }
    return labels;
  }
  if (kind === 'conditions') {
    return params.sizes.map((_, j) => (isEn ? `Condition ${j + 1}` : `条件${j + 1}`));
  }
  if (kind === 'oneGroup') {
    return [isEn ? 'Data' : 'データ'];
  }
  const fixed = localized.input?.columnLabels;
  if (fixed) return [...fixed];
  return params.sizes.map((_, i) => (isEn ? `Group ${i + 1}` : `群${i + 1}`));
}

/** 画面Cの行ラベルを返す（分割表・適合度検定用） */
export function getRowLabel(def: TestDef, rowIndex: number, locale: Locale = 'ja'): string {
  const localized = getLocalizedTest(def, locale);
  const rowLabels = localized.input?.matrixRowLabels;
  if (rowLabels?.[rowIndex]) return rowLabels[rowIndex];
  const prefix = localized.input?.rowLabelPrefix ?? (locale === 'en' ? 'Row' : '行');
  // 英語は「Category 1」のように単語と数字の間にスペースを入れる（日本語は「カテゴリ1」でスペース無しが自然）
  const separator = locale === 'en' ? ' ' : '';
  return `${prefix}${separator}${rowIndex + 1}`;
}

/** セルの文字列を数値に変換する。数値でなければ null */
export function parseCell(raw: string): number | null {
  const s = raw.trim().replace(/[０-９．－ー]/g, (ch) => {
    // 全角数字・記号を半角に変換
    if (ch === '．') return '.';
    if (ch === '－' || ch === 'ー') return '-';
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
  if (s === '') return null;
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

function parseGrid(grid: string[][]): number[][] {
  return grid.map((col) =>
    col.map((cell) => {
      const v = parseCell(cell);
      if (v === null) {
        throw new StatError('数値でない入力があります。すべてのセルに数値を入力してください。');
      }
      return v;
    }),
  );
}

/**
 * 検定を実行して結果を返す。
 * grid の構造：
 * - 群形式（twoGroups / paired / multiGroups / oneGroup / conditions / twoWay）:
 *   grid[群index][サンプルindex]
 * - 分割表形式（matrix / fisher / goodness）: grid[行index][列index]
 */
export function computeResult(
  def: TestDef,
  params: ParamsState,
  grid: string[][],
): TestResult {
  const data = parseGrid(grid);
  const result = computeResultInner(def, params, data);
  result.rawData = data;
  return result;
}

function computeResultInner(
  def: TestDef,
  params: ParamsState,
  data: number[][],
): TestResult {
  switch (def.id) {
    // ===== パラメトリック =====
    case 't-test-independent':
      return tTestIndependent(data[0], data[1]);
    case 't-test-paired':
      return tTestPaired(data[0], data[1]);
    case 'one-way-anova':
      return oneWayAnova(data);
    case 'pearson-correlation':
      return pearsonCorrelation(data[0], data[1]);
    case 't-test-one-sample': {
      const mu0 = params.kind === 'groups' ? params.mu0 : undefined;
      if (mu0 === undefined) {
        throw new StatError('基準値μ₀が設定されていません。パラメータ指定に戻ってください。');
      }
      return tTestOneSample(data[0], mu0);
    }
    case 'welch-t-test':
      return welchTTest(data[0], data[1]);
    case 'two-way-anova': {
      if (params.kind !== 'twoWay') {
        throw new StatError('パラメータが不正です。パラメータ指定に戻ってください。');
      }
      return twoWayAnova(data, params.a, params.b);
    }
    case 'repeated-measures-anova':
      return repeatedMeasuresAnova(data);
    case 'f-test-variance':
      return fTestVariance(data[0], data[1]);
    case 'levene-test':
      return leveneTest(data);
    case 'shapiro-wilk':
      return shapiroWilk(data[0]);
    // ===== ノンパラメトリック =====
    case 'mann-whitney-u':
      return mannWhitneyU(data[0], data[1]);
    case 'wilcoxon-signed-rank':
      return wilcoxonSigned(data[0], data[1]);
    case 'kruskal-wallis':
      return kruskalWallis(data);
    case 'chi-square-independence':
      return chiSquareIndependence(data);
    case 'fisher-exact':
      return fisherExact(data);
    case 'spearman-correlation':
      return spearmanCorrelation(data[0], data[1]);
    case 'sign-test':
      return signTest(data[0], data[1]);
    case 'friedman-test':
      return friedmanTest(data);
    case 'chi-square-goodness': {
      // goodness の grid は 行=カテゴリ, 列=[観測度数, 期待比率]
      const observed = data.map((row) => row[0]);
      const ratios = data.map((row) => row[1]);
      return chiSquareGoodness(observed, ratios);
    }
    case 'mcnemar-test':
      return mcnemarTest(data);
    case 'cochran-q':
      return cochranQ(data);
    case 'kendall-tau':
      return kendallTau(data[0], data[1]);
    default:
      throw new StatError('この検定はまだ実装されていません。');
  }
}
