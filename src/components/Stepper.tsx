import { useLocale } from '../i18n/LocaleContext';

const STEP_KEYS = ['stepper.step1', 'stepper.step2', 'stepper.step3', 'stepper.step4'];

/** 4ステップの進捗バー。current は1始まりのステップ番号 */
export default function Stepper({ current }: { current: number }) {
  const { t } = useLocale();
  return (
    <ol className="mb-8 flex items-center justify-center gap-0" aria-label={t('stepper.aria')}>
      {STEP_KEYS.map((key, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <li key={key} className="flex items-center">
            {i > 0 && (
              <div
                className={`mx-1 h-0.5 w-6 sm:mx-2 sm:w-12 ${
                  isDone || isActive ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isActive
                    ? 'bg-primary text-white'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-border text-textSub'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {step}
              </div>
              <span
                className={`mt-1 hidden text-xs sm:block ${
                  isActive ? 'font-bold text-primary' : 'text-textSub'
                }`}
              >
                {t(key)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
