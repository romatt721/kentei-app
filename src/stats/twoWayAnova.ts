import jStat from 'jstat';
import { mean } from 'simple-statistics';
import type { TestResult } from '../types';
import { interpretEta } from './effectSize';
import { StatError, summarize } from './utils';

/**
 * 二元配置分散分析（繰り返しあり・釣り合い型）
 * @param cells 各セルのデータ。列の並びは A1B1, A1B2, …, A2B1, …（index = i*b + j）
 * @param a 要因Aの水準数
 * @param b 要因Bの水準数
 */
export function twoWayAnova(cells: number[][], a: number, b: number): TestResult {
  if (cells.length !== a * b) {
    throw new StatError('セル数が要因の水準数と一致しません。');
  }
  const n = cells[0].length;
  if (n < 2) {
    throw new StatError('交互作用を検定するには各セルに2つ以上のデータが必要です。');
  }
  if (cells.some((c) => c.length !== n)) {
    throw new StatError('すべてのセルのデータ数は同じにしてください（釣り合い型のみ対応）。');
  }

  const all = cells.flat();
  const grand = mean(all);
  const cellMeans = cells.map((c) => mean(c));

  // 水準ごとの平均
  const aMeans = Array.from({ length: a }, (_, i) =>
    mean(cells.slice(i * b, (i + 1) * b).flat()),
  );
  const bMeans = Array.from({ length: b }, (_, j) =>
    mean(Array.from({ length: a }, (_, i) => cells[i * b + j]).flat()),
  );

  const ssA = b * n * aMeans.reduce((s, m) => s + (m - grand) ** 2, 0);
  const ssB = a * n * bMeans.reduce((s, m) => s + (m - grand) ** 2, 0);
  let ssAB = 0;
  for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
      ssAB += n * (cellMeans[i * b + j] - aMeans[i] - bMeans[j] + grand) ** 2;
    }
  }
  let ssE = 0;
  cells.forEach((c, idx) => {
    for (const v of c) ssE += (v - cellMeans[idx]) ** 2;
  });

  const dfA = a - 1;
  const dfB = b - 1;
  const dfAB = dfA * dfB;
  const dfE = a * b * (n - 1);
  const msE = ssE / dfE;
  if (msE === 0) {
    throw new StatError('セル内のばらつきが0のため、F値を計算できません。');
  }

  const fA = ssA / dfA / msE;
  const fB = ssB / dfB / msE;
  const fAB = ssAB / dfAB / msE;
  const pA = 1 - jStat.centralF.cdf(fA, dfA, dfE);
  const pB = 1 - jStat.centralF.cdf(fB, dfB, dfE);
  const pAB = 1 - jStat.centralF.cdf(fAB, dfAB, dfE);

  const labels = cells.map((_, idx) => {
    const i = Math.floor(idx / b);
    const j = idx % b;
    return `A${i + 1}・B${j + 1}`;
  });

  return {
    testId: 'two-way-anova',
    method: '二元配置分散分析（繰り返しあり・釣り合い型）',
    statLabel: 'F値（交互作用A×B）',
    statValue: fAB,
    df: `${dfAB}, ${dfE}`,
    pValue: pAB,
    anovaRows: [
      { source: '要因A', df: `${dfA}, ${dfE}`, f: fA, p: pA },
      { source: '要因B', df: `${dfB}, ${dfE}`, f: fB, p: pB },
      { source: '交互作用 A×B', df: `${dfAB}, ${dfE}`, f: fAB, p: pAB },
    ],
    effectSizes: [
      {
        label: '偏η²（要因A）',
        value: ssA / (ssA + ssE),
        interpretation: interpretEta(ssA / (ssA + ssE)),
      },
      {
        label: '偏η²（要因B）',
        value: ssB / (ssB + ssE),
        interpretation: interpretEta(ssB / (ssB + ssE)),
      },
      {
        label: '偏η²（交互作用A×B）',
        value: ssAB / (ssAB + ssE),
        interpretation: interpretEta(ssAB / (ssAB + ssE)),
      },
    ],
    approxNote:
      '交互作用が有意な場合、主効果の解釈には注意が必要です（単純主効果の分析を検討してください）。',
    summaries: summarize(cells, labels),
    extraStats: [
      { label: '要因A平方和 (SSA)', value: ssA.toFixed(4) },
      { label: '要因B平方和 (SSB)', value: ssB.toFixed(4) },
      { label: '交互作用平方和 (SSAB)', value: ssAB.toFixed(4) },
      { label: '誤差平方和 (SSE)', value: ssE.toFixed(4) },
    ],
  };
}
