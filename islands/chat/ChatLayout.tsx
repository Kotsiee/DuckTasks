import { useEffect, useState } from "preact/hooks";
import { Chat, User } from "../../lib/types/index.ts";
import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";

export default function ChatLayout(props: {
  pageProps: PageProps;
  user: User | null;
}) {
  const [chat, setChat] = useState<Chat>();
  const user = props.user;

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/chats/${props.pageProps.params.id}/chat`);
      const data = await res.json();
      const thisChat: Chat = data.json;
      setChat(thisChat);
    }

    fetchMessages();
  }, []);

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
  else return <></>;
}

const SelectView = (props: { chat: string }) => {
  return (
    <div class="select-view">
      <p>Chat</p>

      <div class="lines-container">
        <div class="lines">
          <a
            class="select-view-input"
            href={`/messages/${props.chat}`}
            f-partial={`/partials/messages/${props.chat}`}
          >
          </a>

          <a
            class="select-view-input"
            href={`/messages/${props.chat}/attachments`}
            f-partial={`/partials/messages/${props.chat}/attachments`}
          >
          </a>

          <a
            class="select-view-input"
            href={`/messages/${props.chat}/info`}
            f-partial={`/partials/messages/${props.chat}/info`}
          >
          </a>
        </div>
      </div>
    </div>
  );
};
