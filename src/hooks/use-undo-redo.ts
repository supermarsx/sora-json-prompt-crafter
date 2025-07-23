import { Dispatch, SetStateAction, useRef, useState } from 'react';

export function useUndoRedo<T>(
  initialValue: T | (() => T),
  limit = 50,
) {
  const init = typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue;
  const historyRef = useRef<T[]>([init]);
  const indexRef = useRef(0);
  const [state, setState] = useState<T>(init);

  const push: Dispatch<SetStateAction<T>> = (value) => {
    setState((prev) => {
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
      let hist = historyRef.current.slice(0, indexRef.current + 1);
      hist.push(next);
      if (hist.length > limit) hist = hist.slice(hist.length - limit);
      historyRef.current = hist;
      indexRef.current = hist.length - 1;
      return next;
    });
  };

  const undo = () => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      setState(historyRef.current[indexRef.current]);
    }
  };

  const redo = () => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      setState(historyRef.current[indexRef.current]);
    }
  };

  return {
    state,
    setState: push,
    undo,
    redo,
    canUndo: indexRef.current > 0,
    canRedo: indexRef.current < historyRef.current.length - 1,
  } as const;
}
