import { Link, NavLink } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

export default function Header() {
  const { t } = useLocale();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white"
            aria-hidden="true"
          >
            σ
          </span>
          <span className="text-lg font-bold text-textMain">{t('header.appName')}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm" aria-label={t('header.navLabel')}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'font-bold text-primary' : 'text-textSub hover:text-primary'
            }
          >
            {t('header.selectTest')}
          </NavLink>
          <NavLink
            to="/explain"
            className={({ isActive }) =>
              isActive ? 'font-bold text-primary' : 'text-textSub hover:text-primary'
            }
          >
            {t('header.explainList')}
          </NavLink>
          <NavLink
            to="/guide"
            className={({ isActive }) =>
              isActive ? 'font-bold text-primary' : 'text-textSub hover:text-primary'
            }
          >
            {t('header.guide')}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
