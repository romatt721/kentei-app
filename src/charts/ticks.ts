/** 目盛りが多すぎて描画が破綻しないための上限（刻み幅が細かすぎる場合は自動計算にフォールバックする） */
const MAX_TICKS = 60;

/** 数値の小数桁数を返す（例: 0.25 → 2, 1 → 0）。ユーザーが入力した刻み幅から表示桁数を決めるために使う */
function decimalPlaces(step: number): number {
  if (!Number.isFinite(step)) return 1;
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

/**
 * y軸の目盛り位置を計算する。
 * - step指定時：0を基準にstepの倍数の位置に目盛りを打つ（例: step=0.5なら…,-0.5,0,0.5,1,…）
 * - 未指定時：範囲を5等分する（従来の自動目盛り）
 * - stepが細かすぎて目盛り数がMAX_TICKSを超える場合は自動計算にフォールバックする
 */
export function computeTicks(min: number, max: number, step?: number): number[] {
  if (step && step > 0) {
    const firstIndex = Math.ceil(min / step - 1e-9);
    const lastIndex = Math.floor(max / step + 1e-9);
    const count = lastIndex - firstIndex + 1;
    if (count >= 2 && count <= MAX_TICKS) {
      const ticks: number[] = [];
      for (let i = firstIndex; i <= lastIndex; i++) ticks.push(i * step);
      return ticks;
    }
  }
  return Array.from({ length: 6 }, (_, i) => min + ((max - min) * i) / 5);
}

/** 目盛りの表示用文字列を整形する（刻み幅の桁数に合わせる。未指定時は小数第1位固定） */
export function formatTick(v: number, step?: number): string {
  if (step && step > 0) return v.toFixed(decimalPlaces(step));
  return v.toFixed(1);
}
