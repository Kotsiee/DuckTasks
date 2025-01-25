// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";
import { Chat, ChatRoles, Messages, User } from "../../lib/types/index.ts";
import { PageProps } from '$fresh/server.ts';
import AIcon, { Icons } from "../../components/Icons.tsx";
import { Signal, useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { createClient, RealtimePostgresChangesPayload } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import { useRef } from 'preact/hooks';
import Textbox from "../../components/Textbox.tsx";

interface IChatMessages {
    supabaseUrl: string;
    supabaseAnonKey: string;
    user: User;
}

export default function ChatMessages(props: { pageProps: PageProps, p: IChatMessages }) {
    const [messages, setMessages] = useState<Messages[]>([]);
    const [chat, setChat] = useState<Chat>();
    const user = props.p.user;

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

    const enterMessage = async (inputMessage: Signal<string>) => {
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

                    <ChatInput enterMessage={(inputMessage) => enterMessage(inputMessage)}/>

                    <div class="modals">
                        
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

    if (props.msg.content.includes('\n'))
        console.log(props.msg.content)

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

                    <p class="content">{ props.msg.content.trim().split('\n').map(p => <>{p}<br/></>) }</p>

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

const ChatInput = ({enterMessage} : {enterMessage: (inputMessage: Signal<string>) => Promise<void>}) => {
    const inputMessage = useSignal<string>('');
    const highlightedText = useSignal<Selection | null>(null);

    const openState = useSignal<boolean>(false);
    const isInitial = useSignal<boolean>(true);

    const defaultVal = "Select Item";
    const addHover = useSignal<string>(defaultVal);

    const addOpen = useRef<AIcon>();
    const container = useRef<HTMLDivElement>(null);

    document.documentElement.style.setProperty("--footer-hight", `${(container.current?.parentElement?.scrollHeight || 120) + 50}px` || "160px");
    
    return (
        <div class="chat-input">
            <div class="container">
                <div class="advanced-text-area">
                    <ul className="text-style">
                        <li className="bold">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                        <li className="italic">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                        <li className="underline">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                        <li className="strikethrough">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                    </ul>

                    <ul className="list-style">
                        <li className="bullet">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                        <li className="numbered">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                        <li className="toggle">
                            <AIcon startPaths={Icons.Filter}/>
                        </li>
                    </ul>
                </div>

                <div ref={container} class="chat-input-text">
                    <AIcon ref={addOpen} startPaths={Icons.Plus} endPaths={Icons.X} className="additional-btn" size={20} 
                    onClick={() => {openState.value = !openState.value; isInitial.value = false}}
                    initalState={openState.value}
                    />

                    <div class={`chat-input-additional ${openState.value ? 'show' : isInitial.value ? '' : 'hide'}`}
                    onMouseLeave={() => {
                        addHover.value = defaultVal;
                        addOpen.current?.click()
                    }}>
                        <p class="item-select">{addHover.value}</p>

                        <ul>
                            <li onMouseEnter={() => addHover.value = 'File'}>
                                <AIcon startPaths={Icons.Filter}/>
                            </li>
                            <li onMouseEnter={() => addHover.value = 'Poll'}>
                                <AIcon startPaths={Icons.Filter}/>
                            </li>
                            <li onMouseEnter={() => addHover.value = 'Project'}>
                                <AIcon startPaths={Icons.Filter}/>
                            </li>
                            <li onMouseEnter={() => addHover.value = 'Person'}>
                                <AIcon startPaths={Icons.Filter}/>
                            </li>
                            <li onMouseEnter={() => addHover.value = 'Post'}>
                                <AIcon startPaths={Icons.Filter}/>
                            </li>
                        </ul>
                    </div>

                    <Textbox 
                    text={inputMessage} 
                    highlightedText={highlightedText}
                    class="message-input"
                    placeholder="Type your message..."
                    onSubmit={(e) => {enterMessage(e as Signal<string>)}}

                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "40px";
                        const initialHeight = 40;
                        const newHeight = Math.max(initialHeight, target.scrollHeight);
                        target.style.height = `${newHeight}px`;

                        container.current?.style.setProperty("height", `${newHeight}px`);
                        document.documentElement.style.setProperty("--footer-hight", `${(container.current?.parentElement?.scrollHeight || 120) + 50}px` || "160px");
                        globalThis.scrollTo({ top: globalThis.innerHeight });
                    }}
                    />

                    {/* <textarea
                    class="message-input"
                    placeholder="Type your message..."
                    value={inputMessage.value}
                    onMouseUp={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        const start = target.selectionStart
                        const end = target.selectionEnd

                        highlightedText.value = target.value.substring(start, end);
                        console.log(highlightedText.value)
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "40px";
                        const initialHeight = 40;
                        const newHeight = Math.max(initialHeight, target.scrollHeight);
                        target.style.height = `${newHeight}px`;

                        container.current?.style.setProperty("height", `${newHeight}px`);


                        // Update input value
                        inputMessage.value = target.value;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent newline without Shift
                        }
                    }}
                    onKeyUp={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && inputMessage.value) {
                        enterMessage(inputMessage); // Send the message
                        }
                    }}
                    /> */}

                    <div class="options">
                        <ul>
                            <li>
                                <button className="advanced-text">
                                    <AIcon startPaths={Icons.Filter} className="advanced-text-icon"/>
                                </button>
                            </li>
                            <li>
                                <button className="record-audio">
                                    <AIcon startPaths={Icons.Filter} className="record-icon"/>
                                </button>
                            </li>
                            <li class="message-sent">
                                <button
                                onClick={() => { if (inputMessage.value) enterMessage(inputMessage) }}
                                >
                                    <AIcon startPaths={Icons.Send} className="send-icon"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}