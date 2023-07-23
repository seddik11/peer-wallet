import { useRouter } from "next/router";
import Card from "./Card";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import truncateAddress from "@/utils/truncateAddress";

const chats = ["0x937C0d4a6294cdfa575de17382c7076b579DC176"];

const ChatsList = () => {
  const router = useRouter();
  return (
    <div>
      <div>Chats</div>
      <div className="mt-2 mb-10 gap-4 flex flex-col">
        {chats.map((address) => (
          <div
            className="cursor-pointer"
            key={address}
            onClick={() => router.push(`/chat/${address}`)}
          >
            <Card>
              <div className="flex gap-4 items-center">
                <div className="text-primary w-12">
                  <UserCircleIcon className="w-12" />
                </div>
                <div className="flex-1">
                  <div className="font-bold"> Governance Vote: {truncateAddress(address)}</div>
                  {/* <div>
                    {truncateAddress(
                      namespaces.eip155.accounts[0].split(":").splice(-1)[0]
                    )}
                  </div> */}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsList;
