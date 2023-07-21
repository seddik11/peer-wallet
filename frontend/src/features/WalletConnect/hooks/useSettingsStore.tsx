import { create } from "zustand";

/**
 * Types
 */
interface ISettingsStore {
  testNets: boolean;
  account: number;
  eip155Address: string;
  relayerRegionURL: string;
  setAccount: (account: number) => void;
  setRelayerRegionURL: (relayerRegionURL: string) => void;
  setEip155Address: (eip155Address: string) => void;
  toggleTestNets: () => void;
}

/** Zustand Store */

export const useSettingsStore = create<ISettingsStore>((set) => ({
  testNets: false,
  account: 0,
  eip155Address: "",
  relayerRegionURL: "",
  setAccount: (account: number) => {
    set({ account });
  },
  setEip155Address: (eip155Address: string) => {
    set({ eip155Address });
  },
  setRelayerRegionURL: (relayerRegionURL: string) => {
    set({ relayerRegionURL });
  },
  toggleTestNets: () => {
    set((state) => ({ testNets: !state.testNets }));
  },
}));
