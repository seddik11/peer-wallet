import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ICredentialsStore {
  sismoProof: string;
  setSismoProof: (hash: string) => void;
}

export const useCredentialsStore = create<ICredentialsStore>()(
  persist(
    immer((set) => ({
      sismoProof: "",
      setSismoProof: (hash: string) => {
        set(() => ({ sismoProof: hash }));
      },
    })),
    {
      name: "credentials-store",
    }
  )
);
