import { useLocale } from '../i18n/LocaleContext';

/** 免責文（常時展開表示） */
export default function Disclaimer() {
  const { t } = useLocale();
  return (
    <div className="mt-8 rounded-lg border border-border bg-surface p-4 text-sm text-textSub">
      <p className="mb-1 font-bold text-textMain">{t('disclaimer.title')}</p>
      <p>{t('disclaimer.body')}</p>
    </div>
  );
}
