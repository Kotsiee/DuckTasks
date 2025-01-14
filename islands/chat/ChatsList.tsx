import { useEffect, useState } from "preact/hooks";
import { Skeleton } from "../../components/Skeletons.tsx";
import { Chat } from "../../lib/types/index.ts";
import ChatCard from "../../components/cards/ChatCard.tsx";

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const userID = "1434da34-9820-4eac-b7f1-124a78af6d8c";

  useEffect(() => {
    fetch(`/api/chats/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data.json);
        setLoading(false);
      });
  }, []);

  return (
    <div class="chat-list-container">
      {loading
        ? (
          <Skeleton count={5}>
            <h1>hi</h1>
          </Skeleton>
        )
        : (
          <ul>
            {chats.map((chat, index) => {
              return ( <ChatCard chat={chat} viewerID={userID} /> );
            })}
          </ul>
        )}
    </div>
  );
}
