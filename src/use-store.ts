import { createContext, useContext } from "react";
import { RootStore, createRootStore } from "./shared/root-store";

const RootStoreContext = createContext<RootStore>(createRootStore());

export const useStore = () => useContext(RootStoreContext);