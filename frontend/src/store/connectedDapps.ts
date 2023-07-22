import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface IConnectedDappsStore {
  connectedDapps: any[];
  connectDapp: (data: any) => void;
  disconnectDapp: (address: string) => void;
}

export const useConnectedDapps = create<IConnectedDappsStore>()(
  persist(
    immer((set) => ({
      connectedDapps: [],
      connectDapp: (data: any) => {
        set((store) => {
          store.connectedDapps.push(data);
        });
      },
      disconnectDapp: (address: string) => {
        set((store) => {
          store.connectedDapps = store.connectedDapps.filter(
            (data) => data.address !== address
          );
        });
      },
    })),
    {
      name: "connected-dapps-store",
    }
  )
);
