import type { Locale } from '../i18n/LocaleContext';
import { GUIDE_NODES } from './guideTree';
import type { GuideNode } from './guideTree';

/**
 * 英語版オーバーレイ。optionsは元のGUIDE_NODESと同じ順序の配列（位置で対応させる）。
 * next（遷移先）は翻訳不要なので元のGUIDE_NODESから引き継ぐ。
 */
const GUIDE_NODES_EN: Record<string, { question: string; options: string[] }> = {
  root: {
    question: 'What would you like to investigate?',
    options: [
      'Compare a measure of center (mean/median) across multiple groups',
      'Compare the mean of a single group to a reference value',
      'Examine the association/correlation between two variables',
      'Analyze categorical data (counts/proportions)',
      'Check whether the data follow a normal distribution',
      'Check whether the variance (spread) is equal across multiple groups',
    ],
  },
  compareGoal: {
    question: 'How many factors (grouping variables) do you want to examine?',
    options: ['1 (e.g., drug vs. no drug)', '2 (e.g., drug vs. no drug × sex)'],
  },
  factorCountOne: {
    question: 'How many groups (conditions) are you comparing?',
    options: ['2', '3 or more'],
  },
  twoGroupPaired: {
    question: 'Is the data paired — for example, the same subjects measured twice?',
    options: [
      'Paired (the same subjects measured under 2 conditions)',
      'Not paired (2 separate groups of subjects)',
    ],
  },
  pairedDataType: {
    question: 'Does the size of the difference matter, and is the data close to normally distributed?',
    options: [
      'Yes (interval/ratio scale, close to normal)',
      'No (ordinal or non-normal, but the size of the difference still matters)',
      'I only care about the direction — increased or decreased',
    ],
  },
  indepDataType: {
    question: 'Is the data in both groups close to normally distributed, with equal variance?',
    options: [
      'Yes (close to normal, and variances are equal)',
      'Close to normal, but the variances might differ',
      'Normality is doubtful, or the data are ordinal',
    ],
  },
  multiGroupPaired: {
    question: 'Are the same subjects measured repeatedly (paired/within-subjects)?',
    options: [
      'Yes (the same subjects were measured under every condition)',
      'No (separate, independent groups)',
    ],
  },
  repeatedDataType: {
    question: 'What kind of data is it?',
    options: [
      'Numeric data, close to normally distributed',
      'Ordinal, or normality is doubtful',
      'Binary data such as success/failure',
    ],
  },
  indepMultiDataType: {
    question: 'Is the data in each group close to normally distributed, with equal variance?',
    options: ['Yes', 'No (ordinal, or normality is doubtful)'],
  },
  varianceGoal: {
    question: 'How many groups are you comparing?',
    options: ['2', '3 or more'],
  },
  corrGoal: {
    question: 'Are both variables numeric (interval/ratio scale) with an expected linear relationship?',
    options: [
      'Yes, and both are close to normally distributed',
      'No (ordinal, non-normal, or there are outliers)',
    ],
  },
  corrNonParam: {
    question: 'Is the sample size small (roughly under 10), or are there many tied values?',
    options: ['Yes', 'No'],
  },
  categoricalGoal: {
    question: 'What form does the data take?',
    options: [
      'A 2×2 category table between two independent groups',
      'A larger contingency table (e.g. 3×3) for independent groups',
      'A paired 2×2 category change, such as the same subjects "before vs. after"',
      'Whether observed counts match a theoretical ratio',
    ],
  },
  fisherOrChi2: {
    question: 'Is any cell likely to have an expected count below 5 (e.g., due to a small sample)?',
    options: [
      'Yes (small expected counts / small sample)',
      'No (the sample is large enough)',
    ],
  },
};

/** ロケールに応じて質問ノードを返す。英語版が未定義の場合は日本語版にフォールバックする */
export function getLocalizedNode(nodeId: string, locale: Locale): GuideNode {
  const base = GUIDE_NODES[nodeId];
  if (locale !== 'en') return base;
  const tr = GUIDE_NODES_EN[nodeId];
  if (!tr) return base;
  return {
    id: base.id,
    question: tr.question,
    options: base.options.map((opt, i) => ({
      label: tr.options[i] ?? opt.label,
      next: opt.next,
    })),
  };
}
