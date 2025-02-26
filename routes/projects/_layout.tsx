import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../../components/UserContext.tsx";
import ChatResize from "../../islands/chat/ChatResize.tsx";
import ChatList from "../../islands/chat/ChatsList.tsx";
import { User } from "../../lib/types/user.ts";

export default function Layout(pageProps: PageProps) {
    const user: User | null = useUser();

    return (
        <div class="messages-layout" f-client-nav>
            <link rel="stylesheet" href="/styles/pages/messages.css" />
            <div class="chat-list">
                <div class="chat-container">
                    <div class="title">
                        <h3>Projects</h3>
                        <AIcon startPaths={Icons.Search} size={20}/>
                    </div>

                    <ChatList userID={user!.id}/>
                </div>
            </div>

            <div class="resize-container">
                <ChatResize />
            </div>
            <div class="chatarea"><pageProps.Component /> </div>
        </div>
  );
}