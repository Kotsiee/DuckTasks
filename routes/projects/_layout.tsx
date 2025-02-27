import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../../components/UserContext.tsx";
import ChatResize from "../../islands/chat/ChatResize.tsx";
import ProjectsList from "../../islands/projects/ProjectsList.tsx";

export default function Layout(pageProps: PageProps) {
    const user = useUser()

    return (
        <div class="messages-layout" f-client-nav>
            <link rel="stylesheet" href="/styles/pages/messages/messages.css" />
            <div class="chat-list">
                <div class="chat-container">
                    <div class="title">
                        <h3>Projects</h3>
                        <AIcon startPaths={Icons.Search} size={20}/>
                    </div>

                    <ProjectsList pageProps={pageProps} user={user}/>
                </div>
            </div>

            <div class="resize-container">
                <ChatResize />
            </div>
            <div class="chatarea">
                <pageProps.Component />
            </div>
        </div>
  );
}