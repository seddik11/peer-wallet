import { WalletConnect } from "@/features/WalletConnect/WalletConnect";
import { web3wallet } from "@/features/WalletConnect/WalletConnectUtils";
import { useCallback, useEffect, useState } from "react";
import Card from "./Card";
import truncateAddress from "@/utils/truncateAddress";
import { getSdkError } from "@walletconnect/utils";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

const ConnectedDapps = ({ initialized }: any) => {
  const [activeSessions, setActiveSessions] = useState<any>([]);

  const getActiveSessions = useCallback(() => {
    setActiveSessions(Object.values(web3wallet?.getActiveSessions() || {}));
  }, []);

  const { isOpen } = useWcModalStore();

  async function disconnect(index: number) {
    try {
      const activeSessions = web3wallet.getActiveSessions();
      const topic = Object.values(activeSessions)[index].topic;

      if (activeSessions) {
        await web3wallet.disconnectSession({
          topic,
          reason: getSdkError("USER_DISCONNECTED"),
        });
      }
    } catch (error) {
      if (/No matching key/i.test((error as Error).message)) return;
      console.error(error);
    }
    getActiveSessions();
  }

  useEffect(() => {
    if (initialized && !isOpen) getActiveSessions();
  }, [getActiveSessions, initialized, isOpen]);

  return (
    <div>
      <div>Connected Dapps</div>
      <div className="mt-2 mb-10 gap-4 flex flex-col">
        {activeSessions?.length > 0 ? (
          activeSessions.map(({ peer, namespaces }: any, i: number) => (
            <Card key={i}>
              <div className="flex gap-4 items-center">
                <div className="w-12 rounded-full overflow-hidden">
                  <img src={peer.metadata.icons[0]} className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <div className="font-bold">{peer.metadata.description}</div>
                  <div>
                    {truncateAddress(
                      namespaces.eip155.accounts[0].split(":").splice(-1)[0]
                    )}
                  </div>
                </div>
              </div>
              <div
                className="btn btn-secondary m-2"
                onClick={() => disconnect(i)}
              >
                Disconnect
              </div>
            </Card>
          ))
        ) : (
          <div className="text-2xl text-center mt-5">No connected Dapps</div>
        )}

        <WalletConnect />
      </div>
    </div>
  );
};

export default ConnectedDapps;
