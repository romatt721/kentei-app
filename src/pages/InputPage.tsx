import { useMemo, useState } from 'react';
import type { ClipboardEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import { useApp } from '../context/AppContext';
import { getTestById } from '../data/tests';
import { getLocalizedTest } from '../data/tests.en';
import { useLocale } from '../i18n/LocaleContext';
import {
  computeResult,
  getColumnLabels,
  getRowLabel,
  parseCell,
  StatError,
} from '../stats';
import { translateStatsText } from '../stats/statsLabels';
import type { ParamsState } from '../types';

/**
 * 貼り付けテキストを2次元配列に分解する。
 * 行は改行、列はタブ（Excel等からのコピー）またはカンマで区切る。
 */
function parsePasteText(text: string): string[][] {
  const rows = text.replace(/\r\n?/g, '\n').split('\n');
  while (rows.length > 0 && rows[rows.length - 1].trim() === '') rows.pop();
  return rows.map((row) => {
    const cells = row.includes('\t')
      ? row.split('\t')
      : row.includes(',')
        ? row.split(',')
        : [row];
    return cells.map((c) => c.trim());
  });
}

/** 画面C：データ入力画面 */
export default function InputPage() {
  const navigate = useNavigate();
  const { testId, params, grid, setGrid, setResult } = useApp();
  const { locale, t } = useLocale();
  const def = testId ? getTestById(testId) : undefined;
  const localized = def ? getLocalizedTest(def, locale) : undefined;

  // 2×2固定の検定（フィッシャー・マクネマー）は画面Bをスキップするため、ここで確定する
  const effectiveParams: ParamsState | null = useMemo(() => {
    if (params) return params;
    if (def?.input?.kind === 'fisher') return { kind: 'matrix', rows: 2, cols: 2 };
    return null;
  }, [params, def]);

  // 期待されるグリッド形状（群形式: 列ごとの長さ / 分割表形式: 行ごとの列数）
  const shape: number[] | null = useMemo(() => {
    if (!effectiveParams) return null;
    if (effectiveParams.kind === 'groups') return effectiveParams.sizes;
    if (effectiveParams.kind === 'twoWay') {
      return Array.from(
        { length: effectiveParams.a * effectiveParams.b },
        () => effectiveParams.n,
      );
    }
    return Array.from({ length: effectiveParams.rows }, () => effectiveParams.cols);
  }, [effectiveParams]);

  const [localGrid, setLocalGrid] = useState<string[][]>(() => {
    if (!shape) return [];
    // 形状が一致すればcontextの入力値を復元する（「戻る」で往復しても消えない）
    if (
      grid &&
      grid.length === shape.length &&
      grid.every((col, i) => col.length === shape[i])
    ) {
      return grid;
    }
    return shape.map((len) => Array.from({ length: len }, () => ''));
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());

  if (!def || !localized) return <Navigate to="/" replace />;
  if (!effectiveParams || !shape) return <Navigate to="/params" replace />;

  const isMatrix = effectiveParams.kind === 'matrix';
  const columnLabels = getColumnLabels(def, effectiveParams, locale);
  const maxRows = isMatrix ? shape.length : Math.max(...shape);

  const hint =
    localized.input?.inputHint ??
    (def.input?.kind === 'goodness'
      ? t('input.hintGoodness')
      : isMatrix
        ? t('input.hintMatrix')
        : t('input.hintDefault'));

  const updateCell = (g: number, i: number, v: string) => {
    setLocalGrid((prev) =>
      prev.map((col, gi) => (gi === g ? col.map((c, ii) => (ii === i ? v : c)) : col)),
    );
  };

  /**
   * 複数セルの一括貼り付け。
   * outer/inner は updateCell と同じ添字（分割表: 行/列、群形式: 群/サンプル）。
   * 貼り付けデータの「行」は下方向（サンプル・分割表の行）、「列」は右方向へ展開する。
   */
  const handlePaste = (
    outer: number,
    inner: number,
    e: ClipboardEvent<HTMLInputElement>,
  ) => {
    const tokens = parsePasteText(e.clipboardData.getData('text'));
    if (tokens.length <= 1 && (tokens[0]?.length ?? 0) <= 1) {
      return; // 単一値は通常の貼り付けに任せる
    }
    e.preventDefault();
    setLocalGrid((prev) => {
      const next = prev.map((col) => [...col]);
      tokens.forEach((rowTokens, r) => {
        rowTokens.forEach((tok, c) => {
          if (tok === '') return;
          // 分割表は grid[行][列]、群形式は grid[群][サンプル] なので添字の対応が異なる
          const o = isMatrix ? outer + r : outer + c;
          const i2 = isMatrix ? inner + c : inner + r;
          if (o < next.length && i2 < next[o].length) {
            next[o][i2] = tok;
          }
        });
      });
      return next;
    });
    setErrorMsg(null);
  };

  const handleCalculate = () => {
    // 全セルの数値チェック
    const invalid = new Set<string>();
    localGrid.forEach((col, g) => {
      col.forEach((cell, i) => {
        if (parseCell(cell) === null) invalid.add(`${g}-${i}`);
      });
    });
    if (invalid.size > 0) {
      setInvalidCells(invalid);
      setErrorMsg(t('input.errorInvalidCells', { count: invalid.size }));
      return;
    }
    setInvalidCells(new Set());
    try {
      const result = computeResult(def, effectiveParams, localGrid);
      setGrid(localGrid);
      setResult(result);
      navigate('/result');
    } catch (e) {
      if (e instanceof StatError) {
        setErrorMsg(translateStatsText(e.message, locale));
      } else {
        setErrorMsg(t('input.errorCalculation'));
      }
    }
  };

  const handleBack = () => {
    setGrid(localGrid); // 入力途中の値を保持したまま戻る
    navigate(def.skipParamScreen ? '/' : '/params');
  };

  const cellClass = (key: string) =>
    `w-24 rounded border px-2 py-1 text-right text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary ${
      invalidCells.has(key) ? 'border-accent bg-accent/5' : 'border-border'
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Stepper current={3} />
      <h1 className="mb-1 text-2xl font-bold text-textMain">{localized.name}</h1>
      <p className="mb-2 text-sm text-textSub">{hint}</p>
      <p className="mb-6 rounded-lg bg-primary/5 px-3 py-2 text-sm text-primary">
        {t('input.pasteHint')}
      </p>

      <div className="overflow-x-auto rounded-xl border border-border bg-card p-4 shadow-sm">
        <table className="mx-auto border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="px-2 text-sm font-normal text-textSub" scope="col">
                {isMatrix ? '' : t('input.colNo')}
              </th>
              {columnLabels.map((label) => (
                <th
                  key={label}
                  className="px-2 py-1 text-sm font-bold text-textMain"
                  scope="col"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: isMatrix ? shape.length : maxRows }, (_, i) => (
              <tr key={i}>
                <th
                  className="px-2 text-right text-sm font-normal text-textSub"
                  scope="row"
                >
                  {isMatrix ? getRowLabel(def, i, locale) : i + 1}
                </th>
                {isMatrix
                  ? // 分割表形式: localGrid[行][列]
                    Array.from({ length: columnLabels.length }, (_, j) => (
                      <td key={j}>
                        <input
                          type="text"
                          inputMode="numeric"
                          aria-label={`${getRowLabel(def, i, locale)} ${columnLabels[j]}`}
                          value={localGrid[i]?.[j] ?? ''}
                          onChange={(e) => updateCell(i, j, e.target.value)}
                          onPaste={(e) => handlePaste(i, j, e)}
                          className={cellClass(`${i}-${j}`)}
                        />
                      </td>
                    ))
                  : // 群形式: localGrid[群][サンプル]
                    shape.map((len, g) => (
                      <td key={g}>
                        {i < len ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            aria-label={
                              locale === 'ja'
                                ? `${columnLabels[g]} ${i + 1}番目`
                                : `${columnLabels[g]} ${i + 1}`
                            }
                            value={localGrid[g]?.[i] ?? ''}
                            onChange={(e) => updateCell(g, i, e.target.value)}
                            onPaste={(e) => handlePaste(g, i, e)}
                            className={cellClass(`${g}-${i}`)}
                          />
                        ) : null}
                      </td>
                    ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errorMsg && (
        <div
          className="mt-4 rounded-lg border border-accent bg-accent/5 p-3 text-sm font-bold text-accent"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg border border-border bg-card px-6 py-2 font-bold text-textSub hover:text-textMain"
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          onClick={handleCalculate}
          className="rounded-lg bg-primary px-6 py-2 font-bold text-white hover:bg-primary/90"
        >
          {t('common.calculate')}
        </button>
      </div>
    </div>
  );
}
