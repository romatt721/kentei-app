import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 text-sm text-textSub">
        <p>{t('footer.privacy')}</p>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link to="/faq" className="text-primary hover:underline">
            {t('footer.faq')}
          </Link>
          <Link to="/contact" className="text-primary hover:underline">
            {t('footer.contact')}
          </Link>
          <Link to="/privacy" className="text-primary hover:underline">
            {t('footer.privacyPolicy')}
          </Link>
          <Link to="/terms" className="text-primary hover:underline">
            {t('footer.termsOfUse')}
          </Link>
          <Link to="/credits" className="text-primary hover:underline">
            {t('footer.credits')}
          </Link>
        </nav>
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
