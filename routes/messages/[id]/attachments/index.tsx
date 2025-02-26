//Conversations
import { PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { useUser } from "../../../../components/UserContext.tsx";
import Attachments from "../../../../islands/chat/Attachments.tsx";

export default function Conversations(props: PageProps) {
    const user = useUser();

    return (
        <Partial name="convo-messages">
            <Attachments/>
        </Partial>
    );
}