/**
 * 検定選択ガイド（ウィザード）の質問ツリー。
 * 各ノードは質問と選択肢を持ち、選択肢の next は次の質問ノードのid、
 * または `RESULT:<testId>` で終端（おすすめの検定）を表す。
 * 全23検定がちょうど1つ以上の経路から到達できるように設計している。
 */
export interface GuideOption {
  label: string;
  next: string;
}

export interface GuideNode {
  id: string;
  question: string;
  options: GuideOption[];
}

export const GUIDE_START = 'root';

export const GUIDE_NODES: Record<string, GuideNode> = {
  root: {
    id: 'root',
    question: '何を調べたいですか？',
    options: [
      { label: '複数グループの平均・中央値などの代表値を比較したい', next: 'compareGoal' },
      { label: '1つのグループの平均を基準値と比較したい', next: 'RESULT:t-test-one-sample' },
      { label: '2つの変数の関連・相関を調べたい', next: 'corrGoal' },
      { label: 'カテゴリデータ（度数・比率）を分析したい', next: 'categoricalGoal' },
      { label: 'データが正規分布に従うか確認したい', next: 'RESULT:shapiro-wilk' },
      { label: '複数グループの分散（ばらつき）が等しいか確認したい', next: 'varianceGoal' },
    ],
  },

  compareGoal: {
    id: 'compareGoal',
    question: '調べたい要因（グループ分けの軸）はいくつですか？',
    options: [
      { label: '1つ（例：投薬の有無）', next: 'factorCountOne' },
      { label: '2つ（例：投薬の有無 × 性別）', next: 'RESULT:two-way-anova' },
    ],
  },

  factorCountOne: {
    id: 'factorCountOne',
    question: '比較するグループ（条件）はいくつですか？',
    options: [
      { label: '2つ', next: 'twoGroupPaired' },
      { label: '3つ以上', next: 'multiGroupPaired' },
    ],
  },

  twoGroupPaired: {
    id: 'twoGroupPaired',
    question: '同じ対象を2回測定するなど、データに対応（ペア）はありますか？',
    options: [
      { label: '対応がある（同じ対象を2条件で測定）', next: 'pairedDataType' },
      { label: '対応がない（別々の対象2グループ）', next: 'indepDataType' },
    ],
  },

  pairedDataType: {
    id: 'pairedDataType',
    question: '差の大きさに意味があり、データは正規分布に近いですか？',
    options: [
      { label: 'はい（間隔・比率尺度で正規分布に近い）', next: 'RESULT:t-test-paired' },
      {
        label: 'いいえ（順序尺度・非正規だが、差の大きさに意味はある）',
        next: 'RESULT:wilcoxon-signed-rank',
      },
      { label: '増えた／減ったという方向だけに関心がある', next: 'RESULT:sign-test' },
    ],
  },

  indepDataType: {
    id: 'indepDataType',
    question: '2群のデータは正規分布に近く、分散（ばらつき）は等しいと言えますか？',
    options: [
      { label: 'はい（正規分布に近く、分散も等しい）', next: 'RESULT:t-test-independent' },
      {
        label: '正規分布には近いが、分散は異なるかもしれない',
        next: 'RESULT:welch-t-test',
      },
      { label: '正規性が怪しい、または順序尺度のデータ', next: 'RESULT:mann-whitney-u' },
    ],
  },

  multiGroupPaired: {
    id: 'multiGroupPaired',
    question: '同じ対象を繰り返し測定していますか（対応あり）？',
    options: [
      { label: 'はい（同じ対象を全条件で測定）', next: 'repeatedDataType' },
      { label: 'いいえ（独立した別々のグループ）', next: 'indepMultiDataType' },
    ],
  },

  repeatedDataType: {
    id: 'repeatedDataType',
    question: 'データの種類は？',
    options: [
      { label: '数値データで正規分布に近い', next: 'RESULT:repeated-measures-anova' },
      { label: '順序尺度、または正規性が怪しい', next: 'RESULT:friedman-test' },
      { label: '成功／失敗などの2値データ', next: 'RESULT:cochran-q' },
    ],
  },

  indepMultiDataType: {
    id: 'indepMultiDataType',
    question: '各グループのデータは正規分布に近く、分散は等しいと言えますか？',
    options: [
      { label: 'はい', next: 'RESULT:one-way-anova' },
      { label: 'いいえ（順序尺度、または正規性が怪しい）', next: 'RESULT:kruskal-wallis' },
    ],
  },

  varianceGoal: {
    id: 'varianceGoal',
    question: '比較するグループはいくつですか？',
    options: [
      { label: '2つ', next: 'RESULT:f-test-variance' },
      { label: '3つ以上', next: 'RESULT:levene-test' },
    ],
  },

  corrGoal: {
    id: 'corrGoal',
    question: '2つの変数はどちらも数値（間隔・比率尺度）で、直線的な関係が想定されますか？',
    options: [
      { label: 'はい、正規分布にも近い', next: 'RESULT:pearson-correlation' },
      {
        label: 'いいえ（順序尺度、非正規、または外れ値がある）',
        next: 'corrNonParam',
      },
    ],
  },

  corrNonParam: {
    id: 'corrNonParam',
    question: 'サンプル数が少ない（目安10未満）、または同じ値（同順位）が多いですか？',
    options: [
      { label: 'はい', next: 'RESULT:kendall-tau' },
      { label: 'いいえ', next: 'RESULT:spearman-correlation' },
    ],
  },

  categoricalGoal: {
    id: 'categoricalGoal',
    question: 'データの形式は？',
    options: [
      {
        label: '独立した2グループ間の2×2カテゴリ表で関連を調べたい',
        next: 'fisherOrChi2',
      },
      {
        label: 'もっと大きな分割表（3×3など）で独立した群の関連を調べたい',
        next: 'RESULT:chi-square-independence',
      },
      {
        label: '同じ対象の「前後」など、対応のある2×2カテゴリの変化を調べたい',
        next: 'RESULT:mcnemar-test',
      },
      {
        label: '観測された度数が理論上の比率どおりかを調べたい',
        next: 'RESULT:chi-square-goodness',
      },
    ],
  },

  fisherOrChi2: {
    id: 'fisherOrChi2',
    question: 'いずれかのセルの期待度数が5未満になりそうですか？（サンプル数が少ない場合など）',
    options: [
      { label: 'はい（期待度数が小さい・小標本）', next: 'RESULT:fisher-exact' },
      { label: 'いいえ（十分な標本数がある）', next: 'RESULT:chi-square-independence' },
    ],
  },
};

/** next文字列がRESULT指定であれば検定idを返す */
export function parseResult(next: string): string | null {
  return next.startsWith('RESULT:') ? next.slice('RESULT:'.length) : null;
}
