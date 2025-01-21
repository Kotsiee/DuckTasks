// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";
import { supabase } from "../../lib/supabase/client.ts";
import { Chat, Messages, User } from "../../lib/types/index.ts";
import { PageProps } from '$fresh/server.ts';
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export default function ChatMessages(props: { pageProps: PageProps }) {
    const [messages, setMessages] = useState<Messages[]>([]);
    const [chat, setChat] = useState<Chat>();
    const userId = localStorage.getItem('user');
    const [user, setUser] = useState<User>();
    const inputMessage = useSignal<string>('');

    useEffect(() => {
        let channel: any;

        async function fetchMessages() {
            const res = await fetch(`/api/chats/${props.pageProps.params.id}/chat`);
            const data = await res.json();
            const thisChat: Chat = data.json
            setChat(thisChat);
            setUser(thisChat?.users?.find(u => u.user?.id == userId)?.user!)
            

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

    const enterMessage = () => {
        const newMessage: Messages = {
            content: inputMessage.value,
            sentAt: DateTime.now(),
            chat: chat!,
            user: null
        }

        setMessages((prevMessages) => [...prevMessages, newMessage as Messages]);
        inputMessage.value = ''

    }

    const getChatInfo = (type: 'photo' | 'name') => {
        if (!chat)
            return '';

        const otherUser = chat.users!.find(u => u.user?.id != userId)?.user!; 

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
                                return ( <ChatMessage msg={msg} userId={user!.id}/> );
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