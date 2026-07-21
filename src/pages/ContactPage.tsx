import { useLocale } from '../i18n/LocaleContext';

const CONTACT_EMAIL = 'romatt721@gmail.com';

const CONTENT = {
  ja: {
    title: 'お問い合わせ',
    body: [
      '不具合のご報告、機能のご要望、その他本サイトに関するお問い合わせは、以下のメールアドレスまでご連絡ください。',
      '内容を確認の上、必要に応じて順次対応いたします。返信までお時間をいただく場合がございますので、あらかじめご了承ください。',
    ],
    emailLabel: 'メールアドレス',
    note: '※ 個人運営のサイトのため、すべてのお問い合わせにお返事できるとは限りません。あらかじめご了承ください。',
  },
  en: {
    title: 'Contact',
    body: [
      'For bug reports, feature requests, or any other questions about this site, please reach out using the email address below.',
      'We review every message and respond when we can, though it may take some time — thank you for your patience.',
    ],
    emailLabel: 'Email',
    note: '* This is an individually operated site, so we may not be able to respond to every inquiry.',
  },
} as const;

/** お問い合わせページ */
export default function ContactPage() {
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-textMain">{content.title}</h1>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {content.body.map((p) => (
          <p key={p} className="mb-3 text-sm leading-relaxed text-textMain last:mb-0">
            {p}
          </p>
        ))}
        <div className="mt-4 rounded-lg bg-surface p-4">
          <p className="mb-1 text-xs font-bold text-textSub">{content.emailLabel}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs text-textSub">{content.note}</p>
    </div>
  );
}
