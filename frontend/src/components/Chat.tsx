import XmtpChat from "@/features/xmtp/XmtpChat";
import Navbar from "./Navbar";

export default function Chat() {
  return (
    <div className="App min-h-screen">
      <Navbar />
      <div className="m-auto mt-10 w-2/4 flex flex-col gap-10">
        <XmtpChat />
      </div>
    </div>
  );
}
