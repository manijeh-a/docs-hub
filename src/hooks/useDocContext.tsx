import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SidebarLinkItem, DocType } from '~/src/types';

import type { Versions } from '../pages/[...slug]';

export type DocCtx = {
  doc: DocType;
  docLink: SidebarLinkItem;
  links: SidebarLinkItem[];
  title: string;
  activeHistory?: string[];
  setActiveHistory: (prev: string[]) => void;
  versions: Versions;
};

const ctx = createContext<DocCtx>({} as DocCtx);

export function useDocContext() {
  return useContext(ctx);
}

type DocProviderProps = Partial<DocCtx> & {
  children: ReactNode;
};

export function DocProvider({ children, ...props }: DocProviderProps) {
  const [activeHistory, setActive] = useState<string[]>([]);

  function setActiveHistory(prev: string[]) {
    setActive((s) => s.concat(prev));
  }

  return (
    <ctx.Provider
      value={{ ...props, activeHistory, setActiveHistory } as DocCtx}
    >
      {children}
    </ctx.Provider>
  );
}
