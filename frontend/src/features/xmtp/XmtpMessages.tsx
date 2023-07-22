import React, { useState } from "react";
import { Client, Conversation, DecodedMessage, Message } from "@xmtp/xmtp-js";

function XmtpMessages(props: {
  client: Client;
  messageHistory: DecodedMessage[];
  conversation: Conversation;
}) {
  const { client, messageHistory, conversation } = props;
  const [inputValue, setInputValue] = useState("");

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputValue) {
      await onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Function to handle sending a text message
  const onSendMessage = async (value: string) => {
    return conversation.send(value);
  };

  // Function to handle input change (keypress or change event)
  const handleInputChange = (event: any) => {
    if (event.key === "Enter") {
      handleSend();
    } else {
      setInputValue(event.target.value);
    }
  };
  return (
    <div className={"flex flex-col w-full"}>
      <div className={"flex"}>
        <MessageList messages={messageHistory} client={client} />
      </div>
      <div className={"flex mt-4 gap-2 w-full"}>
        <input
          type="text"
          className={"input flex-1 text-white"}
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <button className={"btn btn-primary text-xl"} onClick={handleSend}>
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default XmtpMessages;

// MessageList component to render the list of messages
const MessageList = (props: { messages: DecodedMessage[]; client: Client }) => {
  const { messages, client } = props;
  // Filter messages by unique id
  const messagesToShow = messages.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  );

  return (
    <div className="w-full h-96 bg-white p-5 rounded-lg overflow-scroll">
      <ul className="messageList">
        {messagesToShow.map((message, index) => (
          <>
            <li
              key={message.id}
              className="messageItem"
              title="Click to log this message to the console"
            >
              <strong>
                {message.senderAddress === client.address ? (
                  <div className="chat chat-end text-black">
                    <div className="chat-header">
                      You{" "}
                      <time className="text-xs opacity-50">
                        ({message.sent.toLocaleTimeString()})
                      </time>
                    </div>
                    <div className="chat-bubble bg-blue-400 text-white">
                      {message.content}{" "}
                      <span
                        className="eyes"
                        onClick={() => console.log(message)}
                      >
                        👀
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="chat chat-start text-black">
                    <div className="chat-header">
                      You{" "}
                      <time className="text-xs opacity-50">
                        ({message.sent.toLocaleTimeString()})
                      </time>
                    </div>
                    <div className="chat-bubble bg-base-200 text-white">
                      {message.content}{" "}
                      <span
                        className="eyes"
                        onClick={() => console.log(message)}
                      >
                        👀
                      </span>
                    </div>
                  </div>
                )}
              </strong>
            </li>
          </>
        ))}
      </ul>
    </div>
  );
};
