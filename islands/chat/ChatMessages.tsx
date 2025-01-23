// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";
import { Chat, ChatRoles, Messages, User } from "../../lib/types/index.ts";
import { PageProps } from '$fresh/server.ts';
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { createClient, RealtimePostgresChangesPayload } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import { fetchChatByID } from "../../lib/api/chatApi.ts";

interface IChatMessages {
    supabaseUrl: string;
    supabaseAnonKey: string;
    user: User;
}

export default function ChatMessages(props: { pageProps: PageProps, p: IChatMessages }) {
    const [messages, setMessages] = useState<Messages[]>([]);
    const [chat, setChat] = useState<Chat>();
    const user = props.p.user;
    const inputMessage = useSignal<string>('');

    const supabase = createClient(props.p.supabaseUrl, props.p.supabaseAnonKey);

    useEffect(() => {
        let channel: any;
        async function fetchMessages() {

            const res = await fetch(`/api/chats/${props.pageProps.params.id}/chat`);
            const data = await res.json();
            const thisChat: Chat = data.json
            setChat(thisChat);

            const res1 = await fetch(`/api/chats/${props.pageProps.params.id}/messages`, {method: 'GET'});
            const data1 = await res1.json();
            setMessages(data1.json);

            channel = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                async (payload) => {

                    const res = await fetch(`/api/chats/${props.pageProps.params.id}/chat`);
                    const data = await res.json();
                    const c: Chat = data.json

                    handleSubscription(payload, c)

                    setTimeout(() => {
                        globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' });
                    }, 0);
                }
            )
            .subscribe();

            // Handle reconnect attempts
            channel.on("close", () => {
                console.warn("Subscription closed, attempting to reconnect...");
                setTimeout(() => {
                supabase.channel("public:messages").subscribe();
                }, 5000); // Reconnect after 5 seconds
            });

            setTimeout(() => {
                globalThis.scrollTo({ top: globalThis.innerHeight });
            }, 0);
        }

        fetchMessages();

        return () => {
            if (channel) channel.unsubscribe();
        };
    }, []);

    const handleSubscription = (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>, c: Chat) => {
        switch (payload.eventType) {
            case "INSERT":
                setMessages((prevMessages) => [...prevMessages, message(payload.new as Messages, c)]);
                break;
            case "UPDATE":
                setMessages((prevMessages) => prevMessages.map((message) => 
                    message.id === (payload.new as Messages).id ? { ...message, content: (payload.new as Messages).content } : message ));
                break;
            case "DELETE":
                setMessages((prevMessages) => prevMessages.filter((message) => message.id !== (payload.old as Messages).id));
                break;
        }

    }

    const message = (msg: any, c?: Chat): Messages => {
        const cht = chat? chat : c

        return ({
            id: msg.id,
            user: cht?.users?.find(u => u.user?.id == msg.user_id) as ChatRoles | null ||
            msg.user || 
            cht?.users?.find(u => u.user?.id == msg.user?.id) as ChatRoles | null,
            chat: cht as Chat | null,
            content: msg.content,
            attachments: msg.attachments,
            sentAt: msg.sentAt
        })
    }

    const enterMessage = async () => {
        const id = `msg-${messages.length}`

        const newMessage: Messages = {
            id: id,
            content: inputMessage.value,
            sentAt: DateTime.now(),
            user: chat?.users?.find(u => u.user?.id == user.id) as ChatRoles
        }

        setMessages((prevMessages) => [...prevMessages, message(newMessage as Messages) ]);

        inputMessage.value = ''

        const loadedMessage = await fetch(`/api/chats/${props.pageProps.params.id}/messages`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(message(newMessage as Messages)),
        });
        
        if (loadedMessage) {
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
        }
    }

    const getChatInfo = (type: 'photo' | 'name') => {
        if (!chat)
            return '';

        const otherUser = chat.users!.find(u => u.user?.id != user.id)?.user!; 

        switch (type) {
            case 'photo':
                return chat.photo != null ? chat.photo.url : otherUser?.profilePicture?.url;
            case 'name': 
                return chat.name ? chat.name : otherUser?.username;
        }
    }

    return (
        <div class="chat-messages-container">
            { chat ? (
                <div>
                    <div class="chat-header">
                        <div class="chat-header-container">
                            <div class="left">
                                <img class="chat-photo" src={ getChatInfo('photo') }/>
                                <div>
                                    <h6>{ getChatInfo('name') }</h6>
                                    <p class="isTyping">is typing...</p>
                                </div>
                            </div>
                        
                            <div class="center">
                                <SelectView />
                            </div>

                            <div class="right">
                                <AIcon className="chatmenu" startPaths={Icons.DotMenu} size={20}/>
                            </div>
                        </div>
                    </div>
                

                    <div class="chat-input">
                        <div class="chat-input-text">
                            <AIcon startPaths={Icons.Plus} className="additional-btn" size={20}/>

                            <div class="chat-input-additional" hidden>
                                <ul>
                                    <li>File</li>
                                    <li>Poll</li>
                                    <li>Project</li>
                                    <li>Person</li>
                                    <li>Post</li>
                                </ul>
                            </div>

                            <input 
                            class="message-input" 
                            type="text" 
                            placeholder="Type your message..."
                            value={inputMessage.value}
                            onInput={(e) => inputMessage.value = (e.target as HTMLInputElement).value}
                            onKeyUp={(key) => { if (key.key == 'Enter' && inputMessage.value) enterMessage() }}
                            />

                            <button 
                            class="message-sent"
                            onClick={() => { if (inputMessage.value) enterMessage() }}
                            ><AIcon startPaths={Icons.Send} className="send-icon"/></button>
                        </div>
                    </div>

                    <div class="chat-messages-area">
                        <div class="empty">
                            <div><img class="chat-messages-photo" src={ getChatInfo('photo') }/></div>
                            <div><p>&#9432; Chat Info</p></div>
                        </div>
                        <ul class="chat-messages-list">
                            {messages?.map((msg, index) => {
                                return ( <ChatMessage msg={msg} userId={user!.id} prevUID={messages[index-1]?.user?.user?.id}/> );
                            })}
                        </ul>
                    </div>
                    
                </div>
            )
            : (<></>)
        }
        </div>
    );
}

const ChatMessage = (props: {msg: Messages, userId: string, prevUID?: string}) => {
    const isSender = props.msg.user?.user?.id == props.userId
    console.log(props.prevUID)

    return(
        <li class="chat-message">
            <div class={isSender ? "isSender" : ""}>
                { !isSender && props.prevUID == props.userId ? 
                    <div class="user">
                        <img src={ props.msg.user?.user?.profilePicture?.url }/>
                        <p> { props.msg.user?.user?.username } </p>
                    </div> : <></>
                }

                <div class="message">
                    <div class={`options ${isSender ? 'active' : ''}`}>
                        <AIcon className="option-icon reply" startPaths={Icons.Filter}/>
                        <AIcon className="option-icon menu" startPaths={Icons.DotMenu}/>
                    </div>

                    <p class="content">{ props.msg.content }</p>

                    <div class={`options ${!isSender ? 'active' : ''}`}>
                        <AIcon className="option-icon menu" startPaths={Icons.DotMenu}/>
                        <AIcon className="option-icon reply" startPaths={Icons.Filter}/>
                    </div>
                </div>
            </div>
        </li>
    )
}

const SelectView = () => {
    return(
        <div class="select-view">
            <p>Chat</p>

            <div class="lines-container">
                <div class="lines">
                    <input type="radio" class="select-view-input" name="select-view-input" id="select-view-input-chat" hidden checked/>
                    <label for="select-view-input-chat"/>
                    <input type="radio" class="select-view-input" name="select-view-input" id="select-view-input-files" hidden/>
                    <label for="select-view-input-files"/>
                    <input type="radio" class="select-view-input" name="select-view-input" id="select-view-input-info" hidden/>
                    <label for="select-view-input-info"/>
                </div>
            </div>
        </div>
    )
}