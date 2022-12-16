import React, { ReactElement } from "react";

export interface GlobalContextInterface {
  pollList: number[];
  setPollList: (data: number[]) => void;
}

interface Props {
  children: ReactElement;
}

export const GlobalContextManager = React.createContext(
  {} as GlobalContextInterface
);

export const GlobalContextProvider = (props: Props) => {
  const [pollList, setPollList] = React.useState<number[]>([]);

  return (
    <GlobalContextManager.Provider
      value={{
        pollList,
        setPollList,
      }}
    >
      {props.children}
    </GlobalContextManager.Provider>
  );
};
