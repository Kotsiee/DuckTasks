import { useEffect, useState } from "preact/hooks";
import { Chat, User } from "../../lib/types/index.ts";
import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";

export default function ChatLayout({pageProps, user}: { pageProps: PageProps; user: User | null;}) {
  const [chat, setChat] = useState<Chat>();

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/chats/${pageProps.params.id}/chat`);
      const data = await res.json();
      const thisChat: Chat = data.json;
      setChat(thisChat);
    }

    fetchMessages();
  }, [pageProps.params.id]);

  const getChatInfo = (type: "photo" | "name") => {
    if (!chat || !user) return "";

    const otherUser = chat.users!.find((u) => u.user?.id != user.id)?.user!;

    switch (type) {
      case "photo":
        return chat.photo != null
          ? chat.photo.url
          : otherUser?.profilePicture?.url;
      case "name":
        return chat.name ? chat.name : otherUser?.username;
    }
  };

  if (chat)
    return (
      <div class="chat-header">
        <div class="chat-header-container">
          <div class="left">
            <img class="chat-photo" src={getChatInfo("photo")} />
            <div>
              <h6>{getChatInfo("name")}</h6>
              <p class="isTyping">is typing...</p>
            </div>
          </div>

          <div class="center">
            <SelectView chat={chat.id} />
          </div>

          <div class="right">
            <AIcon className="chatmenu" startPaths={Icons.DotMenu} size={20} />
          </div>
        </div>
      </div>
    );
    
  return <></>;
}

const SelectView = ({chat}: { chat: string }) => {

  let title = 'Chat'
  switch (globalThis.location.href.split(`${chat}/`)[1]){
    case 'attachments': title = "Attachments"; break;
    case 'info': title = "Chat Info"; break;
  }

  return (
    <div class="select-view">
      <p>{title}</p>

      <div class="lines-container">
        <div class="lines">
          <a
            class="select-view-input"
            href={`/messages/${chat}`}
            f-partial={`/partials/messages/${chat}`}
          >
          </a>

          <a
            class="select-view-input"
            href={`/messages/${chat}/attachments`}
            f-partial={`/partials/messages/${chat}/attachments`}
          >
          </a>

          <a
            class="select-view-input"
            href={`/messages/${chat}/info`}
            f-partial={`/partials/messages/${chat}/info`}
          >
          </a>
        </div>
      </div>
    </div>
  );
};
