import type { Explanation, ParamConfig, TestDef } from '../types';
import type { Locale } from '../i18n/LocaleContext';

/** 検定ごとの英語版オーバーレイ（formulaはLaTeXなので言語非依存、翻訳対象外） */
interface TestTranslation {
  name: string;
  description: string;
  explanation: Omit<Explanation, 'formula'>;
  /** 翻訳が必要な入力欄の文言のみ（数値範囲などは翻訳不要なので含めない） */
  input?: Partial<
    Pick<ParamConfig, 'nLabel' | 'inputHint' | 'columnLabels' | 'matrixRowLabels' | 'matrixColLabels' | 'rowLabelPrefix'>
  >;
}

const TESTS_EN: Record<string, TestTranslation> = {
  't-test-independent': {
    name: 'Independent Samples t-Test',
    description:
      "Tests whether the means of two independent groups differ (Student's t-test).",
    input: { columnLabels: ['Group A', 'Group B'] },
    explanation: {
      overview:
        "A parametric test for whether the population means of two independent (unpaired) groups differ. This app implements Student's t-test, which assumes the two groups have equal variance.",
      purpose:
        'Use this when you want to compare the means of two numeric samples drawn from different subjects — for example, "Is there a difference in mean blood pressure between a group given a drug and a group that was not?"',
      h0: 'The population means of the two groups are equal (μ₁ = μ₂)',
      h1: 'The population means of the two groups are not equal (μ₁ ≠ μ₂)',
      assumptions: [
        'The two groups are independent of each other (the same subjects were not measured twice)',
        'Each group is a random sample from a normally distributed population',
        'The two groups have equal population variance (homogeneity of variance)',
        'The data are on an interval or ratio scale',
      ],
      formulaNote:
        '\\(\\bar{X}_1, \\bar{X}_2\\) are the sample means of each group, \\(s_1^2, s_2^2\\) are the unbiased sample variances, and \\(s_p^2\\) is the pooled variance. The degrees of freedom are \\(n_1+n_2-2\\).',
      example:
        'Compare test scores between 15 students who studied with a new textbook and 15 who used the traditional one, to judge whether the difference in mean scores could be due to chance.',
      notes:
        "If equal variance is doubtful, Welch's t-test is recommended. If normality is severely violated, consider the Mann–Whitney U test.",
    },
  },

  't-test-paired': {
    name: 'Paired Samples t-Test',
    description:
      'Tests the difference in means between two paired conditions, such as a before/after comparison on the same subjects.',
    input: { columnLabels: ['Condition A', 'Condition B'], nLabel: 'Number of pairs' },
    explanation: {
      overview:
        'A parametric test for whether the population mean differs between two conditions measured on the same subjects (paired data). It is equivalent to a one-sample t-test performed on the paired differences.',
      purpose:
        'Use this when you want to compare the mean of two paired measurements — for example, "Did a lab value change between the same patients\' pre- and post-treatment measurements?" — such as before/after or left/right comparisons.',
      h0: 'The mean difference between the two paired conditions is 0 (μd = 0)',
      h1: 'The mean difference between the two paired conditions is not 0 (μd ≠ 0)',
      assumptions: [
        'The data are paired (e.g., two measurements on the same subject)',
        'The differences within each pair are normally distributed',
        'The pairs are independent of one another',
        'The data are on an interval or ratio scale',
      ],
      formulaNote:
        '\\(\\bar{d}\\) is the mean of the paired differences, \\(s_d\\) is the unbiased standard deviation of the differences, and \\(n\\) is the number of pairs. The degrees of freedom are \\(n-1\\).',
      example:
        'Measure grip strength in 10 subjects before and after a training program to determine whether mean grip strength changed.',
      notes:
        'If the normality of the differences is severely violated, or the data are ordinal, consider the Wilcoxon signed-rank test.',
    },
  },

  'one-way-anova': {
    name: 'One-Way ANOVA',
    description:
      "Tests whether the means of three or more groups differ. If significant, follows up with Tukey's multiple comparison.",
    explanation: {
      overview:
        "A parametric test for whether the population means of three or more independent groups are all equal. If an overall significant difference is found, Tukey's method (Tukey-Kramer method) is used to test which pairs of groups differ.",
      purpose:
        'Use this when you want to compare the means of three or more groups at once — for example, "Does the mean yield differ among crops grown with three different fertilizers?" Repeating t-tests inflates the Type I error rate, so ANOVA is performed first.',
      h0: 'The population means of all groups are equal (μ₁ = μ₂ = … = μk)',
      h1: 'At least one pair of groups has a different population mean',
      assumptions: [
        'The groups are independent of each other',
        'Each group is a random sample from a normally distributed population',
        'All groups have equal population variance (homogeneity of variance)',
        'The data are on an interval or ratio scale',
      ],
      formulaNote:
        '\\(k\\) is the number of groups and \\(N\\) is the total sample size. F increases as the between-group variability grows relative to the within-group variability. The degrees of freedom are \\((k-1,\\ N-k)\\). Tukey\'s method computes a p-value for each pair of groups based on the studentized range distribution.',
      example:
        'Compare test scores of students taught by three methods (lecture, exercises, and a mix), to see whether mean scores differ by method and, if so, between which pairs.',
      notes:
        'If normality or homogeneity of variance is severely violated, consider the Kruskal-Wallis test. This app\'s post-hoc comparison is the Tukey-Kramer method, which also handles groups of unequal size.',
    },
  },

  'pearson-correlation': {
    name: "Pearson Correlation Test",
    description:
      'Tests the strength and significance of the linear association between two quantitative variables.',
    input: { columnLabels: ['Variable X', 'Variable Y'], nLabel: 'Number of data pairs' },
    explanation: {
      overview:
        'Computes the Pearson product-moment correlation coefficient r, which measures the strength of the linear association between two quantitative variables, and tests the null hypothesis that the population correlation is 0 (no correlation).',
      purpose:
        'Use this when you want to examine whether — and how strongly — two numeric variables are linearly related, for example "Are height and weight associated?" or "Are study time and test score associated?"',
      h0: 'The population correlation coefficient is 0 (ρ = 0)',
      h1: 'The population correlation coefficient is not 0 (ρ ≠ 0)',
      assumptions: [
        'Both variables are on an interval or ratio scale',
        'The two variables follow a bivariate normal distribution (at minimum, each variable is approximately normal)',
        'The relationship is linear (a curved relationship cannot be detected)',
        'There are no extreme outliers, since the coefficient is strongly affected by them',
      ],
      formulaNote:
        'The test statistic t follows a t-distribution with \\(n-2\\) degrees of freedom, where \\(n\\) is the number of data pairs.',
      example:
        'Record weekly study time and final exam scores for 20 students and test whether they show a significant linear association.',
      notes:
        "Correlation does not imply causation. For ordinal data or non-linear monotonic relationships, consider Spearman's rank correlation.",
    },
  },

  'mann-whitney-u': {
    name: 'Mann–Whitney U Test',
    description:
      'Tests whether the location (median) of two independent group distributions differs, based on ranks.',
    input: { columnLabels: ['Group A', 'Group B'] },
    explanation: {
      overview:
        'A nonparametric test that converts data from two independent groups to ranks and tests whether the location of their distributions differs. It is equivalent to the Wilcoxon rank-sum test.',
      purpose:
        'Use this when you would like to use an independent t-test but cannot assume normality, when the data are ordinal, or when you want to reduce the influence of outliers.',
      h0: 'The distributions of the two groups are equal (no shift in location)',
      h1: 'There is a shift in location between the two group distributions',
      assumptions: [
        'The two groups are independent of each other',
        'The data are at least ordinal (an order relation can be defined)',
        'The shapes of the two group distributions are broadly similar (when interpreting the result as a difference in medians)',
      ],
      formulaNote:
        '\\(R_1\\) is the rank sum of group 1. This app always computes the p-value via a normal approximation (with tie and continuity corrections), regardless of sample size: \\(z = \\dfrac{|U - n_1 n_2/2| - 0.5}{\\sigma_U}\\)',
      example:
        'Compare patient satisfaction (on a 5-point scale) between two hospital wards to see whether ratings tend to differ between wards.',
      notes:
        'The normal approximation is less accurate for very small samples (a rough guideline is fewer than 10 per group). If the shapes of the two distributions differ substantially, interpret the result as "a shift in distribution" rather than strictly "a difference in medians."',
    },
  },

  'wilcoxon-signed-rank': {
    name: 'Wilcoxon Signed-Rank Test',
    description:
      "Tests the difference between two paired conditions based on ranks (the nonparametric counterpart to the paired t-test).",
    input: { columnLabels: ['Condition A', 'Condition B'], nLabel: 'Number of pairs' },
    explanation: {
      overview:
        'A nonparametric test that ranks the magnitude of the differences between two paired conditions and tests whether the distribution of differences is symmetric around 0. It is the nonparametric counterpart to the paired t-test.',
      purpose:
        'Use this when you would like to use a paired t-test but cannot assume normality of the differences, when the data are close to ordinal, or when you want to reduce the influence of outliers.',
      h0: 'The distribution of differences between the paired conditions is symmetric about 0 (the median difference is 0)',
      h1: 'The center of the distribution of differences is shifted away from 0',
      assumptions: [
        'The data are paired',
        'The pairs are independent of one another',
        'The magnitude of the differences is meaningful (at least ordinal)',
        'The distribution of differences is roughly symmetric about its median',
      ],
      formulaNote:
        '\\(W^{+}\\) is the sum of ranks for positive differences and \\(W^{-}\\) is the sum of ranks for negative differences (pairs with a difference of 0 are excluded). This app computes the p-value via a normal approximation with tie and continuity corrections.',
      example:
        'Apply a new pain-relief method to 12 patients and test whether the change in pain score (on a 10-point scale) before and after is significant.',
      notes:
        'The normal approximation is less accurate for small samples (a rough guideline is fewer than 10 valid pairs, i.e. pairs with a nonzero difference).',
    },
  },

  'kruskal-wallis': {
    name: 'Kruskal-Wallis Test',
    description:
      'Tests whether the location of three or more group distributions differs, based on ranks (the nonparametric counterpart to ANOVA).',
    explanation: {
      overview:
        'A nonparametric test that ranks the data from three or more independent groups together and tests whether the location of the distributions differs among groups. It is the nonparametric counterpart to one-way ANOVA.',
      purpose:
        'Use this when you would like to use one-way ANOVA but cannot assume normality or homogeneity of variance, or when comparing three or more groups of ordinal data.',
      h0: 'The distributions of all groups are equal (no shift in location)',
      h1: 'At least one pair of groups shows a shift in location',
      assumptions: [
        'The groups are independent of each other',
        'The data are at least ordinal',
        'The shapes of the group distributions are broadly similar (when interpreting the result as a difference in medians)',
      ],
      formulaNote:
        '\\(R_j\\) is the rank sum of group j and \\(N\\) is the total sample size. After applying a tie correction, H approximately follows a χ² distribution with \\(k-1\\) degrees of freedom.',
      example:
        'Compare customer satisfaction (on a 5-point scale) across four stores to see whether ratings tend to differ among stores.',
      notes:
        'The χ² approximation is less accurate when any group has fewer than 5 observations. Pairwise post-hoc comparisons (such as the Steel-Dwass method) for a significant result are not implemented in this app.',
    },
  },

  'chi-square-independence': {
    name: 'Chi-Square Test of Independence',
    description:
      'Tests whether two categorical variables in a contingency table are independent (associated).',
    explanation: {
      overview:
        'For a cross-tabulation (contingency table) of two categorical variables, this test evaluates the discrepancy between the observed counts and the counts expected under independence using the χ² statistic, to determine whether the two variables are associated.',
      purpose:
        'Use this when you want to examine an association between categorical variables using count data — for example, "Is there an association between gender and product preference?" or "Is there an association between treatment and outcome (improved/unchanged/worse)?"',
      h0: 'The two categorical variables are independent (no association)',
      h1: 'The two categorical variables are not independent (there is an association)',
      assumptions: [
        'The data are counts (the number of observations in each cell)',
        'Observations are independent, and each falls into exactly one cell',
        'The expected count in every cell is reasonably large (a common guideline is 5 or more)',
      ],
      formulaNote:
        '\\(O_{ij}\\) is the observed count and \\(E_{ij}\\) is the expected count. χ² approximately follows a χ² distribution with \\((r-1)(c-1)\\) degrees of freedom. This app does not apply the Yates continuity correction.',
      example:
        'From a cross-tabulation of smoking status (2 levels) and disease status (2 levels), examine whether smoking and disease are associated.',
      notes:
        "The approximation is poor when any cell has an expected count below 5. For a 2×2 table with small counts, use Fisher's exact test instead.",
    },
  },

  'fisher-exact': {
    name: "Fisher's Exact Test",
    description:
      'Tests the association in a 2×2 contingency table using an exact p-value. Works even with small samples.',
    explanation: {
      overview:
        'For a 2×2 contingency table, this test computes directly from the hypergeometric distribution the probability of observing the given table (or one even more extreme) while holding the margins fixed. Because it uses no approximation, it gives an exact p-value even for small samples.',
      purpose:
        'Use this when you want to use the chi-square test of independence but the counts are small (some cells have an expected count below 5). It is well suited to testing an association between two categorical variables in a 2×2 table.',
      h0: 'The two categorical variables are independent (no association)',
      h1: 'The two categorical variables are not independent (there is an association)',
      assumptions: [
        'The data are counts in a 2×2 contingency table',
        'Observations are independent',
        'The result is interpreted as conditional inference with the row and column margins held fixed',
      ],
      formulaNote:
        'This is the probability of the observed table. The two-sided p-value is computed as the sum of the probabilities of all tables whose probability is no greater than this one (this app\'s convention, identical to the definition used by R\'s fisher.test).',
      example:
        'In a small trial with 8 patients on a new drug and 7 on placebo, tabulate improvement versus no improvement and test whether the improvement rate differs.',
      notes:
        'This app supports 2×2 tables only. When counts are sufficiently large, the result closely matches the chi-square test of independence.',
    },
  },

  'spearman-correlation': {
    name: "Spearman Rank Correlation Test",
    description:
      "Tests the monotonic association between two variables based on ranks (the nonparametric counterpart to Pearson's correlation).",
    input: { columnLabels: ['Variable X', 'Variable Y'], nLabel: 'Number of data pairs' },
    explanation: {
      overview:
        "Converts each of the two variables to ranks, computes the Pearson correlation of the ranks (Spearman's rank correlation coefficient ρ), and tests for no correlation. It can detect a monotonic association (as one increases, the other tends to increase or decrease) even when the relationship is not linear.",
      purpose:
        "Use this when you would like to use Pearson's correlation but cannot assume normality, the data are ordinal, you want to reduce the influence of outliers, or you want to examine a monotonic but non-linear relationship.",
      h0: 'There is no monotonic association between the two variables (population rank correlation ρ = 0)',
      h1: 'There is a monotonic association between the two variables (ρ ≠ 0)',
      assumptions: [
        'The data are paired',
        'Both variables are at least ordinal',
        'The observed pairs are independent of one another',
      ],
      formulaNote:
        '\\(d_i\\) is the rank difference for each pair (the formula on the left is the simplified version used when there are no ties; this app computes the Pearson correlation of the ranks so that ties are handled correctly). t is an approximation based on a t-distribution with \\(n-2\\) degrees of freedom.',
      example:
        'For 15 stores, examine the association between the rank of customer-service ratings and the rank of sales, to test whether stores with better service tend to have higher sales.',
      notes:
        'The t-approximation is less accurate for small samples (fewer than 10). Correlation does not imply causation.',
    },
  },

  't-test-one-sample': {
    name: 'One-Sample t-Test',
    description: 'Tests whether the mean of a single group differs from a specified reference value.',
    input: { nLabel: 'Sample size' },
    explanation: {
      overview:
        'A parametric test for whether the population mean of a single group differs from a predetermined reference value (such as a theoretical or specification value).',
      purpose:
        'Use this when you want to compare a sample mean with a known reference value — for example, "Is the average weight of this factory\'s product actually 100 g, as labeled?"',
      h0: 'The population mean equals the reference value (μ = μ₀)',
      h1: 'The population mean differs from the reference value (μ ≠ μ₀)',
      assumptions: [
        'The data are a random sample from a normally distributed population',
        'The observations are independent of one another',
        'The data are on an interval or ratio scale',
      ],
      formulaNote: 'The degrees of freedom are \\(n-1\\).',
      example:
        'Measure the weight of 20 packaged products and test whether the mean differs from the labeled weight of 100 g.',
    },
  },

  'welch-t-test': {
    name: "Welch's t-Test",
    description: 'Tests the difference in means between two groups without assuming equal variance.',
    input: { columnLabels: ['Group A', 'Group B'] },
    explanation: {
      overview:
        'A method for testing the difference between the population means of two independent groups without assuming equal population variance. The degrees of freedom are adjusted using the Welch–Satterthwaite equation.',
      purpose:
        "Use this when you would like to use an independent-samples t-test, but the two groups clearly have different variances (or very different sample sizes). It is now common practice to use Welch's test by default rather than first testing for equal variance.",
      h0: 'The population means of the two groups are equal (μ₁ = μ₂)',
      h1: 'The population means of the two groups are not equal (μ₁ ≠ μ₂)',
      assumptions: [
        'The two groups are independent of each other',
        'Each group\'s data are normally distributed',
        'The data are on an interval or ratio scale (equal variance is not required)',
      ],
      formulaNote: 'The degrees of freedom ν are obtained from the Welch–Satterthwaite approximation.',
      example: 'Compare the mean product dimension between two manufacturing lines that have noticeably different variability.',
    },
  },

  'two-way-anova': {
    name: 'Two-Way ANOVA',
    description: 'Tests the main effects of two factors and their interaction.',
    explanation: {
      overview:
        'A parametric test that simultaneously analyzes how two factors (e.g., fertilizer type × watering frequency) affect an outcome. In addition to the main effect of each factor, it can detect an interaction arising from the combination of factors.',
      purpose:
        'Use this when you want to examine, in a single analysis, the effects of two independent factors on a dependent variable, along with their combined (interaction) effect.',
      h0: 'There is no main effect of either factor / there is no interaction (tested separately for each)',
      h1: 'There is a main effect / there is an interaction',
      assumptions: [
        'Observations within each cell are independent',
        'The data in each cell are normally distributed',
        'The population variance is equal across all cells',
      ],
      formulaNote: 'An F-test is performed separately for Factor A, Factor B, and the A×B interaction.',
      example: 'Grow crops under 6 conditions (3 fertilizer types × 2 watering levels) and analyze the effect on yield.',
    },
  },

  'repeated-measures-anova': {
    name: 'Repeated Measures ANOVA',
    description: 'Tests the difference in means for data measured three or more times on the same subjects.',
    explanation: {
      overview:
        'A parametric test for whether the population mean differs among three or more conditions (or time points) measured repeatedly on the same subjects. It is an extension of the paired t-test to three or more conditions.',
      purpose:
        'Use this when you want to compare means across multiple time points or conditions measured on the same subjects — for example, "How does blood pressure change before medication, after 1 week, and after 1 month?"',
      h0: 'The population means of all conditions are equal',
      h1: 'At least one pair of conditions has a different population mean',
      assumptions: [
        'The same subjects were measured under every condition',
        'The data for each condition are normally distributed',
        'Sphericity holds (the variances of the differences between conditions are equal)',
      ],
      formulaNote:
        'Because between-subject variability is separated out from the error term, this test has greater power than a between-subjects ANOVA. When sphericity does not hold, corrections such as the Greenhouse-Geisser correction are applied.',
      example: 'Compare heart rate in 8 subjects before exercise, immediately after, and 30 minutes after.',
    },
  },

  'f-test-variance': {
    name: 'F-Test for Equality of Variance',
    description: 'Tests whether the variances of two groups are equal.',
    input: { columnLabels: ['Group A', 'Group B'] },
    explanation: {
      overview:
        'Tests whether the population variances of two independent groups are equal, using the fact that the ratio of variances follows an F-distribution.',
      purpose:
        "Use this when you want to check the equal-variance assumption required for Student's t-test, or when you are directly interested in a difference in variability between two groups.",
      h0: 'The population variances of the two groups are equal (σ₁² = σ₂²)',
      h1: 'The population variances of the two groups are not equal (σ₁² ≠ σ₂²)',
      assumptions: [
        'The two groups are independent of each other',
        "Each group's data are normally distributed (this test is sensitive to departures from normality)",
      ],
      formulaNote: 'Follows an F-distribution with \\((n_1-1,\\ n_2-1)\\) degrees of freedom.',
      example: 'Take repeated measurements of the same sample on two measuring instruments and test whether the measurement variability differs.',
      notes:
        "Because this test is very sensitive to departures from normality, the more robust Levene's test is often preferred.",
    },
  },

  'levene-test': {
    name: "Levene's Test",
    description: 'Robustly tests the homogeneity of variance across two or more groups.',
    explanation: {
      overview:
        'Tests whether the population variances of two or more groups are equal. It performs an ANOVA on the absolute deviations of each observation from its group\'s center (mean or median), which makes it robust to departures from normality.',
      purpose:
        'Use this to check the equal-variance assumption required for t-tests and ANOVA, even when the data\'s normality is questionable.',
      h0: 'The population variances of all groups are equal',
      h1: 'At least one pair of groups has a different population variance',
      assumptions: ['The groups are independent of each other', 'The data are on an interval or ratio scale'],
      formulaNote:
        "The variant that uses the median as the center is known as the Brown-Forsythe test and is even more robust.",
      example: 'Check whether the variability of three groups is equal, as a preliminary check before running an ANOVA.',
    },
  },

  'shapiro-wilk': {
    name: 'Shapiro-Wilk Test',
    description: 'Tests whether data follow a normal distribution.',
    input: { nLabel: 'Sample size' },
    explanation: {
      overview:
        'A test of normality that examines whether data were drawn from a normally distributed population. It is known to have good power for small to moderate sample sizes.',
      purpose:
        'Use this to check the normality assumption required by parametric tests such as the t-test and ANOVA.',
      h0: 'The data are a sample from a normally distributed population',
      h1: 'The data do not follow a normal distribution',
      assumptions: ['The observations are independent of one another', 'The data are continuous'],
      formulaNote:
        '\\(x_{(i)}\\) is the data sorted in ascending order, and the coefficients \\(a_i\\) are determined from the order statistics of the normal distribution. A W value close to 1 indicates the data are close to normal.',
      example: 'Before running a t-test, check whether 30 measurements in each group can be regarded as normally distributed.',
      notes:
        'With large samples, even a small departure from normality can become statistically significant, so interpret the result with this in mind.',
    },
  },

  'sign-test': {
    name: 'Sign Test',
    description:
      'Tests the difference between two paired conditions using only the direction (sign) of the difference.',
    input: { columnLabels: ['Condition A', 'Condition B'], nLabel: 'Number of pairs' },
    explanation: {
      overview:
        'The simplest nonparametric test for the difference between two paired conditions: it uses only which value is larger (the sign of the difference), not its magnitude. It is based on the binomial distribution.',
      purpose:
        'Use this when the magnitude of the difference is not meaningful (only the order matters), or when you do not want to assume the symmetry required by the Wilcoxon signed-rank test.',
      h0: 'The probability of a positive difference equals the probability of a negative difference (p = 0.5)',
      h1: 'The probability of a positive difference does not equal the probability of a negative difference',
      assumptions: ['The data are paired', 'The pairs are independent of one another'],
      formulaNote:
        'This relies on the fact that, among the n pairs with a nonzero difference, the number of positive differences follows a binomial distribution B(n, 0.5).',
      example: 'Ask 10 judges which of two products they prefer, and test whether preference is skewed toward one product.',
      notes: 'Because it uses only the sign of the difference, its statistical power is relatively low.',
    },
  },

  'friedman-test': {
    name: 'Friedman Test',
    description: 'Compares three or more repeated-measures conditions on the same subjects using ranks.',
    explanation: {
      overview:
        'For data in which the same subjects are measured under three or more conditions, this test ranks the conditions within each subject and tests whether the ranking tendency differs among conditions. It is the nonparametric counterpart to repeated-measures ANOVA.',
      purpose:
        'Use this when you would like to use repeated-measures ANOVA but cannot assume normality, or when analyzing repeated-measures data that are ordinal.',
      h0: 'The distributions of all conditions are equal',
      h1: 'At least one pair of conditions shows a shift in distribution location',
      assumptions: [
        'The same subjects were measured under every condition',
        'The subjects are independent of one another',
        'The data are at least ordinal',
      ],
      formulaNote:
        '\\(n\\) is the number of subjects, \\(k\\) is the number of conditions, and \\(R_j\\) is the rank sum for condition j. It approximately follows a χ² distribution with \\(k-1\\) degrees of freedom.',
      example: '10 subjects type on three different keyboards; test whether ease-of-typing ratings differ.',
    },
  },

  'chi-square-goodness': {
    name: 'Chi-Square Goodness-of-Fit Test',
    description: 'Tests whether observed counts fit a theoretical distribution (expected ratios).',
    input: { rowLabelPrefix: 'Category' },
    explanation: {
      overview:
        'Tests whether the observed counts of a single categorical variable fit a theoretically expected ratio (for example, the 9:3:3:1 ratio from Mendelian genetics).',
      purpose:
        'Use this to examine a discrepancy between an observed frequency distribution and a theoretical ratio — for example, whether a die is biased, whether the number of visitors is even across days of the week, or whether an observed segregation ratio matches genetic theory.',
      h0: 'The observed counts follow the expected ratio',
      h1: 'The observed counts do not follow the expected ratio',
      assumptions: [
        'The data are counts',
        'Observations are independent, and each falls into exactly one category',
        'The expected count for every category is reasonably large (a common guideline is 5 or more)',
      ],
      formulaNote: 'The degrees of freedom are \\(k-1\\), where k is the number of categories.',
      example: 'Roll a die 120 times and test whether the observed counts for each face fit the expected count of 20 each.',
    },
  },

  'mcnemar-test': {
    name: "McNemar's Test",
    description: 'Tests the change in paired binary data (a difference in proportions before and after).',
    input: {
      matrixRowLabels: ['1st: Yes', '1st: No'],
      matrixColLabels: ['2nd: Yes', '2nd: No'],
    },
    explanation: {
      overview:
        'For two binary measurements on the same subjects (e.g., pass/fail before and after an intervention), this test examines whether there is asymmetry in the direction of change. It uses only the off-diagonal cells (the pairs that changed) of the 2×2 table.',
      purpose:
        'Use this when you want to test a change in a paired proportion — for example, "Did support for Product A change before and after a campaign?" Because the data are paired, the chi-square test of independence cannot be used.',
      h0: 'There is no asymmetry in the direction of change (b and c are expected to be equal)',
      h1: 'There is asymmetry in the direction of change',
      assumptions: ['The data are paired binary observations', 'The pairs are independent of one another'],
      formulaNote:
        '\\(b\\) and \\(c\\) are the counts in the two off-diagonal cells where change occurred (with a continuity correction). It follows a χ² distribution with 1 degree of freedom. When b+c is small, an exact binomial method is used instead.',
      example: 'Survey agree/disagree before and after a debate and test whether opinion change is directional.',
    },
  },

  'cochran-q': {
    name: "Cochran's Q Test",
    description: 'Tests the difference in proportions among three or more paired binary conditions.',
    input: {
      inputHint: 'Enter 1 (success/yes) or 0 (failure/no) in each cell.',
    },
    explanation: {
      overview:
        'For binary measurements (e.g., success/failure) taken under three or more conditions on the same subjects, this test examines whether the success proportion differs among conditions. It extends McNemar\'s test to three or more conditions.',
      purpose:
        'Use this when you want to compare paired binary data across three or more conditions — for example, "Does the correct-answer rate differ among three types of test questions, within the same group of test-takers?"',
      h0: 'The success proportion is equal across all conditions',
      h1: 'At least one pair of conditions has a different success proportion',
      assumptions: [
        'The same subjects were measured under every condition',
        'The data are binary (0/1)',
        'The subjects are independent of one another',
      ],
      formulaNote:
        '\\(C_j\\) is the total for condition j, \\(R_i\\) is the total for subject i, and \\(N\\) is the grand total. It approximately follows a χ² distribution with \\(k-1\\) degrees of freedom.',
      example: 'Record whether each of 12 subjects succeeded at three tasks, and test whether the success rate differs among tasks.',
    },
  },

  'kendall-tau': {
    name: "Kendall's Tau Test",
    description: 'Tests the rank agreement (τ) between two variables and its significance.',
    input: { columnLabels: ['Variable X', 'Variable Y'], nLabel: 'Number of data pairs' },
    explanation: {
      overview:
        'For every possible pair of observations across two variables, this computes the strength of association τ from the difference between concordant pairs (where the ranking agrees) and discordant pairs (where it is reversed), and tests for no correlation.',
      purpose:
        "Use this, like Spearman's rank correlation, when you want to examine a monotonic association — especially with small samples or when there are many tied values.",
      h0: 'There is no association between the two variables (τ = 0)',
      h1: 'There is an association between the two variables (τ ≠ 0)',
      assumptions: [
        'The data are paired',
        'Both variables are at least ordinal',
        'The observed pairs are independent of one another',
      ],
      formulaNote:
        '\\(C\\) is the number of concordant pairs and \\(D\\) is the number of discordant pairs. When there are ties, τb is used. For moderate to large samples, the test uses a normal approximation.',
      example: 'Examine the agreement between the rankings that two judges assigned to 10 entries.',
    },
  },
};

/** テスト定義に英語版オーバーレイを適用して返す（'ja'の場合はそのまま返す） */
export function getLocalizedTest(def: TestDef, locale: Locale): TestDef {
  if (locale !== 'en') return def;
  const tr = TESTS_EN[def.id];
  if (!tr) return def;
  return {
    ...def,
    name: tr.name,
    description: tr.description,
    explanation: { ...def.explanation, ...tr.explanation },
    input: def.input && tr.input ? { ...def.input, ...tr.input } : def.input,
  };
}
