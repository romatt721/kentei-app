import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

const CONTENT = {
  ja: {
    title: '計算結果の検証について',
    subtitle:
      '本サイトの統計計算がどのように検証されているか、そして計算コード自体をどこで確認できるかをまとめています。',
    sections: [
      {
        heading: '1. ソースコードはすべて公開されています',
        body: 'すべての検定の計算ロジックは、GitHub上のリポジトリで誰でも閲覧できます。統計に詳しい方は、実際に使われている数式やアルゴリズムをコードレベルで確認いただけます。',
        link: { label: 'GitHubでソースコードを見る', url: 'https://github.com/romatt721/kentei-app' },
      },
      {
        heading: '2. 既知の値との自動照合（検算）',
        body: '全23種類の検定について、統計解析ソフトR、または統計学の教科書・数表に掲載されている既知の計算例と結果を突き合わせる検算スクリプトを用意しています。コードを変更するたびにこの検算を実行し、計算結果が既知の値と一致することを確認しています。',
        detail: '現在、99項目の検算（統計量・p値・APA形式のレポート文・多言語表示の整合性を含む）がすべて一致しています。',
        link: {
          label: '検算スクリプト（scripts/verify.ts）を見る',
          url: 'https://github.com/romatt721/kentei-app/blob/main/scripts/verify.ts',
        },
      },
      {
        heading: '3. 継続的な検算（CI）',
        body: 'コードに変更を加えるたびに、GitHub Actions上で自動的に検算スクリプトが実行されます。検算がすべて通過していることは、リポジトリのバッジで常に確認できます。将来コードを修正した際に、意図せず計算結果がずれてしまう事故を防ぐ仕組みです。',
      },
      {
        heading: '4. 各検定の解説ページに実装方法を明記',
        body: 'すべての検定の解説ページ（検定一覧から各検定を選ぶと表示されます）に、「連続性補正の有無」「同順位（タイ）の扱い」「正確法か近似法か」といった、結果に影響しうる実装上の選択を明記しています。近似アルゴリズムを使っている検定（シャピロ・ウィルク検定など）には、根拠となる論文名も記載しています。',
      },
      {
        heading: '5. お手元でも検証いただけます（サンプルデータ）',
        body: '以下のデータを実際にサイトへ入力すると、下記の結果が表示されるはずです。Rの標準的な関数（t.test、chisq.test等）で計算した値と一致することを確認済みです。ご自身の統計ソフトと突き合わせてご確認いただけます。',
        examples: [
          {
            title: '対応なし2標本t検定',
            input: '群A = 1, 2, 3, 4, 5 ／ 群B = 2, 4, 6, 8, 10',
            expected: 't(8) = -1.8974, p = 0.09434（Rのt.test(A, B)と一致）',
          },
          {
            title: 'カイ二乗独立性検定',
            input: '分割表 = [[10, 20], [30, 40]]',
            expected: 'χ²(1) = 0.79365, p = 0.37309（Rのchisq.test(x, correct=FALSE)と一致）',
          },
        ],
      },
      {
        heading: '6. 既知の制限事項',
        body: '以下の点は、統計的に妥当性が高い一般的な実装を選んだ結果として生じる制限です。判断を誤らないよう、あらかじめ明示します。',
        list: [
          '反復測定分散分析は球面性を仮定しており、Greenhouse-Geisser等の補正は行っていません。',
          'カイ二乗独立性検定・適合度検定はイェーツの連続性補正を行いません（Rのchisq.test(correct = FALSE)に相当）。',
          'マン・ホイットニーU検定・ウィルコクソン符号順位検定・フリードマン検定・ケンドールのタウ等は正規近似でp値を計算しており、各群・各条件のデータ数がおおむね10未満の小標本では近似精度が下がります。',
          'シャピロ・ウィルク検定はサンプルサイズ3〜5000件の範囲にのみ対応しています。',
          'フィッシャーの正確確率検定は2×2の分割表にのみ対応しています。',
          '一元配置分散分析の事後検定はTukey-Kramer法のみに対応しています（ノンパラメトリック検定の多重比較は未実装です）。',
          'すべての計算はJavaScriptの倍精度浮動小数点数（IEEE 754）で行われており、極端に大きい値・小さい値では浮動小数点特有の丸め誤差が生じる場合があります。',
        ],
      },
      {
        heading: '7. それでも確認いただきたいこと',
        body: '本サイトは学習・参考目的のツールであり、正確性を保証するものではありません。研究発表や論文投稿、医療・実務上の重要な意思決定には、必ず専門家の確認や、R・SPSSなどの専用統計ソフトウェアによる並行検証を行ってください。',
      },
    ],
  },
  en: {
    title: 'How Calculation Accuracy Is Verified',
    subtitle:
      'This page explains how the statistical calculations on this site are verified, and where you can inspect the calculation source code itself.',
    sections: [
      {
        heading: '1. The source code is fully open',
        body: 'The calculation logic for every test is publicly available on GitHub. If you have a statistics background, you can inspect the exact formulas and algorithms used, at the code level.',
        link: { label: 'View the source code on GitHub', url: 'https://github.com/romatt721/kentei-app' },
      },
      {
        heading: '2. Automated cross-checking against known values',
        body: 'For all 23 tests, we maintain a verification script that compares this app’s output against known results computed with the R statistical software, or published in statistics textbooks and reference tables. This script runs every time the code changes, to confirm that results still match the known values.',
        detail: 'Currently, all 99 checks pass — covering test statistics, p-values, APA-style report strings, and consistency of the Japanese/English translations.',
        link: {
          label: 'View the verification script (scripts/verify.ts)',
          url: 'https://github.com/romatt721/kentei-app/blob/main/scripts/verify.ts',
        },
      },
      {
        heading: '3. Continuous verification (CI)',
        body: 'Every code change automatically triggers the verification script via GitHub Actions. Whether all checks currently pass is visible at a glance via the badge on the repository, which helps prevent silent regressions when the code is modified in the future.',
      },
      {
        heading: '4. Implementation choices are documented for every test',
        body: 'Every test\'s explanation page (open any test from the test list) documents the implementation choices that can affect the result — whether a continuity correction is applied, how tied ranks are handled, and whether an exact or approximate method is used. For tests that rely on an approximation algorithm (such as the Shapiro-Wilk test), the underlying paper is cited as well.',
      },
      {
        heading: '5. Verify it yourself with sample data',
        body: 'Enter the data below into the site and you should see the results shown below. These have been confirmed to match values computed with standard R functions (t.test, chisq.test, etc.), so you can cross-check them against your own statistical software.',
        examples: [
          {
            title: 'Independent-samples t-test',
            input: 'Group A = 1, 2, 3, 4, 5 / Group B = 2, 4, 6, 8, 10',
            expected: 't(8) = -1.8974, p = 0.09434 (matches R\'s t.test(A, B))',
          },
          {
            title: 'Chi-square test of independence',
            input: 'Contingency table = [[10, 20], [30, 40]]',
            expected: 'χ²(1) = 0.79365, p = 0.37309 (matches R\'s chisq.test(x, correct=FALSE))',
          },
        ],
      },
      {
        heading: '6. Known limitations',
        body: 'The points below are limitations that follow from choosing standard, well-established implementations. We state them upfront so they are not a source of confusion.',
        list: [
          'The repeated-measures ANOVA assumes sphericity and does not apply corrections such as Greenhouse-Geisser.',
          'The chi-square test of independence and goodness-of-fit test do not apply the Yates continuity correction (equivalent to R\'s chisq.test(correct = FALSE)).',
          'The Mann-Whitney U, Wilcoxon signed-rank, Friedman, and Kendall\'s tau tests compute p-values via normal approximation; approximation accuracy degrades for small samples (roughly under 10 per group/condition).',
          'The Shapiro-Wilk test only supports sample sizes between 3 and 5000.',
          'Fisher\'s exact test only supports 2×2 contingency tables.',
          'Post-hoc comparisons for one-way ANOVA are limited to the Tukey-Kramer method (post-hoc tests for nonparametric tests are not implemented).',
          'All calculations use JavaScript double-precision floating-point numbers (IEEE 754); extremely large or small values may be subject to floating-point rounding error.',
        ],
      },
      {
        heading: '7. What you should still do',
        body: 'This site is provided for learning and reference purposes, and accuracy is not guaranteed. For research publications, academic papers, or important medical or professional decisions, please always verify results with a qualified expert and dedicated statistical software such as R or SPSS.',
      },
    ],
  },
};

/** 計算結果の検証についてのページ */
export default function VerificationPage() {
  const { locale, t } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-textMain">{content.title}</h1>
      <p className="mb-6 text-sm text-textSub">{content.subtitle}</p>

      <div className="flex flex-col gap-4">
        {content.sections.map((section) => (
          <div key={section.heading} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-2 font-bold text-textMain">{section.heading}</h2>
            <p className="text-sm leading-relaxed text-textSub">{section.body}</p>
            {'detail' in section && section.detail && (
              <p className="mt-2 text-sm font-bold leading-relaxed text-textMain">{section.detail}</p>
            )}
            {'link' in section && section.link && (
              <a
                href={section.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-bold text-primary hover:underline"
              >
                {section.link.label} ↗
              </a>
            )}
            {'list' in section && section.list && (
              <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-textSub">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {'examples' in section && section.examples && (
              <div className="mt-3 flex flex-col gap-3">
                {section.examples.map((ex) => (
                  <div key={ex.title} className="rounded-lg bg-surface p-4 text-sm text-textMain">
                    <p className="font-bold">{ex.title}</p>
                    <p className="mt-1 text-textSub">{ex.input}</p>
                    <p className="mt-1 font-bold text-primary">{ex.expected}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm">
        <Link to="/faq" className="font-bold text-primary hover:underline">
          {t('footer.faq')} →
        </Link>
      </p>
    </div>
  );
}
