import type { Locale } from '../i18n/LocaleContext';

/**
 * 統計計算モジュール（src/stats/*.ts）が生成する日本語文字列 → 英語の対訳辞書。
 * 計算ロジック自体は変更せず、表示直前に完全一致で置換することで翻訳する
 * （計算結果の検算スクリプトへの影響をゼロにするための設計）。
 */
const EXACT: Record<string, string> = {
  // ---- 汎用エラーメッセージ ----
  '各群に2つ以上のデータが必要です。': 'At least 2 observations are required in each group.',
  '各群に1つ以上のデータが必要です。': 'At least 1 observation is required in each group.',
  '2人以上の対象が必要です。': 'At least 2 subjects are required.',
  '2条件以上のデータが必要です。': 'At least 2 conditions are required.',
  '2つの条件のデータ数が一致していません。': 'The two conditions do not have the same number of observations.',
  '2つの変数のデータ数が一致していません。': 'The two variables do not have the same number of observations.',
  'すべての条件のデータ数が一致していません。': 'All conditions must have the same number of observations.',
  '3ペア以上のデータが必要です。': 'At least 3 pairs of data are required.',
  '2ペア以上のデータが必要です。': 'At least 2 pairs of data are required.',
  '3群以上のデータが必要です。': 'At least 3 groups are required.',
  '2群以上のデータが必要です。': 'At least 2 groups are required.',
  '2×2以上の分割表が必要です。': 'A contingency table of at least 2×2 is required.',
  '2×2の分割表が必要です。': 'A 2×2 contingency table is required.',
  '2カテゴリ以上が必要です。': 'At least 2 categories are required.',
  'データ数が少なすぎます。': 'There are too few data points.',
  '2つ以上のデータが必要です。': 'At least 2 data points are required.',
  '3つ以上のデータが必要です。': 'At least 3 data points are required.',
  'すべての値が同一のため、検定を実行できません。': 'All values are identical, so the test cannot be performed.',
  'すべての値が同一のため、t値を計算できません。': 'All values are identical, so the t value cannot be computed.',
  'すべての値が同一のため、τを計算できません。': 'All values are identical, so τ cannot be computed.',
  'すべてのペアの差が同一のため、t値を計算できません。':
    'The differences are identical across all pairs, so the t value cannot be computed.',
  'すべてのペアの差が0のため、検定を実行できません。': 'The difference is 0 for every pair, so the test cannot be performed.',
  '一方の変数の値がすべて同一のため、相関係数を計算できません。':
    'One of the variables has identical values throughout, so the correlation coefficient cannot be computed.',
  '一方の変数の値がすべて同一のため、τを計算できません。':
    'One of the variables has identical values throughout, so τ cannot be computed.',
  'データのばらつきが小さすぎるため、検定を実行できません。': 'The variability in the data is too small to perform the test.',
  '分散が0の群があるため、F値を計算できません。': 'A group has zero variance, so the F value cannot be computed.',
  '群内のばらつきが0のため、検定を実行できません。': 'The within-group variability is 0, so the test cannot be performed.',
  '群内のばらつきが0のため、F値を計算できません。': 'The within-group variability is 0, so the F value cannot be computed.',
  '誤差のばらつきが0のため、F値を計算できません。': 'The error variability is 0, so the F value cannot be computed.',
  'セル内のばらつきが0のため、F値を計算できません。': 'The within-cell variability is 0, so the F value cannot be computed.',
  '差のばらつきが小さすぎるため、検定を実行できません。': 'The variability of the differences is too small to perform the test.',
  'すべての対象が全条件で同じ値（全て0または全て1）のため、検定を実行できません。':
    'Every subject has the same value (all 0s or all 1s) across all conditions, so the test cannot be performed.',
  'すべての対象で全条件の値が同一のため、検定を実行できません。':
    'Every subject has identical values across all conditions, so the test cannot be performed.',
  '変化したペア（非対角セル）が0のため、検定を実行できません。':
    'There are no changed pairs (off-diagonal cells), so the test cannot be performed.',
  '観測度数の合計が0です。': 'The total observed count is 0.',
  '合計が0の行または列があります。すべての行・列に1以上の度数が必要です。':
    'A row or column has a total of 0. Every row and column must have a count of at least 1.',
  '少なくとも1つのセルに1以上の度数が必要です。': 'At least one cell must have a count of 1 or more.',
  '度数には0以上の整数を入力してください。': 'Please enter a non-negative integer for each count.',
  '観測度数には0以上の整数を入力してください。': 'Please enter a non-negative integer for the observed counts.',
  '期待比率には0より大きい数値を入力してください。': 'Please enter a value greater than 0 for the expected ratios.',
  'データは0（失敗・なし）または1（成功・あり）で入力してください。':
    'Please enter each value as 0 (failure/no) or 1 (success/yes).',
  'この検定は5000件以下のデータにのみ対応しています。': 'This test only supports 5000 or fewer data points.',
  'セル数が要因の水準数と一致しません。': 'The number of cells does not match the number of factor levels.',
  'すべてのセルのデータ数は同じにしてください（釣り合い型のみ対応）。':
    'All cells must have the same number of observations (only balanced designs are supported).',
  '交互作用を検定するには各セルに2つ以上のデータが必要です。':
    'Testing the interaction requires at least 2 observations in every cell.',
  'パラメータが不正です。パラメータ指定に戻ってください。': 'The parameters are invalid. Please go back to the parameter screen.',
  '基準値μ₀が設定されていません。パラメータ指定に戻ってください。':
    'The reference value μ₀ has not been set. Please go back to the parameter screen.',
  'この検定はまだ実装されていません。': 'This test has not been implemented yet.',
  '数値でない入力があります。すべてのセルに数値を入力してください。':
    'Some input is not numeric. Please enter a number in every cell.',

  // ---- 手法名（method） ----
  '対応なし2標本t検定（スチューデントのt検定・両側）': "Independent Samples t-Test (Student's t-Test, Two-Sided)",
  '対応あり2標本t検定（両側）': 'Paired Samples t-Test (Two-Sided)',
  '一元配置分散分析（One-way ANOVA）': 'One-Way ANOVA',
  'ピアソン積率相関係数の無相関検定（両側）': 'Pearson Correlation Test (Two-Sided)',
  '1標本t検定（両側）': 'One-Sample t-Test (Two-Sided)',
  'ウェルチのt検定（等分散を仮定しない・両側）': "Welch's t-Test (Unequal Variance, Two-Sided)",
  '二元配置分散分析（繰り返しあり・釣り合い型）': 'Two-Way ANOVA (Balanced, With Replication)',
  '反復測定分散分析（一要因・被験者内）': 'Repeated Measures ANOVA (One-Way, Within-Subjects)',
  '等分散性のF検定（両側）': 'F-Test for Equality of Variance (Two-Sided)',
  'ルビーン検定（平均値中心）': "Levene's Test (Mean-Centered)",
  'シャピロ・ウィルク検定（正規性の検定）': 'Shapiro-Wilk Test (Normality Test)',
  'マン・ホイットニーU検定（両側）': 'Mann–Whitney U Test (Two-Sided)',
  'ウィルコクソン符号順位検定（両側）': 'Wilcoxon Signed-Rank Test (Two-Sided)',
  'クラスカル・ウォリス検定': 'Kruskal-Wallis Test',
  'カイ二乗独立性検定（イェーツ補正なし）': 'Chi-Square Test of Independence (No Yates Correction)',
  'フィッシャーの正確確率検定（両側）': "Fisher's Exact Test (Two-Sided)",
  'スピアマン順位相関係数の無相関検定（t近似・両側）': 'Spearman Rank Correlation Test (t-Approximation, Two-Sided)',
  '符号検定（正確二項検定・両側）': 'Sign Test (Exact Binomial, Two-Sided)',
  'フリードマン検定': 'Friedman Test',
  'カイ二乗適合度検定': 'Chi-Square Goodness-of-Fit Test',
  'マクネマー検定（正確二項検定・両側）': "McNemar's Test (Exact Binomial, Two-Sided)",
  'マクネマー検定（連続性補正付きχ²検定）': "McNemar's Test (χ² with Continuity Correction)",
  'コクランのQ検定': "Cochran's Q Test",
  'ケンドール順位相関係数（τb）の無相関検定（正規近似・両側）': "Kendall's Tau-b Correlation Test (Normal Approximation, Two-Sided)",

  // ---- statLabel（統計量の短い名前） ----
  't値': 't value',
  'F値': 'F value',
  'F値（s₁²/s₂²）': 'F value (s₁²/s₂²)',
  'F値（交互作用A×B）': 'F value (interaction A×B)',
  'χ²値': 'χ² value',
  'χ²値（連続性補正あり）': 'χ² value (with continuity correction)',
  'H値': 'H value',
  'U値': 'U value',
  'W値': 'W value',
  'W値（F統計量）': 'W value (F statistic)',
  'z値': 'z value',
  'Q値': 'Q value',
  'p値（正確確率）': 'p value (exact)',

  // ---- extraStats / effectSizes ラベル ----
  '平均値の差（群A − 群B）': 'Mean difference (Group A − Group B)',
  '標準誤差': 'Standard error',
  '群A': 'Group A',
  '群B': 'Group B',
  '変数X': 'Variable X',
  '変数Y': 'Variable Y',
  '条件A': 'Condition A',
  '条件B': 'Condition B',
  'データ': 'Data',
  '差の平均（条件A − 条件B）': 'Mean of differences (Condition A − Condition B)',
  '差の標準誤差': 'Standard error of the difference',
  '基準値 μ₀': 'Reference value μ₀',
  '平均 − 基準値': 'Mean − reference value',
  '群間平方和 (SSB)': 'Between-group sum of squares (SSB)',
  '群内平方和 (SSW)': 'Within-group sum of squares (SSW)',
  '群間平均平方 (MSB)': 'Between-group mean square (MSB)',
  '群内平均平方 (MSW)': 'Within-group mean square (MSW)',
  'η²（イータ二乗）': 'η² (eta squared)',
  'U₁（群A基準）': 'U₁ (based on Group A)',
  'U₂（群B基準）': 'U₂ (based on Group B)',
  '群Aの順位和': 'Rank sum of Group A',
  '効果量 r（|z|/√N）': 'Effect size r (|z|/√N)',
  '効果量 r（|z|/√n）': 'Effect size r (|z|/√n)',
  'W⁺（正の順位和）': 'W⁺ (sum of positive ranks)',
  'W⁻（負の順位和）': 'W⁻ (sum of negative ranks)',
  '有効ペア数（差≠0）': 'Valid pairs (difference ≠ 0)',
  '総度数 N': 'Total count N',
  '最小期待度数': 'Minimum expected count',
  '観測された表の生起確率': 'Probability of the observed table',
  'オッズ比 (ad/bc)': 'Odds ratio (ad/bc)',
  'φ係数': 'φ coefficient',
  "Cohen's w（√(χ²/N)）": "Cohen's w (√(χ²/N))",
  '協和対の数 C': 'Number of concordant pairs C',
  '不協和対の数 D': 'Number of discordant pairs D',
  'b（あり→なし に変化）': 'b (changed from yes → no)',
  'c（なし→あり に変化）': 'c (changed from no → yes)',
  '変化したペア数（b+c）': 'Number of changed pairs (b+c)',
  '総ペア数 N': 'Total number of pairs N',
  'オッズ比（b/c：変化の偏り）': 'Odds ratio (b/c: asymmetry of change)',
  'ケンドールの一致係数 W（χ²/(n(k−1))）': "Kendall's coefficient of concordance W (χ²/(n(k−1)))",
  '正の差（A > B）': 'Positive differences (A > B)',
  '負の差（A < B）': 'Negative differences (A < B)',
  '正の符号の数': 'Number of positive signs',
  '要因A平方和 (SSA)': 'Factor A sum of squares (SSA)',
  '要因B平方和 (SSB)': 'Factor B sum of squares (SSB)',
  '交互作用平方和 (SSAB)': 'Interaction sum of squares (SSAB)',
  '誤差平方和 (SSE)': 'Error sum of squares (SSE)',
  '誤差平方和': 'Error sum of squares',
  '条件平方和': 'Condition sum of squares',
  '個人差平方和': 'Subject sum of squares',
  '偏η²（要因A）': 'Partial η² (Factor A)',
  '偏η²（要因B）': 'Partial η² (Factor B)',
  '偏η²（交互作用A×B）': 'Partial η² (Interaction A×B)',
  '偏η²（条件）': 'Partial η² (condition)',
  '決定係数 r²（Yの変動のうちXで説明できる割合）':
    'Coefficient of determination r² (proportion of variance in Y explained by X)',
  '群Aの不偏分散': 'Unbiased variance of Group A',
  '群Bの不偏分散': 'Unbiased variance of Group B',
  "Cohen's d（dz：差の平均÷差のSD）": "Cohen's d (dz: mean of differences ÷ SD of differences)",
  "Cohen's d（両群の分散の平均で標準化）": "Cohen's d (standardized by the average of the two group variances)",

  // ---- anovaRows（二元配置分散分析の変動要因） ----
  '要因A': 'Factor A',
  '要因B': 'Factor B',
  '交互作用 A×B': 'Interaction A×B',

  // ---- 効果量の解釈ラベル（effectSize.ts） ----
  'ごく小さい効果': 'negligible effect',
  '小さい効果': 'small effect',
  '中程度の効果': 'medium effect',
  '大きい効果': 'large effect',
  'ごく弱い一致': 'very weak agreement',
  '弱い一致': 'weak agreement',
  '中程度の一致': 'moderate agreement',
  '強い一致': 'strong agreement',

  // ---- 相関の強さラベル（pearsonCorrelation.ts の correlationLabel） ----
  'ほとんど相関なし': 'negligible correlation',
  '弱い正の相関': 'weak positive correlation',
  '弱い負の相関': 'weak negative correlation',
  '中程度の正の相関': 'moderate positive correlation',
  '中程度の負の相関': 'moderate negative correlation',
  '強い正の相関': 'strong positive correlation',
  '強い負の相関': 'strong negative correlation',
  '非常に強い正の相関': 'very strong positive correlation',
  '非常に強い負の相関': 'very strong negative correlation',

  // ---- approxNote / notes（近似・注意事項の長文） ----
  'p値は正規近似（同順位補正・連続性補正あり）による値です。サンプル数が非常に小さい場合（各群10未満の目安）は近似精度が下がります。':
    'The p-value is based on a normal approximation (with tie and continuity corrections). Accuracy decreases for very small samples (a rough guideline is fewer than 10 per group).',
  'p値は正規近似（同順位補正・連続性補正あり）による値です。差が0のペアは除外して計算しています。有効ペア数が10未満の場合は近似精度が下がります。':
    'The p-value is based on a normal approximation (with tie and continuity corrections). Pairs with a difference of 0 are excluded. Accuracy decreases when fewer than 10 valid pairs remain.',
  'p値はχ²近似（同順位補正あり）による値です。各群のサンプル数が5未満の場合は近似精度が下がります。':
    'The p-value is based on a χ² approximation (with a tie correction). Accuracy decreases when any group has fewer than 5 observations.',
  'p値はχ²近似（同順位補正あり）による値です。対象数が10未満の場合は近似精度が下がります。':
    'The p-value is based on a χ² approximation (with a tie correction). Accuracy decreases when there are fewer than 10 subjects.',
  'p値は正規近似（同順位補正あり）による値です。サンプル数10未満の場合は近似精度が下がります。':
    'The p-value is based on a normal approximation (with a tie correction). Accuracy decreases for samples smaller than 10.',
  'p値はt分布による近似値です。サンプル数が10未満の場合は近似精度が下がります。':
    'The p-value is an approximation based on the t-distribution. Accuracy decreases for samples smaller than 10.',
  'p値はχ²近似による値です。対象数が小さい場合（目安：対象数×条件数 < 24）は近似精度が下がります。':
    'The p-value is based on a χ² approximation. Accuracy decreases when the sample is small (a rough guideline is subjects × conditions < 24).',
  '球面性の仮定を前提とした結果です（Greenhouse-Geisser等の補正は行っていません）。球面性が疑わしい場合はp値が小さめに出ることがあります。':
    'This result assumes sphericity (no correction such as Greenhouse-Geisser is applied). If sphericity is doubtful, the p-value may be smaller than it should be.',
  '差が0のペアは除外して計算しています。p値は二項分布による正確な値です。':
    'Pairs with a difference of 0 are excluded. The p-value is an exact value based on the binomial distribution.',
  '変化したペア数が25以下のため、二項分布による正確なp値を表示しています。':
    'Because the number of changed pairs is 25 or fewer, an exact p-value from the binomial distribution is shown.',
  'p値は連続性補正付きχ²近似（自由度1）による値です。':
    'The p-value is based on a χ² approximation with a continuity correction (1 degree of freedom).',
  '交互作用が有意な場合、主効果の解釈には注意が必要です（単純主効果の分析を検討してください）。':
    'If the interaction is significant, interpret the main effects with caution (consider a simple main effects analysis).',
  '各データと群平均との絶対偏差に対する分散分析です。中央値中心の変種（ブラウン＝フォーサイス検定）はより頑健とされています。':
    "This is an ANOVA performed on each observation's absolute deviation from its group mean. The median-centered variant (the Brown-Forsythe test) is considered more robust.",
  'p値が有意（小さい）な場合、「正規分布に従う」という帰無仮説が棄却されます。つまりp値が大きいほど正規分布とみなしやすいデータです。':
    'A significant (small) p-value leads to rejecting the null hypothesis that the data follow a normal distribution — in other words, the larger the p-value, the more the data can be regarded as normal.',
};

/** 数値interpolationを含むテンプレート化された文字列用の正規表現パターン */
const PATTERNS: { re: RegExp; replace: (m: RegExpMatchArray) => string }[] = [
  { re: /^群(\d+)の順位和$/, replace: (m) => `Rank sum of Group ${m[1]}` },
  { re: /^条件(\d+)の順位和$/, replace: (m) => `Rank sum of Condition ${m[1]}` },
  { re: /^カテゴリ(\d+)の期待度数$/, replace: (m) => `Expected count for Category ${m[1]}` },
  {
    re: /^条件(\d+)の成功数（1の数）$/,
    replace: (m) => `Number of successes for Condition ${m[1]} (count of 1s)`,
  },
  { re: /^群(\d+) - 群(\d+)$/, replace: (m) => `Group ${m[1]} - Group ${m[2]}` },
  { re: /^群(\d+)$/, replace: (m) => `Group ${m[1]}` },
  { re: /^条件(\d+)$/, replace: (m) => `Condition ${m[1]}` },
  {
    re: /^期待度数が5未満のセルが(\d+)個あります。χ²近似の精度が下がるため、2×2の場合はフィッシャーの正確確率検定の使用を検討してください。$/,
    replace: (m) =>
      `${m[1]} cell(s) have an expected count below 5. The χ² approximation will be less accurate; for a 2×2 table, consider using Fisher's exact test instead.`,
  },
  {
    re: /^期待度数が5未満のカテゴリが(\d+)個あります。χ²近似の精度が下がります。$/,
    replace: (m) => `${m[1]} categor${m[1] === '1' ? 'y has' : 'ies have'} an expected count below 5. The χ² approximation will be less accurate.`,
  },
];

/**
 * 統計モジュールが出力した日本語テキストを表示直前に翻訳する。
 * 完全一致の辞書 → テンプレートパターンの順に試し、どちらにも一致しなければ原文を返す。
 */
export function translateStatsText(text: string, locale: Locale): string {
  if (locale !== 'en' || !text) return text;
  if (EXACT[text]) return EXACT[text];
  for (const { re, replace } of PATTERNS) {
    const m = text.match(re);
    if (m) return replace(m);
  }
  return text;
}
