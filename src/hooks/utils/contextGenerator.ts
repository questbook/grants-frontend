import { createContext, createElement, PropsWithChildren } from 'react';

/**
 * Makes a context for a store and a component to provide the store
 */
function ContextGenerator<T>(store: () => T) {
  const context = createContext(undefined as any as T);
  return {
    context,
    contextMaker: ({ children }: { children: PropsWithChildren<JSX.Element | string> }) => {
      const value = store();
      return createElement(context.Provider, { value }, children);
    },
  };
}

export default ContextGenerator;
