import jStat from 'jstat';
import type { TestResult } from '../types';
import { correlationLabel, pearsonR } from './pearsonCorrelation';
import { rankWithTies, StatError, summarize } from './utils';

/** スピアマン順位相関係数の無相関検定（t近似・両側） */
export function spearmanCorrelation(x: number[], y: number[]): TestResult {
  if (x.length !== y.length) {
    throw new StatError('2つの変数のデータ数が一致していません。');
  }
  const n = x.length;
  if (n < 3) {
    throw new StatError('3ペア以上のデータが必要です。');
  }
  // 順位に変換してピアソン相関を計算（同順位があっても正しい方法）
  const rx = rankWithTies(x);
  const ry = rankWithTies(y);
  const rho = pearsonR(rx, ry);

  const df = n - 2;
  let t: number;
  let p: number;
  if (1 - rho * rho < 1e-15) {
    t = Infinity;
    p = 0;
  } else {
    t = rho * Math.sqrt(df / (1 - rho * rho));
    p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
  }

  return {
    testId: 'spearman-correlation',
    method: 'スピアマン順位相関係数の無相関検定（t近似・両側）',
    statLabel: 't値',
    statValue: t,
    df: String(df),
    pValue: p,
    approxNote:
      'p値はt分布による近似値です。サンプル数が10未満の場合は近似精度が下がります。',
    correlation: { r: rho, label: correlationLabel(rho) },
    summaries: summarize([x, y], ['変数X', '変数Y']),
  };
}
