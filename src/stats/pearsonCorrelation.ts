import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { StatError, summarize } from './utils';

/** 相関係数の強さの言語的解釈（|r| に基づく目安） */
export function correlationLabel(r: number): string {
  const abs = Math.abs(r);
  const direction = r >= 0 ? '正' : '負';
  if (abs < 0.2) return 'ほとんど相関なし';
  if (abs < 0.4) return `弱い${direction}の相関`;
  if (abs < 0.7) return `中程度の${direction}の相関`;
  if (abs < 0.9) return `強い${direction}の相関`;
  return `非常に強い${direction}の相関`;
}

/** ピアソンの積率相関係数を計算する */
export function pearsonR(x: number[], y: number[]): number {
  const mx = mean(x);
  const my = mean(y);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  if (sxx === 0 || syy === 0) {
    throw new StatError(
      '一方の変数の値がすべて同一のため、相関係数を計算できません。',
    );
  }
  return sxy / Math.sqrt(sxx * syy);
}

/** ピアソン積率相関係数の無相関検定（t分布・両側） */
export function pearsonCorrelation(x: number[], y: number[]): TestResult {
  if (x.length !== y.length) {
    throw new StatError('2つの変数のデータ数が一致していません。');
  }
  const n = x.length;
  if (n < 3) {
    throw new StatError('3ペア以上のデータが必要です。');
  }
  const r = pearsonR(x, y);
  const df = n - 2;
  let t: number;
  let p: number;
  if (1 - r * r < 1e-15) {
    // 完全相関
    t = Infinity;
    p = 0;
  } else {
    t = r * Math.sqrt(df / (1 - r * r));
    p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
  }

  return {
    testId: 'pearson-correlation',
    method: 'ピアソン積率相関係数の無相関検定（両側）',
    statLabel: 't値',
    statValue: t,
    df: String(df),
    pValue: p,
    correlation: { r, label: correlationLabel(r) },
    effectSizes: [
      {
        label: '決定係数 r²（Yの変動のうちXで説明できる割合）',
        value: r * r,
      },
    ],
    summaries: summarize([x, y], ['変数X', '変数Y']),
  };
}
