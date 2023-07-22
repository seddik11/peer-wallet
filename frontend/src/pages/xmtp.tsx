import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Chat from "@/features/xmtp/XmtpMessages";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import dynamic from "next/dynamic";
import { Wallet } from "ethers";

const PEER_ADDRESS = "0x937C0d4a6294cdfa575de17382c7076b579DC176";

const Xmtp = () => {
  const [messages, setMessages] = useState<DecodedMessage[] | null>(null);
  const convRef = useRef<Conversation | null>(null);
  const clientRef = useRef<Client | null>(null);
  const burnerWalletsKeys = useBurnerWalletStore(
    (state) => state.burnerWalletsKeys
  );

  const activeBurnerWallet = useMemo(() => {
    return burnerWalletsKeys[0] ? new Wallet(burnerWalletsKeys[0]) : null;
  }, [burnerWalletsKeys]);

  const [isOnNetwork, setIsOnNetwork] = useState(false);

  // Function to load the existing messages in a conversation
  const newConversation = async function (
    xmtp_client: Client,
    addressTo: string
  ) {
    //Creates a new conversation with the address
    if (await xmtp_client?.canMessage(PEER_ADDRESS)) {
      const conversation = await xmtp_client.conversations.newConversation(
        addressTo
      );
      convRef.current = conversation;
      //Loads the messages of the conversation
      const messages = await conversation.messages();
      setMessages(messages);
    } else {
      console.log("cant message because is not on the network.");
      //cant message because is not on the network.
    }
  };

  // Function to initialize the XMTP client
  const initXmtp = async function () {
    // Create the XMTP client
    console.log("initXmtp", activeBurnerWallet);
    if (!activeBurnerWallet) throw new Error("No active wallet");
    const xmtp = await Client.create(activeBurnerWallet, { env: "production" });
    //Create or load conversation with Gm bot
    newConversation(xmtp, PEER_ADDRESS);
    // Set the XMTP client in state for later use
    setIsOnNetwork(!!xmtp.address);
    //Set the client in the ref
    clientRef.current = xmtp;
  };

  useEffect(() => {
    if (isOnNetwork && convRef.current) {
      // Function to stream new messages in the conversation
      const streamMessages = async () => {
        const newStream = await convRef.current?.streamMessages();
        if (!newStream) throw new Error("No stream");
        for await (const msg of newStream) {
          const exists = messages?.find((m) => m.id === msg.id);
          if (!exists) {
            setMessages((prevMessages) => {
              return prevMessages ? [...prevMessages, msg] : [msg];
            });
          }
        }
      };
      streamMessages();
    }
  }, [messages, activeBurnerWallet, isOnNetwork]);

  return (
    <div className={"container"}>
      {/* Display XMTP connection options if connected but not initialized */}
      {activeBurnerWallet && !isOnNetwork && (
        <div className={"flex flex-col items-center"}>
          {activeBurnerWallet && (
            <button onClick={initXmtp} className={"btn"}>
              Connect to XMTP
            </button>
          )}
        </div>
      )}
      {/* Render the Chat component if connected, initialized, and messages exist */}
      {activeBurnerWallet &&
        isOnNetwork &&
        messages &&
        clientRef.current &&
        convRef.current &&
        messages && (
          <Chat
            client={clientRef.current}
            conversation={convRef.current}
            messageHistory={messages}
          />
        )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Xmtp), {
  ssr: false,
});
