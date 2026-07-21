import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTestById } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { GUIDE_START, parseResult } from '../data/guideTree';
import { getLocalizedNode } from '../data/guideTree.en';
import { useLocale } from '../i18n/LocaleContext';

/** 画面A/Eからアクセスする検定選択ウィザード */
export default function TestGuide() {
  const navigate = useNavigate();
  const { selectTest } = useApp();
  const { locale, t } = useLocale();
  // 履歴（訪問した質問ノードidのスタック）。最後の要素が現在の質問
  const [history, setHistory] = useState<string[]>([GUIDE_START]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  const currentNode = getLocalizedNode(history[history.length - 1], locale);

  const handleAnswer = (label: string, next: string) => {
    const testId = parseResult(next);
    setAnswers((prev) => [...prev, label]);
    if (testId) {
      setResultId(testId);
    } else {
      setHistory((prev) => [...prev, next]);
    }
  };

  const handleBack = () => {
    if (resultId) {
      setResultId(null);
      setAnswers((prev) => prev.slice(0, -1));
      return;
    }
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
      setAnswers((prev) => prev.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setHistory([GUIDE_START]);
    setAnswers([]);
    setResultId(null);
  };

  const handleUseTest = () => {
    if (!resultId) return;
    const def = getTestById(resultId);
    selectTest(resultId);
    navigate(def?.skipParamScreen ? '/input' : '/params');
  };

  const resultDefRaw = resultId ? getTestById(resultId) : null;
  const resultDef = resultDefRaw ? getLocalizedTest(resultDefRaw, locale) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-textMain">{t('guide.title')}</h1>
      <p className="mb-6 text-sm text-textSub">{t('guide.subtitle')}</p>

      {answers.length > 0 && (
        <ol className="mb-6 flex flex-wrap gap-x-2 gap-y-1 text-xs text-textSub">
          {answers.map((a, i) => (
            <li key={i} className="rounded-full bg-surface px-2 py-1">
              {a}
            </li>
          ))}
        </ol>
      )}

      {resultDef ? (
        <div className="rounded-xl border border-primary bg-card p-6 shadow-sm">
          <p className="mb-1 text-sm font-bold text-primary">{t('guide.recommendedLabel')}</p>
          <h2 className="mb-2 text-xl font-bold text-textMain">{resultDef.name}</h2>
          <p className="mb-4 text-sm text-textSub">{resultDef.description}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUseTest}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90"
            >
              {t('guide.useTest')}
            </button>
            <Link
              to={`/explain/${resultDef.id}`}
              className="rounded-lg border border-border px-5 py-2 text-sm font-bold text-textMain hover:border-primary"
            >
              {t('guide.moreDetail')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="mb-4 text-lg font-bold text-textMain">{currentNode.question}</p>
          <div className="flex flex-col gap-2">
            {currentNode.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleAnswer(opt.label, opt.next)}
                className="rounded-lg border border-border px-4 py-3 text-left text-sm text-textMain hover:border-primary hover:bg-primary/5"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm">
        <button
          type="button"
          onClick={handleBack}
          disabled={history.length === 1 && !resultId}
          className={`font-bold ${
            history.length === 1 && !resultId
              ? 'cursor-not-allowed text-border'
              : 'text-textSub hover:text-textMain'
          }`}
        >
          {t('guide.backQuestion')}
        </button>
        <button type="button" onClick={handleRestart} className="font-bold text-textSub hover:text-textMain">
          {t('guide.restart')}
        </button>
      </div>
    </div>
  );
}
