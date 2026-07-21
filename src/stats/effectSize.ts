/**
 * 効果量の解釈の目安（Cohen, 1988 に基づく慣例値）。
 * あくまで目安であり、分野によって基準は異なる。
 */

/** Cohen's d 系（d, dz）: 0.2 / 0.5 / 0.8 */
export function interpretD(d: number): string {
  const abs = Math.abs(d);
  if (abs < 0.2) return 'ごく小さい効果';
  if (abs < 0.5) return '小さい効果';
  if (abs < 0.8) return '中程度の効果';
  return '大きい効果';
}

/** η²・偏η² 系: 0.01 / 0.06 / 0.14 */
export function interpretEta(eta: number): string {
  if (eta < 0.01) return 'ごく小さい効果';
  if (eta < 0.06) return '小さい効果';
  if (eta < 0.14) return '中程度の効果';
  return '大きい効果';
}

/** r 系（r = z/√N, Cramér's V, Cohen's w, φ）: 0.1 / 0.3 / 0.5 */
export function interpretR(r: number): string {
  const abs = Math.abs(r);
  if (abs < 0.1) return 'ごく小さい効果';
  if (abs < 0.3) return '小さい効果';
  if (abs < 0.5) return '中程度の効果';
  return '大きい効果';
}

/** ケンドールの一致係数 W: 0.1 / 0.3 / 0.5 */
export function interpretW(w: number): string {
  if (w < 0.1) return 'ごく弱い一致';
  if (w < 0.3) return '弱い一致';
  if (w < 0.5) return '中程度の一致';
  return '強い一致';
}
