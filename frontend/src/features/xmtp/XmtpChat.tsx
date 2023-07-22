import React, { useState } from "react";
import { Client, Conversation, DecodedMessage, Message } from "@xmtp/xmtp-js";

function Chat(props: {
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
    <div className={"flex flex-col"}>
      <div className={"flex"}>
        <MessageList messages={messageHistory} client={client} />
      </div>
      <div className={"flex"}>
        <input
          type="text"
          className={"input"}
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <button className={"btn"} onClick={handleSend}>
          &#128073;
        </button>
      </div>
    </div>
  );
}

export default Chat;

// MessageList component to render the list of messages
const MessageList = (props: { messages: DecodedMessage[]; client: Client }) => {
  const { messages, client } = props;
  // Filter messages by unique id
  const messagesToShow = messages.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  );

  return (
    <ul className="messageList">
      {messagesToShow.map((message, index) => (
        <li
          key={message.id}
          className="messageItem"
          title="Click to log this message to the console"
        >
          <strong>
            {message.senderAddress === client.address ? "You" : "Bot"}:
          </strong>
          <span>{message.content}</span>
          <span className="date"> ({message.sent.toLocaleTimeString()})</span>
          <span className="eyes" onClick={() => console.log(message)}>
            👀
          </span>
        </li>
      ))}
    </ul>
  );
};
