/** UI strings (English). Keys are grouped by page/component; must mirror ui.ja.ts exactly. */
export const UI_EN: Record<string, string> = {
  // ===== Common =====
  'common.back': 'Back',
  'common.next': 'Next',
  'common.calculate': 'Calculate',
  'common.restart': 'Start Over',
  'common.auto': 'Auto',

  // ===== Header =====
  'header.appName': 'Significance Test',
  'header.selectTest': 'Choose a Test',
  'header.explainList': 'Test List & Guide',
  'header.guide': 'Test Wizard',
  'header.langButtonEn': 'English',
  'header.langButtonJa': '日本語',
  'header.navLabel': 'Main navigation',
  'footer.navLabel': 'Footer navigation',

  // ===== Footer =====
  'footer.privacy': 'All calculations run entirely in your browser. No data is ever sent to a server.',
  'footer.credits': 'Open Source Licenses',
  'footer.faq': 'FAQ',
  'footer.verification': 'How Accuracy Is Verified',
  'footer.contact': 'Contact',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.termsOfUse': 'Terms of Use',
  'footer.copyright': '© 2026 Significance Test',

  // ===== Disclaimer =====
  'disclaimer.title': 'Disclaimer',
  'disclaimer.body':
    'The results produced by this app are provided for learning and reference purposes only, and their accuracy and completeness are not guaranteed. For research publications, academic papers, medical decision-making, or any other important use, please verify results with a qualified expert and dedicated statistical software (such as R or SPSS). The developer accepts no liability for any damages arising from the use of this app.',

  // ===== Stepper =====
  'stepper.aria': 'Progress',
  'stepper.step1': 'Select Test',
  'stepper.step2': 'Set Parameters',
  'stepper.step3': 'Enter Data',
  'stepper.step4': 'Result',

  // ===== Screen A: Test selector =====
  'testSelector.title': 'Choose a Statistical Test',
  'testSelector.subtitlePrefix':
    'Select a test, then enter parameters and data to see the p-value and conclusion. If you are not sure which test to use, see the ',
  'testSelector.subtitleLink': 'test list & guide',
  'testSelector.subtitleSuffix': ' page.',
  'testSelector.guideLink': '🧭 Not sure which test to use? Try the wizard',
  'testSelector.tabsAria': 'Category',
  'testSelector.tabAll': 'All',
  'testSelector.tabParametric': 'Parametric',
  'testSelector.tabNonparametric': 'Nonparametric',
  'testSelector.useTest': 'Use this test',
  'testSelector.comingSoon': 'Coming soon',

  // ===== Screen B: Parameters =====
  'params.subtitle': 'Specify the shape of your data. The input boxes will be generated on the next screen.',
  'params.errorRequired': 'Please enter a value.',
  'params.errorInteger': 'Please enter a whole number.',
  'params.errorNumber': 'Please enter a number.',
  'params.errorRange': 'Please enter a value between {{min}} and {{max}}.',
  'params.rangeSuffix': ' ({{min}}–{{max}})',
  'params.sampleSizeOf': 'Sample size for {{label}}',
  'params.pairs': 'Number of pairs',
  'params.sampleSize': 'Sample size',
  'params.mu0': 'Reference value μ₀ (value to compare against)',
  'params.conditionCount': 'Number of conditions',
  'params.subjectCount': 'Number of subjects (same for all conditions)',
  'params.factorALevels': 'Number of levels for Factor A',
  'params.factorBLevels': 'Number of levels for Factor B',
  'params.cellReplicates': 'Replicates per cell (same for all cells)',
  'params.categoryCount': 'Number of categories',
  'params.groupCount': 'Number of groups',
  'params.groupSampleSize': 'Sample size for Group {{n}}',
  'params.rows': 'Number of rows',
  'params.cols': 'Number of columns',
  'params.groupADefault': 'Group A',
  'params.groupBDefault': 'Group B',

  // ===== Screen C: Data input =====
  'input.hintGoodness':
    'Enter a non-negative integer for observed counts and a positive number for expected ratios (the ratios do not need to sum to 1).',
  'input.hintMatrix': 'Enter a non-negative integer (count) in each cell.',
  'input.hintDefault': 'Enter a number in each cell. Decimals are allowed.',
  'input.pasteHint':
    "💡 Paste a range copied from Excel or a spreadsheet into the first cell to fill multiple cells at once.",
  'input.colNo': 'No.',
  'input.rowPrefix': 'Row',
  'input.errorInvalidCells':
    '{{count}} cell(s) contain a non-numeric value (blank or text). Please fix the cells outlined in red.',
  'input.errorCalculation': 'An error occurred during calculation. Please check your input data.',

  // ===== Screen D: Result =====
  'result.title': 'Test Result',
  'result.copyApa': 'Copy Result (APA Format)',
  'result.copyApaDone': 'Copied ✓',
  'result.statLabel_df': 'Degrees of Freedom',
  'result.pValueBoth': 'p-value (two-sided)',
  'result.alphaLabel': 'Significance Level α = {{alpha}}',
  'result.significantYes_diff': 'Significant Difference',
  'result.significantNo_diff': 'No Significant Difference',
  'result.significantYes_corr': 'Significant Correlation',
  'result.significantNo_corr': 'No Significant Correlation',
  'result.rejectYes': 'Since p < {{alpha}}, the null hypothesis is rejected.',
  'result.rejectNo': 'Since p ≥ {{alpha}}, the null hypothesis cannot be rejected.',
  'result.anovaSource': 'Source',
  'result.anovaDf': 'df',
  'result.anovaF': 'F value',
  'result.anovaP': 'p value',
  'result.anovaJudge05': 'Judgment (α=0.05)',
  'result.anovaJudge01': 'Judgment (α=0.01)',
  'result.significant': 'Significant',
  'result.notSignificant': 'Not Significant',
  'result.effectSizeTitle': 'Effect Size',
  'result.effectSizeNote':
    '* Effect size indicates the "magnitude" of a difference or association. The interpretation labels are conventional benchmarks (Cohen’s d, η², and r-family thresholds follow Cohen, 1988); standards vary by field and coefficient.',
  'result.correlationTitle': 'Correlation Coefficient',
  'result.correlationStrengthNote':
    'Rough guide: |r| < 0.2 negligible / 0.2–0.4 weak / 0.4–0.7 moderate / 0.7–0.9 strong / 0.9+ very strong',
  'result.tukeyTitle': "Tukey's Multiple Comparison (Tukey-Kramer Method)",
  'result.tukeyPair': 'Group Pair',
  'result.tukeyDiff': 'Mean Difference',
  'result.tukeyQ': 'q value',
  'result.tukeyP': 'p value',
  'result.tukeyJudge': 'Judgment (α=0.05)',
  'result.chartTitle': 'Chart',
  'result.summaryTitle': 'Summary of Input Data',
  'result.summaryGroup': 'Group',
  'result.summaryN': 'n',
  'result.summaryMean': 'Mean',
  'result.summaryMedian': 'Median',
  'result.summarySd': 'SD',
  'result.extraStatsTitle': 'Additional Statistics',
  'result.explainLink': 'Learn more about this test →',

  // ===== Screen E: Test list =====
  'explainList.title': 'Test List & Guide',
  'explainList.subtitle':
    'Click a test name to see its use cases, hypotheses, assumptions, and formula. Every test can be run with your own data.',
  'explainList.parametric': 'Parametric Tests',
  'explainList.nonparametric': 'Nonparametric Tests',
  'explainList.comingSoon': 'Coming soon',

  // ===== Screen F: Test explanation =====
  'explainDetail.backLink': '← Back to test list',
  'explainDetail.parametric': 'Parametric',
  'explainDetail.nonparametric': 'Nonparametric',
  'explainDetail.comingSoon': 'Coming soon',
  'explainDetail.overview': 'Overview',
  'explainDetail.purpose': 'When to use it',
  'explainDetail.hypothesis': 'Hypotheses',
  'explainDetail.h0': 'Null hypothesis H₀:',
  'explainDetail.h1': 'Alternative hypothesis H₁:',
  'explainDetail.assumptions': 'Assumptions',
  'explainDetail.formula': 'Test Statistic Formula',
  'explainDetail.example': 'Example',
  'explainDetail.notes': 'Notes & Caveats',
  'explainDetail.useButton': 'Analyze your data with this test',

  // ===== Test selection wizard =====
  'guide.title': 'Test Selection Wizard',
  'guide.subtitle':
    'Answer a few questions and we will suggest a test that fits your situation. Use it as a guide when you are unsure.',
  'guide.recommendedLabel': 'Recommended Test',
  'guide.useTest': 'Use this test',
  'guide.moreDetail': 'See full explanation',
  'guide.backQuestion': '← Back to previous question',
  'guide.restart': 'Start Over',

  // ===== OSS credits =====
  'credits.title': 'Open Source Licenses',
  'credits.subtitle': 'This app is built using the following open source software and fonts.',
  'credits.libName': 'Library',
  'credits.license': 'License',

  // ===== Chart (DataChart) =====
  'chart.savePng': 'Save as PNG',
  'chart.saveSvg': 'Save as SVG',
  'chart.saveError': 'Failed to save the image. Your browser may not support this feature.',
  'chart.settingsSummary': 'Chart Display Settings (Title, Axis Range, Data Names)',
  'chart.titleLabel': 'Chart Title',
  'chart.xAxisLabel': 'X-Axis Label',
  'chart.yAxisLabel': 'Y-Axis Label',
  'chart.categoryNames': 'Category Names (X-Axis)',
  'chart.dataNames': 'Data Names',
  'chart.seriesNames': 'Series Names (Legend)',
  'chart.xRange': 'X-Axis Min – Max',
  'chart.yRange': 'Y-Axis Min – Max',
  'chart.yTickStep': 'Y-Axis Tick Interval',
  'chart.yTickStepPlaceholder': 'Auto (5 divisions)',
  'chart.yTickStepHint': 'e.g. 1, 0.5, 0.1',
  'chart.rangeInvalidWarning':
    'The minimum is greater than or equal to the maximum, so this setting was ignored and the axis is auto-scaled instead.',
  'chart.rangeTruncatedWarning':
    'The specified display range does not cover all of the data. Some values may not be visible in the chart.',
  'chart.xMinAria': 'X-axis minimum',
  'chart.xMaxAria': 'X-axis maximum',
  'chart.yMinAria': 'Y-axis minimum',
  'chart.yMaxAria': 'Y-axis maximum',
  'chart.filenameSuffix': 'chart',
  // Chart default labels
  'chart.defaultValueAxis': 'Value',
  'chart.defaultCountAxis': 'Frequency',
  'chart.defaultSuccessAxis': 'Successes',
  'chart.defaultObserved': 'Observed',
  'chart.defaultExpected': 'Expected',
  'chart.defaultSuccessSeries': 'Successes (count of 1s)',
};
