/**
 * ステューデント化された範囲分布（studentized range distribution）のCDF。
 * jStat には含まれないため、数値積分で実装する。
 *
 * P(Q ≤ q | k, ν) = ∫₀^∞ f_ν(u) · P∞(q·u, k) du
 *   P∞(q, k) = k ∫ φ(z) [Φ(z) − Φ(z−q)]^(k−1) dz
 *   f_ν(u)   = u = √(χ²_ν/ν) の密度
 */

/** 標準正規CDF（誤差関数の有理近似、精度 ~1e-7） */
function normCdf(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;
  const x = Math.abs(z) / Math.SQRT2;
  // Abramowitz & Stegun 7.1.26
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  const erf = z >= 0 ? y : -y;
  return 0.5 * (1 + erf);
}

/** 標準正規PDF */
function normPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

/** log Γ(x)（Lanczos近似） */
function lgamma(x: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return (
      Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x)
    );
  }
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) {
    a += c[i] / (x + i);
  }
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** 自由度∞のときのCDF: k ∫ φ(z) [Φ(z) − Φ(z−q)]^(k−1) dz */
function ptukeyInf(q: number, k: number): number {
  const lo = -8;
  const hi = 8;
  const n = 256; // Simpson則（偶数分割）
  const h = (hi - lo) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const z = lo + i * h;
    const f = normPdf(z) * Math.pow(normCdf(z) - normCdf(z - q), k - 1);
    const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    sum += w * f;
  }
  const p = k * (h / 3) * sum;
  return Math.min(1, Math.max(0, p));
}

/**
 * ステューデント化された範囲分布のCDF P(Q ≤ q)
 * @param q 統計量
 * @param k 群数
 * @param df 誤差自由度
 */
export function ptukey(q: number, k: number, df: number): number {
  if (q <= 0) return 0;
  if (df > 2000) return ptukeyInf(q, k);

  // u = √(χ²_df / df) の密度:
  //   f(u) = 2 (df/2)^(df/2) / Γ(df/2) · u^(df−1) · e^(−df·u²/2)
  const halfDf = df / 2;
  const logConst = Math.log(2) + halfDf * Math.log(halfDf) - lgamma(halfDf);

  // 密度は u≈1 に集中する（分散 ≈ 1/(2df)）。小さいdfでも十分な範囲をとる
  const spread = 8 / Math.sqrt(df);
  const lo = Math.max(1e-8, 1 - spread);
  const hi = 1 + Math.max(spread, 4 / Math.sqrt(df));
  const n = 128; // Simpson則
  const h = (hi - lo) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const u = lo + i * h;
    const logF = logConst + (df - 1) * Math.log(u) - (df * u * u) / 2;
    const f = Math.exp(logF) * ptukeyInf(q * u, k);
    const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    sum += w * f;
  }
  const p = (h / 3) * sum;
  return Math.min(1, Math.max(0, p));
}
