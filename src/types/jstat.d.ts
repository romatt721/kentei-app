declare module 'jstat' {
  interface JStatStatic {
    normal: {
      cdf(x: number, mean: number, std: number): number;
    };
    studentt: {
      cdf(x: number, dof: number): number;
    };
    centralF: {
      cdf(x: number, df1: number, df2: number): number;
    };
    chisquare: {
      cdf(x: number, dof: number): number;
    };
    /** 超幾何分布: pdf(k, N, m, n) — 母集団N・成功m・抽出n のとき成功k個の確率 */
    hypgeom: {
      pdf(k: number, N: number, m: number, n: number): number;
      cdf(k: number, N: number, m: number, n: number): number;
    };
    gammaln(x: number): number;
  }
  export const jStat: JStatStatic;
  export default jStat;
}
