import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ParamsState, TestResult } from '../types';

interface AppContextValue {
  /** 選択中の検定ID */
  testId: string | null;
  /** パラメータ設定値（画面Bで確定） */
  params: ParamsState | null;
  /**
   * 入力データ（未パースの文字列）
   * 群形式: grid[群index][サンプルindex] / 分割表形式: grid[行index][列index]
   */
  grid: string[][] | null;
  /** 計算結果 */
  result: TestResult | null;
  selectTest: (id: string) => void;
  setParams: (p: ParamsState) => void;
  setGrid: (g: string[][]) => void;
  setResult: (r: TestResult) => void;
  reset: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [testId, setTestId] = useState<string | null>(null);
  const [params, setParamsState] = useState<ParamsState | null>(null);
  const [grid, setGridState] = useState<string[][] | null>(null);
  const [result, setResultState] = useState<TestResult | null>(null);

  const selectTest = useCallback((id: string) => {
    setTestId(id);
    // 検定を選び直したら下流のstateはクリアする
    setParamsState(null);
    setGridState(null);
    setResultState(null);
  }, []);

  const setParams = useCallback((p: ParamsState) => {
    setParamsState(p);
    setResultState(null);
  }, []);

  const setGrid = useCallback((g: string[][]) => {
    setGridState(g);
  }, []);

  const setResult = useCallback((r: TestResult) => {
    setResultState(r);
  }, []);

  const reset = useCallback(() => {
    setTestId(null);
    setParamsState(null);
    setGridState(null);
    setResultState(null);
  }, []);

  const value = useMemo(
    () => ({
      testId,
      params,
      grid,
      result,
      selectTest,
      setParams,
      setGrid,
      setResult,
      reset,
    }),
    [testId, params, grid, result, selectTest, setParams, setGrid, setResult, reset],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp は AppProvider の内側で使用してください');
  }
  return ctx;
}
