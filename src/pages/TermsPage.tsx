import { useLocale } from '../i18n/LocaleContext';

interface Section {
  heading: string;
  paragraphs: string[];
}

const CONTENT: Record<'ja' | 'en', { title: string; updated: string; intro: string; sections: Section[] }> = {
  ja: {
    title: '利用規約',
    updated: '最終更新日：2026年7月21日',
    intro:
      'この利用規約（以下「本規約」といいます）は、本サイト運営者（以下「本サイト運営者」といいます）が提供するウェブサイト「有意差検定」（以下「本サイト」といいます）の利用条件を定めるものです。利用者は、本サイトを利用することによって、本規約に同意したものとみなされます。',
    sections: [
      {
        heading: '第1条（適用）',
        paragraphs: ['本規約は、利用者と本サイト運営者との間の本サイトの利用に関わる一切の関係に適用されるものとします。'],
      },
      {
        heading: '第2条（サービス内容）',
        paragraphs: [
          '本サイトは、利用者が入力した数値データに基づき、各種統計的検定（t検定、分散分析、カイ二乗検定等）の計算結果を表示するツールです。すべての計算処理は利用者のブラウザ内で完結し、本サイト運営者のサーバーにデータが送信されることはありません。',
          '本サイトは無料で提供されますが、将来的に第三者配信の広告が表示される場合があります。',
        ],
      },
      {
        heading: '第3条（禁止事項）',
        paragraphs: [
          '利用者は、本サイトの利用にあたり、以下の行為をしてはならないものとします。',
          '（1）法令または公序良俗に違反する行為　（2）本サイトのサーバーやネットワークの機能を破壊・妨害する行為　（3）本サイトの運営を妨害するおそれのある行為　（4）不正アクセスをし、またはこれを試みる行為　（5）本サイトの内容を無断で複製・転載・改変する行為　（6）その他、本サイト運営者が不適切と判断する行為',
        ],
      },
      {
        heading: '第4条（知的財産権）',
        paragraphs: [
          '本サイトのコンテンツ（文章、デザイン、プログラム等）に関する著作権その他の知的財産権は、本サイト運営者または正当な権利を有する第三者に帰属します。',
          '本サイトはオープンソースソフトウェアを利用しています。各ソフトウェアのライセンス情報は、オープンソースライセンスページに記載のとおりです。',
        ],
      },
      {
        heading: '第5条（免責事項）',
        paragraphs: [
          '本サイトが提供する計算結果は、学習・参考目的で提供するものであり、その正確性・完全性・有用性・特定目的への適合性について、本サイト運営者は明示的にも黙示的にも一切保証しません。',
          '研究発表、論文投稿、医療上の意思決定その他の重要な用途においては、必ず専門家の確認と専用の統計ソフトウェアによる検証を行ってください。',
          '本サイト運営者は、本サイトの利用または利用不能によって利用者に生じたいかなる損害についても、一切の責任を負わないものとします。ただし、本サイト運営者の故意または重過失による場合はこの限りではありません。',
          '本サイト運営者は、本サイトの内容の変更、中断、または終了によって生じたいかなる損害についても、責任を負いません。',
        ],
      },
      {
        heading: '第6条（サービス内容の変更等）',
        paragraphs: [
          '本サイト運営者は、利用者に事前に通知することなく、本サイトの内容を変更、追加、または廃止することができるものとし、これによって利用者に生じた損害について一切の責任を負いません。',
        ],
      },
      {
        heading: '第7条（利用規約の変更）',
        paragraphs: [
          '本サイト運営者は、必要と判断した場合には、利用者に通知することなく本規約を変更することができるものとします。変更後の本規約は、本サイトに掲載した時点から効力を生じるものとします。',
        ],
      },
      {
        heading: '第8条（準拠法・裁判管轄）',
        paragraphs: [
          '本規約の解釈にあたっては、日本法を準拠法とします。本サイトに関して紛争が生じた場合には、本サイト運営者の所在地を管轄する裁判所を専属的合意管轄とします。',
        ],
      },
      {
        heading: '第9条（お問い合わせ）',
        paragraphs: ['本規約に関するお問い合わせは、お問い合わせページよりご連絡ください。'],
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    updated: 'Last updated: July 21, 2026',
    intro:
      'These Terms of Use (these "Terms") set out the conditions for using the "Significance Test" website (this "Site") provided by the operator of this Site (the "Site Operator"). By using this Site, you are deemed to have agreed to these Terms.',
    sections: [
      {
        heading: 'Article 1 (Application)',
        paragraphs: [
          'These Terms apply to all relationships between users and the Site Operator in connection with the use of this Site.',
        ],
      },
      {
        heading: 'Article 2 (Description of Service)',
        paragraphs: [
          'This Site is a tool that displays the results of various statistical tests (t-tests, ANOVA, chi-square tests, etc.) calculated from the numeric data entered by the user. All calculations are performed entirely within the user\'s browser, and no data is transmitted to the Site Operator\'s servers.',
          'This Site is provided free of charge, but third-party advertisements may be displayed in the future.',
        ],
      },
      {
        heading: 'Article 3 (Prohibited Conduct)',
        paragraphs: [
          'When using this Site, users must not engage in any of the following acts:',
          '(1) acts that violate laws, regulations, or public order and morals; (2) acts that destroy or interfere with the functions of this Site\'s servers or network; (3) acts that may interfere with the operation of this Site; (4) unauthorized access, or attempts thereof; (5) unauthorized copying, reposting, or modification of the content of this Site; (6) any other act that the Site Operator deems inappropriate.',
        ],
      },
      {
        heading: 'Article 4 (Intellectual Property)',
        paragraphs: [
          'Copyright and other intellectual property rights in the content of this Site (text, design, program, etc.) belong to the Site Operator or to third parties who legitimately hold such rights.',
          'This Site uses open source software. License information for each component is provided on the Open Source Licenses page.',
        ],
      },
      {
        heading: 'Article 5 (Disclaimer)',
        paragraphs: [
          'The calculation results provided by this Site are for learning and reference purposes only. The Site Operator makes no warranty, express or implied, as to their accuracy, completeness, usefulness, or fitness for any particular purpose.',
          'For research publications, academic papers, medical decision-making, or any other important use, please verify results with a qualified expert and dedicated statistical software.',
          'The Site Operator shall not be liable for any damages arising from the use of, or inability to use, this Site, except where such damages result from the Site Operator\'s willful misconduct or gross negligence.',
          'The Site Operator shall not be liable for any damages arising from changes to, suspension of, or termination of this Site.',
        ],
      },
      {
        heading: 'Article 6 (Changes to the Service)',
        paragraphs: [
          'The Site Operator may change, add to, or discontinue the content of this Site without prior notice to users, and shall not be liable for any damages arising therefrom.',
        ],
      },
      {
        heading: 'Article 7 (Changes to These Terms)',
        paragraphs: [
          'The Site Operator may amend these Terms without notice to users when deemed necessary. Any amended Terms take effect from the time they are posted on this Site.',
        ],
      },
      {
        heading: 'Article 8 (Governing Law and Jurisdiction)',
        paragraphs: [
          'These Terms shall be governed by the laws of Japan. Any dispute arising in connection with this Site shall be subject to the exclusive jurisdiction of the court having jurisdiction over the location of the Site Operator.',
        ],
      },
      {
        heading: 'Article 9 (Contact)',
        paragraphs: ['For questions about these Terms, please get in touch via the Contact page.'],
      },
    ],
  },
};

/** 利用規約ページ */
export default function TermsPage() {
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-textMain">{content.title}</h1>
      <p className="mb-6 text-xs text-textSub">{content.updated}</p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-6 text-sm leading-relaxed text-textMain">{content.intro}</p>

        {content.sections.map((section) => (
          <div key={section.heading} className="mb-6 last:mb-0">
            <h2 className="mb-2 border-l-4 border-primary pl-3 text-base font-bold text-textMain">
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-2 text-sm leading-relaxed text-textMain last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
