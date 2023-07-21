import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IConnectionSiteStore {
  connections: IWalletConnectionSession[];
  addConnection: (connection: IWalletConnectionSession) => void;
  removeConnection: (peerId: string) => void;
}

export interface IWalletConnectionSession {
  peerId: string;
  peerMeta: {
    url: string;
    icons: string[];
    name: string;
  };
}

const useConnectionSiteStoreBase = create<IConnectionSiteStore>()(
  devtools(
    persist(
      immer((set) => ({
        connections: [],
        addConnection: (connectionSession: IWalletConnectionSession) => {
          set((state) => {
            state.connections.push(connectionSession);
          });
        },
        removeConnection: (peerId: string) => {
          set((state) => {
            state.connections = state.connections.filter(
              (x) => x.peerId !== peerId
            );
          });
        },
      })),
      {
        name: "site-connections",
      }
    )
  )
);

export const useConnectionSiteStore = () => {
  // const account = useAccount();
  const connections = useConnectionSiteStoreBase((state) => state.connections);

  const {
    addConnection: addConnectionAction,
    removeConnection: removeConnectionAction,
  } = useConnectionSiteStoreBase((state) => state);

  const addConnection = (conenction: IWalletConnectionSession) => {
    addConnectionAction(conenction);
  };

  const removeConnection = (peerId: string) => {
    removeConnectionAction(peerId);
  };

  return {
    connections: connections || [],
    addConnection,
    removeConnection,
  };
};
