import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import ChatMessages from "../../../islands/chat/ChatMessages.tsx";

export default function Convo(props: PageProps) {
    return (
        <div class="chat">
            <Partial name="convo-messages">
                <ChatMessages pageProps={props}/>
            </Partial>
        </div>
    );
}