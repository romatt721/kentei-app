import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult, TukeyRow } from '../types';
import { interpretEta } from './effectSize';
import { ptukey } from './tukey';
import { StatError, summarize } from './utils';

/** 一元配置分散分析（One-way ANOVA）＋ Tukey-Kramer 多重比較 */
export function oneWayAnova(groups: number[][]): TestResult {
  const k = groups.length;
  if (k < 3) {
    throw new StatError('3群以上のデータが必要です。');
  }
  for (const g of groups) {
    if (g.length < 2) {
      throw new StatError('各群に2つ以上のデータが必要です。');
    }
  }
  const all = groups.flat();
  const N = all.length;
  const grandMean = mean(all);
  const groupMeans = groups.map((g) => mean(g));

  let ssb = 0;
  let ssw = 0;
  groups.forEach((g, i) => {
    ssb += g.length * (groupMeans[i] - grandMean) ** 2;
    for (const v of g) {
      ssw += (v - groupMeans[i]) ** 2;
    }
  });

  const dfB = k - 1;
  const dfW = N - k;
  const msb = ssb / dfB;
  const msw = ssw / dfW;
  if (msw === 0) {
    throw new StatError('群内のばらつきが0のため、F値を計算できません。');
  }
  const f = msb / msw;
  const p = 1 - jStat.centralF.cdf(f, dfB, dfW);

  // Tukey-Kramer 多重比較（群のサンプル数が異なる場合にも対応）
  const labels = groups.map((_, i) => `群${i + 1}`);
  const tukey: TukeyRow[] = [];
  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      const diff = groupMeans[i] - groupMeans[j];
      const se = Math.sqrt(
        (msw / 2) * (1 / groups[i].length + 1 / groups[j].length),
      );
      const q = Math.abs(diff) / se;
      tukey.push({
        pair: `${labels[i]} - ${labels[j]}`,
        diff,
        q,
        p: 1 - ptukey(q, k, dfW),
      });
    }
  }

  return {
    testId: 'one-way-anova',
    method: '一元配置分散分析（One-way ANOVA）',
    statLabel: 'F値',
    statValue: f,
    df: `${dfB}, ${dfW}`,
    pValue: p,
    effectSizes: [
      {
        label: 'η²（イータ二乗）',
        value: ssb / (ssb + ssw),
        interpretation: interpretEta(ssb / (ssb + ssw)),
      },
    ],
    tukey,
    summaries: summarize(groups, labels),
    extraStats: [
      { label: '群間平方和 (SSB)', value: ssb.toFixed(4) },
      { label: '群内平方和 (SSW)', value: ssw.toFixed(4) },
      { label: '群間平均平方 (MSB)', value: msb.toFixed(4) },
      { label: '群内平均平方 (MSW)', value: msw.toFixed(4) },
    ],
  };
}
