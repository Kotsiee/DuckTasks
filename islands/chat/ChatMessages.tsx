import { useEffect, useState } from "preact/hooks";
import { supabase } from "../../lib/supabaseClient.ts";
import { Chat, Messages } from "../../lib/types/index.ts";
import { PageProps } from '$fresh/server.ts';

export default function ChatMessages(props: { pageProps: PageProps }) {
    const [messages, setMessages] = useState<Messages[]>([]);
    const [chat, setChat] = useState<Chat>();
    const user = localStorage.getItem('user')

    useEffect(() => {
        let channel: any;

        async function fetchMessages() {
            const res = await fetch(`/api/chats/${props.pageProps.params.id}/chat`);
            const data = await res.json();
            setChat(data.json);

            const res1 = await fetch(`/api/chats/${props.pageProps.params.id}/messages`);
            const data1 = await res1.json();
            setMessages(data1.json);

            channel = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    console.log('New Message:', payload.new);
                    setMessages((prevMessages) => [...prevMessages, payload.new as Messages]);

                    setTimeout(() => {
                        globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' });
                    }, 0);
                }
            )
            .subscribe();

            setTimeout(() => {
                globalThis.scrollTo({ top: globalThis.innerHeight });
            }, 0);
        }

        fetchMessages();

        return () => {
            if (channel) channel.unsubscribe();
        };
    }, []);

    return (
        <div class="chat-messages-container">
            {
                chat ? (
                    <div class="chat-header">
                        <div class="chat-header-container">
                            <img class="chat-photo" src={ chat.photo != null ? chat.photo.url : chat.users?.find(u => u.user?.id != user)?.user?.profilePicture?.url || "https://images.unsplash.com/photo-1485893086445-ed75865251e0?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }/>
                            <div>
                                <h5>{ chat.name ? chat.name : chat.users?.find(u => u.user?.id != user)?.user?.username }</h5>
                                <p class="isTyping">is typing...</p>
                            </div>
                        </div>
                    </div>
                ) : (<></>)
            }

            <div class="chat-input">
                <div class="chat-input-additional">

                </div>

                <div class="chat-input-text">
                    <input class="message-input" type="text" placeholder="Type your message..."/>
                </div>
            </div>

            <div class="chat-messages-area">
                <div class="empty">

                </div>
                <ul class="chat-messages-list">
                    {messages?.map((msg, index) => {
                        return ( <ChatMessage msg={msg} userId={user!}/> );
                    })}
                </ul>
            </div>
        </div>
    );
}

const ChatMessage = (props: {msg: Messages, userId: string}) => {
    const isSender = props.msg.user?.user?.id == props.userId

    return(
        <li class="chat-message">
            <div class={isSender ? "isSender" : ""}>
                { !isSender ? 
                    <div class="user">
                        <img src={ props.msg.user?.user?.profilePicture?.url }/>
                        <p> { props.msg.user?.user?.username } </p>
                    </div> : <></>
                }

                <div class="content">{ props.msg.content }</div>
            </div>
        </li>
    )
}