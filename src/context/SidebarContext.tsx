import { createContext, useState, useContext } from 'react';

const defaultValue = {
  isOpened: false,
  closeSidebar: () => {},
  openSidebar: () => {},
};

const SidebarContext = createContext(defaultValue);

export const SidebarStore = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const openSidebar = () => {
    setIsOpened(true);
  };

  const closeSidebar = () => {
    setIsOpened(false);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SidebarContext.Provider value={{ isOpened, openSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebarContext() {
  return useContext(SidebarContext);
}
