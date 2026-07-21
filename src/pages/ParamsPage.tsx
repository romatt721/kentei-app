import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import { useApp } from '../context/AppContext';
import { getTestById } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { useLocale } from '../i18n/LocaleContext';
import { parseCell } from '../stats';

/** 整数として範囲内かを検証。エラーメッセージまたは null を返す */
function validateInt(
  raw: string,
  min: number,
  max: number,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string | null {
  if (raw.trim() === '') return t('params.errorRequired');
  const v = Number(raw);
  if (!Number.isInteger(v)) return t('params.errorInteger');
  if (v < min || v > max) return t('params.errorRange', { min, max });
  return null;
}

/** 実数として妥当かを検証（基準値μ₀用） */
function validateReal(
  raw: string,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string | null {
  if (raw.trim() === '') return t('params.errorRequired');
  if (parseCell(raw) === null) return t('params.errorNumber');
  return null;
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: string;
  min?: number;
  max?: number;
  real?: boolean; // trueなら整数範囲チェックせず実数として検証
  onChange: (v: string) => void;
}

function NumberField({ id, label, value, min, max, real, onChange }: NumberFieldProps) {
  const { t } = useLocale();
  const error = real
    ? validateReal(value, t)
    : validateInt(value, min ?? 0, max ?? 0, t);
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-bold text-textMain">
        {label}
        {!real && (
          <span className="ml-2 font-normal text-textSub">
            {t('params.rangeSuffix', { min: min ?? 0, max: max ?? 0 })}
          </span>
        )}
      </label>
      <input
        id={id}
        type={real ? 'text' : 'number'}
        inputMode={real ? 'decimal' : 'numeric'}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-40 rounded-lg border px-3 py-2 text-textMain focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-accent' : 'border-border'
        }`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-sm text-accent">{error}</p>}
    </div>
  );
}

/** 画面B：パラメータ指定画面 */
export default function ParamsPage() {
  const navigate = useNavigate();
  const { testId, params, setParams } = useApp();
  const { locale, t } = useLocale();
  const def = testId ? getTestById(testId) : undefined;
  const localized = def ? getLocalizedTest(def, locale) : undefined;

  const input = def?.input;
  const kind = input?.kind;

  // 既存のパラメータがあればそれを初期値にする（画面Cから戻ったときのため)
  const initial = useMemo(() => {
    if (params?.kind === 'groups') return params.sizes.map(String);
    return null;
  }, [params]);

  const [n1, setN1] = useState(initial?.[0] ?? '10');
  const [n2, setN2] = useState(initial?.[1] ?? '10');
  const [nPairs, setNPairs] = useState(initial?.[0] ?? '10');
  const [groupCount, setGroupCount] = useState(
    initial && initial.length >= 3 ? String(initial.length) : '3',
  );
  const [groupSizes, setGroupSizes] = useState<string[]>(
    initial && initial.length >= 3 ? initial : ['10', '10', '10'],
  );
  const [rows, setRows] = useState(
    params?.kind === 'matrix' ? String(params.rows) : '2',
  );
  const [cols, setCols] = useState(
    params?.kind === 'matrix' ? String(params.cols) : '2',
  );
  // oneGroup用
  const [nOne, setNOne] = useState(initial?.[0] ?? '10');
  const [mu0, setMu0] = useState(
    params?.kind === 'groups' && params.mu0 !== undefined ? String(params.mu0) : '',
  );
  // conditions用（条件数と対象者数）
  const [condCount, setCondCount] = useState(
    initial && initial.length >= 3 ? String(initial.length) : '3',
  );
  const [condN, setCondN] = useState(initial?.[0] ?? '10');
  // twoWay用
  const [twoA, setTwoA] = useState(params?.kind === 'twoWay' ? String(params.a) : '2');
  const [twoB, setTwoB] = useState(params?.kind === 'twoWay' ? String(params.b) : '2');
  const [twoN, setTwoN] = useState(params?.kind === 'twoWay' ? String(params.n) : '5');
  // goodness用（カテゴリ数）
  const [categories, setCategories] = useState(
    params?.kind === 'matrix' ? String(params.rows) : '3',
  );

  if (!def || !input || !localized) {
    // 検定未選択で直接アクセスされた場合は画面Aへ
    return <Navigate to="/" replace />;
  }
  if (def.skipParamScreen) {
    return <Navigate to="/input" replace />;
  }

  const handleGroupCountChange = (v: string) => {
    setGroupCount(v);
    const k = Number(v);
    if (
      Number.isInteger(k) &&
      k >= (input.minGroups ?? 2) &&
      k <= (input.maxGroups ?? 10)
    ) {
      setGroupSizes((prev) => {
        const next = prev.slice(0, k);
        while (next.length < k) next.push('10');
        return next;
      });
    }
  };

  // 現在の入力からエラー有無と確定値を求める
  let hasError = false;
  let nextParams: Parameters<typeof setParams>[0] | null = null;

  if (kind === 'twoGroups') {
    hasError =
      !!validateInt(n1, input.minN, input.maxN, t) ||
      !!validateInt(n2, input.minN, input.maxN, t);
    if (!hasError) nextParams = { kind: 'groups', sizes: [Number(n1), Number(n2)] };
  } else if (kind === 'paired') {
    hasError = !!validateInt(nPairs, input.minN, input.maxN, t);
    if (!hasError) {
      nextParams = { kind: 'groups', sizes: [Number(nPairs), Number(nPairs)] };
    }
  } else if (kind === 'multiGroups') {
    const minG = input.minGroups ?? 2;
    const maxG = input.maxGroups ?? 10;
    const countError = !!validateInt(groupCount, minG, maxG, t);
    const sizeErrors = groupSizes.some(
      (s) => !!validateInt(s, input.minN, input.maxN, t),
    );
    hasError = countError || sizeErrors;
    if (!hasError) nextParams = { kind: 'groups', sizes: groupSizes.map(Number) };
  } else if (kind === 'matrix') {
    const minD = input.minDim ?? 2;
    const maxD = input.maxDim ?? 10;
    hasError =
      !!validateInt(rows, minD, maxD, t) || !!validateInt(cols, minD, maxD, t);
    if (!hasError) {
      nextParams = { kind: 'matrix', rows: Number(rows), cols: Number(cols) };
    }
  } else if (kind === 'oneGroup') {
    hasError = !!validateInt(nOne, input.minN, input.maxN, t);
    if (input.needsMu0) hasError = hasError || !!validateReal(mu0, t);
    if (!hasError) {
      nextParams = {
        kind: 'groups',
        sizes: [Number(nOne)],
        ...(input.needsMu0 ? { mu0: parseCell(mu0)! } : {}),
      };
    }
  } else if (kind === 'conditions') {
    const minG = input.minGroups ?? 3;
    const maxG = input.maxGroups ?? 10;
    hasError =
      !!validateInt(condCount, minG, maxG, t) ||
      !!validateInt(condN, input.minN, input.maxN, t);
    if (!hasError) {
      nextParams = {
        kind: 'groups',
        sizes: Array.from({ length: Number(condCount) }, () => Number(condN)),
      };
    }
  } else if (kind === 'twoWay') {
    const minL = input.minGroups ?? 2;
    const maxL = input.maxGroups ?? 5;
    hasError =
      !!validateInt(twoA, minL, maxL, t) ||
      !!validateInt(twoB, minL, maxL, t) ||
      !!validateInt(twoN, input.minN, input.maxN, t);
    if (!hasError) {
      nextParams = {
        kind: 'twoWay',
        a: Number(twoA),
        b: Number(twoB),
        n: Number(twoN),
      };
    }
  } else if (kind === 'goodness') {
    const minD = input.minDim ?? 2;
    const maxD = input.maxDim ?? 10;
    hasError = !!validateInt(categories, minD, maxD, t);
    if (!hasError) {
      // 列は固定2列（観測度数・期待比率）
      nextParams = { kind: 'matrix', rows: Number(categories), cols: 2 };
    }
  }

  const handleNext = () => {
    if (hasError || !nextParams) return;
    setParams(nextParams);
    navigate('/input');
  };

  const colLabel0 = localized.input?.columnLabels?.[0] ?? t('params.groupADefault');
  const colLabel1 = localized.input?.columnLabels?.[1] ?? t('params.groupBDefault');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Stepper current={2} />
      <h1 className="mb-1 text-2xl font-bold text-textMain">{localized.name}</h1>
      <p className="mb-6 text-sm text-textSub">{t('params.subtitle')}</p>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {kind === 'twoGroups' && (
          <>
            <NumberField
              id="n1"
              label={t('params.sampleSizeOf', { label: colLabel0 })}
              value={n1}
              min={input.minN}
              max={input.maxN}
              onChange={setN1}
            />
            <NumberField
              id="n2"
              label={t('params.sampleSizeOf', { label: colLabel1 })}
              value={n2}
              min={input.minN}
              max={input.maxN}
              onChange={setN2}
            />
          </>
        )}

        {kind === 'paired' && (
          <NumberField
            id="pairs"
            label={localized.input?.nLabel ?? t('params.pairs')}
            value={nPairs}
            min={input.minN}
            max={input.maxN}
            onChange={setNPairs}
          />
        )}

        {kind === 'oneGroup' && (
          <>
            <NumberField
              id="n-one"
              label={localized.input?.nLabel ?? t('params.sampleSize')}
              value={nOne}
              min={input.minN}
              max={input.maxN}
              onChange={setNOne}
            />
            {input.needsMu0 && (
              <NumberField id="mu0" label={t('params.mu0')} value={mu0} real onChange={setMu0} />
            )}
          </>
        )}

        {kind === 'conditions' && (
          <>
            <NumberField
              id="cond-count"
              label={t('params.conditionCount')}
              value={condCount}
              min={input.minGroups ?? 3}
              max={input.maxGroups ?? 10}
              onChange={setCondCount}
            />
            <NumberField
              id="cond-n"
              label={t('params.subjectCount')}
              value={condN}
              min={input.minN}
              max={input.maxN}
              onChange={setCondN}
            />
          </>
        )}

        {kind === 'twoWay' && (
          <>
            <NumberField
              id="two-a"
              label={t('params.factorALevels')}
              value={twoA}
              min={input.minGroups ?? 2}
              max={input.maxGroups ?? 5}
              onChange={setTwoA}
            />
            <NumberField
              id="two-b"
              label={t('params.factorBLevels')}
              value={twoB}
              min={input.minGroups ?? 2}
              max={input.maxGroups ?? 5}
              onChange={setTwoB}
            />
            <NumberField
              id="two-n"
              label={t('params.cellReplicates')}
              value={twoN}
              min={input.minN}
              max={input.maxN}
              onChange={setTwoN}
            />
          </>
        )}

        {kind === 'goodness' && (
          <NumberField
            id="categories"
            label={t('params.categoryCount')}
            value={categories}
            min={input.minDim ?? 2}
            max={input.maxDim ?? 10}
            onChange={setCategories}
          />
        )}

        {kind === 'multiGroups' && (
          <>
            <NumberField
              id="group-count"
              label={t('params.groupCount')}
              value={groupCount}
              min={input.minGroups ?? 2}
              max={input.maxGroups ?? 10}
              onChange={handleGroupCountChange}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {groupSizes.map((s, i) => (
                <NumberField
                  key={i}
                  id={`group-size-${i}`}
                  label={t('params.groupSampleSize', { n: i + 1 })}
                  value={s}
                  min={input.minN}
                  max={input.maxN}
                  onChange={(v) =>
                    setGroupSizes((prev) => prev.map((p, j) => (j === i ? v : p)))
                  }
                />
              ))}
            </div>
          </>
        )}

        {kind === 'matrix' && (
          <>
            <NumberField
              id="rows"
              label={t('params.rows')}
              value={rows}
              min={input.minDim ?? 2}
              max={input.maxDim ?? 10}
              onChange={setRows}
            />
            <NumberField
              id="cols"
              label={t('params.cols')}
              value={cols}
              min={input.minDim ?? 2}
              max={input.maxDim ?? 10}
              onChange={setCols}
            />
          </>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-lg border border-border bg-card px-6 py-2 font-bold text-textSub hover:text-textMain"
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={hasError}
          className={`rounded-lg px-6 py-2 font-bold ${
            hasError
              ? 'cursor-not-allowed bg-border text-textSub'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
}
