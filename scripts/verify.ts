/**
 * 統計計算の検算スクリプト。
 * 既知の値（R・教科書の例）と照合する。実行: npx tsx scripts/verify.ts
 */
import jStat from 'jstat';
import { formatApa } from '../src/stats/apa';
import { chiSquareGoodness } from '../src/stats/chiSquareGoodness';
import { chiSquareIndependence } from '../src/stats/chiSquareIndependence';
import { cochranQ } from '../src/stats/cochranQ';
import { friedmanTest } from '../src/stats/friedmanTest';
import { fTestVariance } from '../src/stats/fTestVariance';
import { kendallTau } from '../src/stats/kendallTau';
import { leveneTest } from '../src/stats/leveneTest';
import { mcnemarTest } from '../src/stats/mcnemarTest';
import { repeatedMeasuresAnova } from '../src/stats/repeatedMeasuresAnova';
import { shapiroWilk } from '../src/stats/shapiroWilk';
import { signTest } from '../src/stats/signTest';
import { tTestOneSample } from '../src/stats/tTestOneSample';
import { twoWayAnova } from '../src/stats/twoWayAnova';
import { welchTTest } from '../src/stats/welchTTest';
import { translateStatsText } from '../src/stats/statsLabels';
import { getLocalizedTest } from '../src/data/tests.en';
import { tests, getTestById } from '../src/data/tests';
import { GUIDE_NODES, GUIDE_START, parseResult } from '../src/data/guideTree';
import { getLocalizedNode } from '../src/data/guideTree.en';
import { fisherExact } from '../src/stats/fisherExact';
import { kruskalWallis } from '../src/stats/kruskalWallis';
import { mannWhitneyU } from '../src/stats/mannWhitneyU';
import { oneWayAnova } from '../src/stats/oneWayAnova';
import { pearsonCorrelation } from '../src/stats/pearsonCorrelation';
import { spearmanCorrelation } from '../src/stats/spearmanCorrelation';
import { tTestIndependent } from '../src/stats/tTestIndependent';
import { tTestPaired } from '../src/stats/tTestPaired';
import { ptukey } from '../src/stats/tukey';
import { wilcoxonSigned } from '../src/stats/wilcoxonSigned';

let failed = 0;

function check(name: string, actual: number, expected: number, tol: number) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failed++;
  console.log(
    `${ok ? 'OK ' : 'NG '} ${name}: actual=${actual.toFixed(6)} expected=${expected.toFixed(6)} (tol=${tol})`,
  );
}

// --- 対応なしt検定: A=[1..5], B=[2,4,6,8,10] → t=-1.8974, df=8, p=0.09434
{
  const r = tTestIndependent([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  check('t-indep t', r.statValue, -1.8974, 0.001);
  check('t-indep p', r.pValue, 0.09434, 0.001);
}

// --- 対応ありt検定: 手計算 t=-3.2071, df=4, p≈0.0327
{
  const r = tTestPaired([1, 2, 3, 4, 5], [2, 3, 5, 4, 7]);
  check('t-paired t', r.statValue, -3.2071, 0.001);
  check('t-paired p', r.pValue, 0.0327, 0.001);
}

// --- ANOVA: [[1,2,3],[2,3,4],[4,5,6]] → F=7, df=(2,6), p=0.02704
{
  const r = oneWayAnova([
    [1, 2, 3],
    [2, 3, 4],
    [4, 5, 6],
  ]);
  check('anova F', r.statValue, 7, 1e-9);
  check('anova p', r.pValue, 0.02704, 0.0005);
}

// --- ptukey: k=2 のとき ptukey(q,2,df) = 2*P(T<=q/√2) - 1 と一致するはず
for (const df of [5, 15, 60]) {
  for (const q of [1.5, 3.0, 4.5]) {
    const exact = 2 * jStat.studentt.cdf(q / Math.SQRT2, df) - 1;
    check(`ptukey(q=${q},k=2,df=${df})`, ptukey(q, 2, df), exact, 0.0005);
  }
}
// 数表の臨界値: q_{0.05}(k=3, df=12) = 3.773 → CDF ≈ 0.95
check('ptukey(3.773,3,12)', ptukey(3.773, 3, 12), 0.95, 0.001);

// --- マン・ホイットニー: A=[1..5], B=[6..10] → U=0, 正規近似p≈0.01221
{
  const r = mannWhitneyU([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]);
  check('MWU U', r.statValue, 0, 1e-9);
  check('MWU p', r.pValue, 0.01221, 0.0005);
}

// --- ウィルコクソン符号順位: 差=[+1..+5] → W=0, 正規近似p≈0.05906
{
  const r = wilcoxonSigned([2, 4, 6, 8, 10], [1, 2, 3, 4, 5]);
  check('wilcoxon W', r.statValue, 0, 1e-9);
  check('wilcoxon p', r.pValue, 0.05906, 0.001);
}

// --- クラスカル・ウォリス: [[1,2,3],[4,5,6],[7,8,9]] → H=7.2, p=0.02732
{
  const r = kruskalWallis([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  check('KW H', r.statValue, 7.2, 1e-9);
  check('KW p', r.pValue, 0.02732, 0.0005);
}

// --- カイ二乗独立性: [[10,20],[30,40]] → χ²=0.79365, df=1, p=0.37309
{
  const r = chiSquareIndependence([
    [10, 20],
    [30, 40],
  ]);
  check('chi2', r.statValue, 0.79365, 0.0001);
  check('chi2 p', r.pValue, 0.37309, 0.0005);
}

// --- フィッシャー正確検定: [[1,9],[11,3]] → 両側p=0.0027594（Rのfisher.test）
{
  const r = fisherExact([
    [1, 9],
    [11, 3],
  ]);
  check('fisher p', r.pValue, 0.0027594, 0.0001);
}

// --- ピアソン: x=[1..5], y=[2,1,4,3,7] → r=0.82416, p≈0.0863
{
  const r = pearsonCorrelation([1, 2, 3, 4, 5], [2, 1, 4, 3, 7]);
  check('pearson r', r.correlation!.r, 0.82416, 0.0001);
  check('pearson p', r.pValue, 0.0863, 0.001);
}

// --- スピアマン: 同データ → ρ=0.8, t近似p≈0.10405
{
  const r = spearmanCorrelation([1, 2, 3, 4, 5], [2, 1, 4, 3, 7]);
  check('spearman rho', r.correlation!.r, 0.8, 1e-9);
  check('spearman p', r.pValue, 0.10405, 0.001);
}

// ===== 第2フェーズ13検定（scipyの出力と照合） =====

// --- 1標本t検定: scipy.ttest_1samp → t=0.727607, p=0.490469
{
  const r = tTestOneSample([4.8, 5.2, 5.6, 4.7, 5.1, 5.0, 4.9, 5.3], 5.0);
  check('one-sample t', r.statValue, 0.727607, 0.0001);
  check('one-sample p', r.pValue, 0.490469, 0.0005);
}

// --- ウェルチ: scipy.ttest_ind(equal_var=False) → t=-1.897367, p=0.107531
{
  const r = welchTTest([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  check('welch t', r.statValue, -1.897367, 0.0001);
  check('welch p', r.pValue, 0.107531, 0.0005);
}

// --- 等分散性のF検定: F=0.25, 両側p=0.208
{
  const r = fTestVariance([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  check('f-test F', r.statValue, 0.25, 1e-9);
  check('f-test p', r.pValue, 0.208, 0.0005);
}

// --- ルビーン検定: scipy.levene(center='mean') → W=3.428571, p=0.06641
{
  const r = leveneTest([
    [1, 2, 3, 4, 5],
    [2, 4, 6, 8, 10],
    [1, 5, 9, 13, 17],
  ]);
  check('levene W', r.statValue, 3.428571, 0.0001);
  check('levene p', r.pValue, 0.06641, 0.0005);
}

// --- シャピロ・ウィルク: scipy.shapiro と照合
{
  const r = shapiroWilk([148, 154, 158, 160, 161, 162, 166, 170, 182, 195, 236]);
  check('shapiro n=11 W', r.statValue, 0.788815, 0.001);
  check('shapiro n=11 p', r.pValue, 0.006704, 0.001);
  const r2 = shapiroWilk([
    2.1, 3.4, 1.9, 2.8, 3.0, 2.2, 2.5, 3.1, 2.7, 2.9, 2.4, 2.6, 3.3, 2.0, 2.35,
  ]);
  check('shapiro n=15 W', r2.statValue, 0.970937, 0.001);
  check('shapiro n=15 p', r2.pValue, 0.871684, 0.005);
}

// --- 符号検定: 正8・負2 → 正確p = 0.109375
{
  const r = signTest(
    [2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
    [1, 2, 3, 4, 5, 6, 7, 8, 3, 4],
  );
  check('sign S', r.statValue, 8, 1e-9);
  check('sign p', r.pValue, 0.109375, 1e-6);
}

// --- フリードマン検定: scipy.friedmanchisquare → χ²=0.5, p=0.778801
{
  const r = friedmanTest([
    [7, 6, 9, 8],
    [9, 5, 7, 5],
    [8, 7, 6, 6],
  ]);
  check('friedman chi2', r.statValue, 0.5, 0.0001);
  check('friedman p', r.pValue, 0.778801, 0.0005);
}

// --- 適合度検定: scipy.chisquare → χ²=0.8, p=0.849467
{
  const r = chiSquareGoodness([8, 12, 10, 20], [1, 1, 1, 2]);
  check('goodness chi2', r.statValue, 0.8, 1e-9);
  check('goodness p', r.pValue, 0.849467, 0.0005);
}

// --- マクネマー（正確二項検定、b+c=12≤25）: b=3, c=9 → 正確p=0.145996, 統計量min(b,c)=3, dfなし
{
  const r = mcnemarTest([
    [20, 3],
    [9, 18],
  ]);
  check('mcnemar exact: statValue = min(b,c)', r.statValue, 3, 1e-9);
  check('mcnemar exact: no df', r.df === undefined ? 1 : 0, 1, 0);
  check('mcnemar exact p', r.pValue, 0.145996, 1e-5);
}

// --- マクネマー（連続性補正付きχ²検定、b+c=30＞25）: b=10, c=20 → χ²(補正)=(|10-20|-1)²/30=81/30=2.7
{
  const r = mcnemarTest([
    [50, 10],
    [20, 40],
  ]);
  check('mcnemar chi2: statValue = χ²', r.statValue, 2.7, 1e-9);
  check('mcnemar chi2: df = 1', r.df === '1' ? 1 : 0, 1, 0);
  check('mcnemar chi2 p', r.pValue, 1 - jStat.chisquare.cdf(2.7, 1), 1e-9);
}

// --- コクランのQ: 手計算（scipyで検算済み）→ Q=5.2, p=0.074274
{
  const r = cochranQ([
    [1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1],
    [0, 0, 1, 0, 1, 0],
  ]);
  check('cochran Q', r.statValue, 5.2, 1e-9);
  check('cochran p', r.pValue, 0.074274, 0.0005);
}

// --- ケンドールτb: scipy.kendalltau(method='asymptotic') → τ=0.276026, p=0.277289
{
  const r = kendallTau(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
  );
  check('kendall tau', r.correlation!.r, 0.276026, 0.0001);
  check('kendall p', r.pValue, 0.277289, 0.0005);
}

// --- 反復測定ANOVA: k=2 のとき対応ありt検定と等価（F = t²）→ F=10.285714, p=0.032678
{
  const r = repeatedMeasuresAnova([
    [1, 2, 3, 4, 5],
    [2, 3, 5, 4, 7],
  ]);
  check('RM-ANOVA F (=t²)', r.statValue, 10.285714, 0.0001);
  check('RM-ANOVA p', r.pValue, 0.032678, 0.0005);
}

// --- 二元配置ANOVA: 2×2×2 手計算例 → F_A=64 (p=0.001324), F_B=16 (p=0.01613), F_AB=0
{
  const r = twoWayAnova(
    [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
    2,
    2,
  );
  const rows = r.anovaRows!;
  check('two-way F_A', rows[0].f, 64, 1e-9);
  check('two-way p_A', rows[0].p, 0.001324, 0.0005);
  check('two-way F_B', rows[1].f, 16, 1e-9);
  check('two-way p_B', rows[1].p, 0.01613, 0.0005);
  check('two-way F_AB', rows[2].f, 0, 1e-9);
}

// ===== 効果量（手計算・定義式と照合） =====
{
  const r = tTestIndependent([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  // d = (3-6)/√6.25 = -1.2
  check("effect: t-indep Cohen's d", r.effectSizes![0].value, -1.2, 1e-9);
}
{
  const r = tTestPaired([1, 2, 3, 4, 5], [2, 3, 5, 4, 7]);
  // dz = -1.2/√0.7 = -1.43427
  check('effect: paired dz', r.effectSizes![0].value, -1.43427, 0.0001);
}
{
  const r = tTestOneSample([4.8, 5.2, 5.6, 4.7, 5.1, 5.0, 4.9, 5.3], 5.0);
  // d = t/√n = 0.727607/√8
  check('effect: one-sample d', r.effectSizes![0].value, 0.727607 / Math.sqrt(8), 0.0001);
}
{
  const r = welchTTest([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  // d_av = -3/√((2.5+10)/2) = -1.2
  check('effect: welch d', r.effectSizes![0].value, -1.2, 1e-9);
}
{
  const r = oneWayAnova([
    [1, 2, 3],
    [2, 3, 4],
    [4, 5, 6],
  ]);
  // η² = 14/20 = 0.7
  check('effect: anova η²', r.effectSizes![0].value, 0.7, 1e-9);
}
{
  const r = twoWayAnova(
    [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
    2,
    2,
  );
  check('effect: two-way 偏η²A', r.effectSizes![0].value, 32 / 34, 1e-9);
  check('effect: two-way 偏η²B', r.effectSizes![1].value, 0.8, 1e-9);
  check('effect: two-way 偏η²AB', r.effectSizes![2].value, 0, 1e-9);
}
{
  const r = repeatedMeasuresAnova([
    [1, 2, 3, 4, 5],
    [2, 3, 5, 4, 7],
  ]);
  // 偏η² = 3.6/(3.6+1.4) = 0.72
  check('effect: RM 偏η²', r.effectSizes![0].value, 0.72, 1e-6);
}
{
  const r = mannWhitneyU([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]);
  // r = z/√N = 2.50673/√10
  check('effect: MWU r', r.effectSizes![0].value, 0.7927, 0.0005);
}
{
  const r = wilcoxonSigned([2, 4, 6, 8, 10], [1, 2, 3, 4, 5]);
  // r = 1.88776/√5
  check('effect: wilcoxon r', r.effectSizes![0].value, 0.844233, 0.0005);
}
{
  const r = kruskalWallis([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  // η²H = (7.2-3+1)/(9-3)
  check('effect: KW η²H', r.effectSizes![0].value, 5.2 / 6, 1e-9);
}
{
  const r = chiSquareIndependence([
    [10, 20],
    [30, 40],
  ]);
  // V = √(0.793651/100)
  check("effect: chi2 Cramér's V", r.effectSizes![0].value, 0.089089, 0.0001);
}
{
  const r = fisherExact([
    [1, 9],
    [11, 3],
  ]);
  // φ = (3-99)/√(10·14·12·12)
  check('effect: fisher φ', r.effectSizes![0].value, -0.676123, 0.0001);
}
{
  const r = chiSquareGoodness([8, 12, 10, 20], [1, 1, 1, 2]);
  // w = √(0.8/50)
  check("effect: goodness Cohen's w", r.effectSizes![0].value, Math.sqrt(0.8 / 50), 1e-9);
}
{
  const r = friedmanTest([
    [7, 6, 9, 8],
    [9, 5, 7, 5],
    [8, 7, 6, 6],
  ]);
  // W = 0.5/(4·2)
  check('effect: friedman W', r.effectSizes![0].value, 0.0625, 0.0001);
}
{
  const r = mcnemarTest([
    [20, 3],
    [9, 18],
  ]);
  check('effect: mcnemar OR', r.effectSizes![0].value, 1 / 3, 1e-9);
}
{
  const r = pearsonCorrelation([1, 2, 3, 4, 5], [2, 1, 4, 3, 7]);
  // r² = 0.824163²
  check('effect: pearson r²', r.effectSizes![0].value, 0.679245, 0.0001);
}

// ===== APA形式レポート文の整形 =====
function checkStr(name: string, actual: string, expected: string) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'OK ' : 'NG '} ${name}: actual="${actual}" expected="${expected}"`);
}

{
  const r = tTestIndependent([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  checkStr('apa: t-indep', formatApa(r), 't(8) = -1.90, p = .094');
}
{
  const r = oneWayAnova([
    [1, 2, 3],
    [2, 3, 4],
    [4, 5, 6],
  ]);
  checkStr('apa: anova', formatApa(r), 'F(2, 6) = 7.00, p = .027');
}
{
  const r = pearsonCorrelation([1, 2, 3, 4, 5], [2, 1, 4, 3, 7]);
  checkStr('apa: pearson', formatApa(r), 'r(3) = .82, p = .086');
}
{
  // スピアマン：df分岐（相関係数のうちdfを持つケース）
  const r = spearmanCorrelation([1, 2, 3, 4, 5], [2, 1, 4, 3, 7]);
  checkStr('apa: spearman', formatApa(r), 'ρs(3) = .80, p = .104');
}
{
  // ケンドールのτ：dfを持たずNを併記するケース
  const r = kendallTau([1, 2, 3, 4, 5], [2, 1, 4, 3, 7]);
  checkStr('apa: kendall', formatApa(r), 'τb = .60, p = .142 (N = 5)');
}
{
  const r = chiSquareIndependence([
    [10, 20],
    [30, 40],
  ]);
  checkStr('apa: chi2', formatApa(r), 'χ²(1) = 0.79, p = .373');
}
{
  const r = fisherExact([
    [1, 9],
    [11, 3],
  ]);
  checkStr('apa: fisher', formatApa(r), "Fisher's exact test, p = .003（両側）");
}
{
  const r = mannWhitneyU([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]);
  checkStr('apa: mwu', formatApa(r), 'U = 0.00, p = .012');
}
{
  // マクネマー（正確二項検定の場合）：χ²・自由度を出さず「exact test」表記になることを固定する
  const r = mcnemarTest([
    [20, 3],
    [9, 18],
  ]);
  checkStr('apa: mcnemar exact', formatApa(r), "McNemar's exact test, p = .146");
}
{
  // マクネマー（連続性補正付きχ²検定の場合）
  const r = mcnemarTest([
    [50, 10],
    [20, 40],
  ]);
  checkStr('apa: mcnemar chi2', formatApa(r), 'χ²(1) = 2.70, p = .100');
}
{
  const r = shapiroWilk([148, 154, 158, 160, 161, 162, 166, 170, 182, 195, 236]);
  checkStr('apa: shapiro', formatApa(r), 'W = .79, p = .007');
}
{
  const r = twoWayAnova(
    [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
    2,
    2,
  );
  checkStr(
    'apa: two-way',
    formatApa(r),
    '要因A: F(1, 4) = 64.00, p = .001\n要因B: F(1, 4) = 16.00, p = .016\n交互作用 A×B: F(1, 4) = 0.00, p = 1.000',
  );
}

// ===== 英語ロケール（i18n）の検証 =====

// --- 完全一致・テンプレートパターンの翻訳辞書 ---
checkStr('i18n: exact match', translateStatsText('群A', 'en'), 'Group A');
checkStr('i18n: ja passthrough', translateStatsText('群A', 'ja'), '群A');
checkStr('i18n: unknown text passthrough', translateStatsText('未知の文字列xyz', 'en'), '未知の文字列xyz');
checkStr('i18n: template 群N', translateStatsText('群3', 'en'), 'Group 3');
checkStr('i18n: template 条件N', translateStatsText('条件2', 'en'), 'Condition 2');
checkStr('i18n: template 群Nの順位和', translateStatsText('群2の順位和', 'en'), 'Rank sum of Group 2');
checkStr('i18n: template 条件Nの順位和', translateStatsText('条件3の順位和', 'en'), 'Rank sum of Condition 3');
checkStr(
  'i18n: template カテゴリNの期待度数',
  translateStatsText('カテゴリ4の期待度数', 'en'),
  'Expected count for Category 4',
);
checkStr('i18n: template tukey pair', translateStatsText('群1 - 群2', 'en'), 'Group 1 - Group 2');
checkStr(
  'i18n: template goodness warning',
  translateStatsText('期待度数が5未満のカテゴリが2個あります。χ²近似の精度が下がります。', 'en'),
  '2 categories have an expected count below 5. The χ² approximation will be less accurate.',
);

// --- 全23検定に英語オーバーレイが存在し、formula（LaTeX）は不変であること ---
{
  let allCovered = true;
  for (const def of tests) {
    const en = getLocalizedTest(def, 'en');
    if (en.name === def.name || en.explanation.formula !== def.explanation.formula) {
      allCovered = false;
      console.log(`NG  i18n: ${def.id} に英語版の不備があります`);
    }
  }
  check('i18n: 全23検定の英語オーバーレイ', allCovered ? 1 : 0, 1, 0);
}

// --- ガイドツリーの英語版がoptions数・next遷移とも一致すること ---
{
  let allMatch = true;
  for (const id of Object.keys(GUIDE_NODES)) {
    const ja = GUIDE_NODES[id];
    const en = getLocalizedNode(id, 'en');
    if (en.options.length !== ja.options.length) allMatch = false;
    ja.options.forEach((opt, i) => {
      if (opt.next !== en.options[i]?.next) allMatch = false;
    });
  }
  check('i18n: ガイドツリー英語版の整合性', allMatch ? 1 : 0, 1, 0);
}

// --- APA形式（英語ロケール） ---
{
  const r = tTestIndependent([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  checkStr('apa(en): t-indep（記号は言語非依存）', formatApa(r, 'en'), 't(8) = -1.90, p = .094');
}
{
  const r = fisherExact([
    [1, 9],
    [11, 3],
  ]);
  checkStr('apa(en): fisher', formatApa(r, 'en'), "Fisher's exact test, p = .003 (two-sided)");
}
{
  const r = twoWayAnova(
    [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ],
    2,
    2,
  );
  checkStr(
    'apa(en): two-way',
    formatApa(r, 'en'),
    'Factor A: F(1, 4) = 64.00, p = .001\nFactor B: F(1, 4) = 16.00, p = .016\nInteraction A×B: F(1, 4) = 0.00, p = 1.000',
  );
}
{
  const r = signTest(
    [2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
    [1, 2, 3, 4, 5, 6, 7, 8, 3, 4],
  );
  checkStr('apa(en): sign-test', formatApa(r, 'en'), 'Sign test: positive = 8, valid pairs = 10, p = .109');
}

// getTestByIdが未使用警告にならないよう、存在確認に利用
check('i18n: getTestById smoke test', getTestById('t-test-independent') ? 1 : 0, 1, 0);
check('i18n: parseResult smoke test', parseResult('RESULT:x') === 'x' ? 1 : 0, 1, 0);
check('i18n: GUIDE_START defined', GUIDE_START === 'root' ? 1 : 0, 1, 0);

console.log(failed === 0 ? '\nすべて一致しました。' : `\n${failed}件の不一致があります。`);
process.exit(failed === 0 ? 0 : 1);
