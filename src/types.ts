/** 検定のカテゴリ */
export type Category = 'parametric' | 'nonparametric';

/**
 * データ入力の形式
 * - twoGroups   : 2群（サンプル数は群ごとに指定）
 * - paired      : 対応のある2列（ペア数を指定、両列同じ長さ）
 * - multiGroups : 複数群（群数と各群のサンプル数を指定）
 * - matrix      : 分割表（行数×列数の度数）
 * - fisher      : 2×2分割表固定（パラメータ画面をスキップ）
 * - oneGroup    : 1群（サンプル数を指定。基準値が必要な検定は needsMu0）
 * - conditions  : 条件×対象者（条件数と対象者数を指定、全列同じ長さ）
 * - twoWay      : 二元配置（要因A水準数×要因B水準数×各セル繰り返し数）
 * - goodness    : 適合度検定用（カテゴリ数×2列固定：観測度数・期待比率）
 */
export type InputKind =
  | 'twoGroups'
  | 'paired'
  | 'multiGroups'
  | 'matrix'
  | 'fisher'
  | 'oneGroup'
  | 'conditions'
  | 'twoWay'
  | 'goodness';

/** 画面B（パラメータ指定）の設定 */
export interface ParamConfig {
  kind: InputKind;
  /** 各群・ペア数の最小値 */
  minN: number;
  /** 各群・ペア数の最大値 */
  maxN: number;
  /** multiGroups / conditions の群数（条件数）、twoWay の水準数の範囲 */
  minGroups?: number;
  maxGroups?: number;
  /** matrix / goodness のときの行数・列数の範囲 */
  minDim?: number;
  maxDim?: number;
  /** paired / twoGroups の列ラベル */
  columnLabels?: [string, string];
  /** ペア数・サンプル数入力欄のラベル */
  nLabel?: string;
  /** oneGroup で基準値μ₀の入力が必要か（1標本t検定） */
  needsMu0?: boolean;
  /** 分割表の行ラベル（固定2×2で意味を持たせたい場合。マクネマー検定など） */
  matrixRowLabels?: string[];
  /** 分割表の列ラベル */
  matrixColLabels?: string[];
  /** 行ラベルの接頭辞（例：「カテゴリ」→ カテゴリ1, カテゴリ2, …） */
  rowLabelPrefix?: string;
  /** 画面Cに表示する入力ヒント（デフォルト文言を上書きする） */
  inputHint?: string;
}

/** 個別説明ページ（画面F）の内容 */
export interface Explanation {
  /** 概要（どんな検定か） */
  overview: string;
  /** どんなときに使うか */
  purpose: string;
  /** 帰無仮説・対立仮説 */
  h0: string;
  h1: string;
  /** 前提条件 */
  assumptions: string[];
  /** 統計量の式（LaTeX、display形式） */
  formula: string;
  /** 式の補足説明 */
  formulaNote?: string;
  /** 使用例 */
  example: string;
  /** 補足・注意点 */
  notes?: string;
}

/** 検定の定義（src/data/tests.ts で全23種を管理） */
export interface TestDef {
  id: string;
  name: string;
  category: Category;
  /** 1: MVPで実装済み / 2: 準備中 */
  phase: 1 | 2;
  /** 画面Aのカードに表示する短い説明 */
  description: string;
  /** 画面Bをスキップするか（フィッシャーの正確確率検定） */
  skipParamScreen?: boolean;
  /** 入力形式（phase 1 のみ） */
  input?: ParamConfig;
  explanation: Explanation;
}

/** パラメータ設定値（画面Bで確定） */
export type ParamsState =
  // twoGroups / paired / multiGroups / oneGroup / conditions（mu0は1標本t検定のみ）
  | { kind: 'groups'; sizes: number[]; mu0?: number }
  // matrix / fisher / goodness
  | { kind: 'matrix'; rows: number; cols: number }
  // twoWay: 要因A水準数 a × 要因B水準数 b、各セル n 回繰り返し
  | { kind: 'twoWay'; a: number; b: number; n: number };

/** 各群のサマリー統計 */
export interface GroupSummary {
  label: string;
  n: number;
  mean: number;
  median: number;
  /** n が 1 のときは null */
  sd: number | null;
}

/** Tukey多重比較の1行 */
export interface TukeyRow {
  pair: string;
  diff: number;
  q: number;
  p: number;
}

/** 計算結果（画面Dで表示） */
export interface TestResult {
  testId: string;
  /** 手法名（例：「対応なし2標本t検定（両側）」） */
  method: string;
  /** 統計量のラベル（例：「t値」） */
  statLabel: string;
  statValue: number;
  /** 自由度（表示用文字列。例："18" や "2, 27"） */
  df?: string;
  pValue: number;
  /** p値が近似計算であることの注記 */
  approxNote?: string;
  /** ANOVAのときのTukey多重比較結果 */
  tukey?: TukeyRow[];
  /** 二元配置分散分析のときの分散分析表（要因ごとのF・p） */
  anovaRows?: { source: string; df: string; f: number; p: number }[];
  /** 相関検定のときの相関係数と解釈 */
  correlation?: { r: number; label: string };
  /** 効果量（Cohen's d・η²・Cramér's V など） */
  effectSizes?: { label: string; value: number; interpretation?: string }[];
  /** 数値データ検定のときの群別サマリー */
  summaries?: GroupSummary[];
  /** その他の補足統計量（期待度数の最小値など） */
  extraStats?: { label: string; value: string }[];
  /** 警告（期待度数が5未満のセルがある等） */
  warnings?: string[];
  /**
   * 入力データの数値配列（グラフ描画用）。
   * 群形式: rawData[群index][サンプルindex] / 分割表形式: rawData[行index][列index]
   */
  rawData?: number[][];
}
