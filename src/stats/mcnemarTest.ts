import jStat from 'jstat';
import type { TestResult } from '../types';
import { logChoose } from './normal';
import { StatError } from './utils';

/**
 * マクネマー検定（対応のある2値データの2×2表）
 * 変化したペア数（b+c）が25以下なら正確二項検定、それより大きければ連続性補正付きχ²検定。
 */
export function mcnemarTest(observed: number[][]): TestResult {
  if (observed.length !== 2 || observed.some((r) => r.length !== 2)) {
    throw new StatError('2×2の分割表が必要です。');
  }
  for (const row of observed) {
    for (const v of row) {
      if (!Number.isInteger(v) || v < 0) {
        throw new StatError('度数には0以上の整数を入力してください。');
      }
    }
  }
  const b = observed[0][1]; // 1回目:あり → 2回目:なし
  const c = observed[1][0]; // 1回目:なし → 2回目:あり
  const nChanged = b + c;
  if (nChanged === 0) {
    throw new StatError(
      '変化したペア（非対角セル）が0のため、検定を実行できません。',
    );
  }

  const chi2 = (Math.abs(b - c) - 1) ** 2 / nChanged;
  const kMin = Math.min(b, c);
  const isExact = nChanged <= 25;

  let p: number;
  let method: string;
  let approxNote: string;
  if (isExact) {
    // 正確二項検定: X ~ B(b+c, 0.5)
    let cdf = 0;
    for (let i = 0; i <= kMin; i++) {
      cdf += Math.exp(logChoose(nChanged, i) + nChanged * Math.log(0.5));
    }
    p = Math.min(1, 2 * cdf);
    method = 'マクネマー検定（正確二項検定・両側）';
    approxNote =
      '変化したペア数が25以下のため、二項分布による正確なp値を表示しています。この場合χ²値・自由度は用いません。';
  } else {
    p = 1 - jStat.chisquare.cdf(chi2, 1);
    method = 'マクネマー検定（連続性補正付きχ²検定）';
    approxNote = 'p値は連続性補正付きχ²近似（自由度1）による値です。';
  }

  return {
    testId: 'mcnemar-test',
    method,
    statLabel: isExact ? '変化の少ない方の度数 min(b, c)' : 'χ²値（連続性補正あり）',
    statValue: isExact ? kMin : chi2,
    df: isExact ? undefined : '1',
    pValue: p,
    effectSizes:
      c > 0
        ? [
            {
              label: 'オッズ比（b/c：変化の偏り）',
              value: b / c,
            },
          ]
        : undefined,
    approxNote,
    extraStats: [
      { label: 'b（あり→なし に変化）', value: String(b) },
      { label: 'c（なし→あり に変化）', value: String(c) },
      { label: '変化したペア数（b+c）', value: String(nChanged) },
      {
        label: '総ペア数 N',
        value: String(observed[0][0] + b + c + observed[1][1]),
      },
    ],
  };
}
