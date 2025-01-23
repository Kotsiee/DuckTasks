import { PageProps } from "$fresh/server.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import AIcon, { Icons } from "../components/Icons.tsx";
import { useRef } from 'preact/hooks';
import { User } from "../lib/types/index.ts";

export default function NavBar({pageProps, user}: { pageProps: PageProps, user: User | null }) {

    const navbarState = localStorage.getItem('navbarState') == "open";
    const openState = useSignal<boolean>(navbarState);

    const currentRoute = pageProps.route.split("/");
    const refs = useRef<{ [key: string]: AIcon | null }>({});
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = (key: string) => {
        refs.current[key]?.click();
    };

    const signOut = () => {
        localStorage.removeItem('user')
        globalThis.window.location.reload()
    }

    return (
        <div>
            <link rel="stylesheet" href="/styles/islands/navbar.css" />
            <style>
            {`
                :root { --header-side-width-desktop: ${navbarState ? 300 : 60 }px; }
            `}
            </style>

            {
                user ? (
                
                <nav>
                    <div class="nav user-nav">
                        <div class="nav-list nav-left">
                            <AIcon 
                            ref={(el) => (refs.current['r'] = el)} 
                            className="navMenuIcon"
                            size={16}
                            startPaths={Icons.Menu} endPaths={Icons.X}
                            initalState={navbarState}
                            onClick={(state) => {
                                if (state) {
                                    menuRef.current?.classList.add("hidden");
                                    document.documentElement.style.setProperty('--header-side-width-desktop', '76px');
                                    localStorage.setItem('navbarState', 'closed')
                                }
                                else{
                                    menuRef.current?.classList.remove("hidden");
                                    document.documentElement.style.setProperty('--header-side-width-desktop', '300px');
                                    localStorage.setItem('navbarState', 'open')
                                }
    
                                openState.value = !state
                            }}
                            />
                            <a href="/">DuckTasks</a>
                        </div>
    
                        <div class="nav-list nav-center">
                            <div class="nav-search">
                                <AIcon ref={(el) => (refs.current['search-btn'] = el)} className="search-btn" startPaths={Icons.Search}/>
                                <input class="search-input" type="text"/>
                                <div class="search-type" onClick={() => handleClick("r0")}>
                                    <p>People</p>
                                    <AIcon ref={(el) => (refs.current['r0'] = el)} size={20} className="chevron" startPaths={Icons.DownChevron} endPaths={Icons.UpChevron}/>
                                </div>
                            </div>
                        </div>
    
                        <div class="nav-list nav-right">
                            <div class="user-options">
                                <img class="profilePic" src={user?.profilePicture?.url}/>

                                <div class="popout" hidden>
                                    <div>
                                        <div class='top'>

                                            <div class="switch-account">
                                                <div class="details">
                                                    <img class="profilePic" src={user?.profilePicture?.url}/>
                                                    
                                                    <div class="account">
                                                        <p class="username">{user?.username}</p>
                                                        <p class="type">Personal Account</p>
                                                    </div>
                                                </div>
                                                
                                                <AIcon ref={(el) => (refs.current['r1'] = el)} className="chevron" startPaths={Icons.DownChevron} endPaths={Icons.UpChevron}/>
                                            </div>

                                            <AIcon ref={(el) => (refs.current['settings-btn-2'] = el)} className="settings-btn" startPaths={Icons.Settings}/>

                                        </div>

                                        <div class="user-details">
                                            <p class="name">{`${user?.firstName} ${user?.lastName}`}</p>
                                            <p class="username">@{user?.username}</p>
                                        </div>
                                    </div>

                                    <div class="options">
                                        <hr/>

                                        <ul>
                                            <li class="option">Profile</li>
                                            <li class="option">Network</li>
                                            <li class="option">Teams</li>
                                            <li class="option">History</li>
                                            <li class="option">Help</li>
                                        </ul>

                                        <hr/>

                                        <p class="option" onClick={() => signOut()}>Sign Out</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="user-nav-side">
                        <div class="container">
                            <ul>
                                <li class={`${(currentRoute[1] == "dashboard" ? "active" : "")} nav-btn-link`}>
                                    <a href="/dashboard"><AIcon startPaths={Icons.Filter}/></a>
                                    <label hidden={openState.value}>Dashboard</label>
                                </li>
                                <li class={`${(currentRoute[1] == "messages" ? "active" : "")} nav-btn-link`}>
                                    <a href="/messages"><AIcon startPaths={Icons.Filter}/></a>
                                    <label hidden={openState.value}>Messages</label>
                                </li>
                                <li class={`${(currentRoute[1] == "explore" ? "active" : "")} nav-btn-link`}>
                                    <a href="/explore"><AIcon startPaths={Icons.Filter}/></a>
                                    <label hidden={openState.value}>Explore</label>
                                </li>
                                <li class={`${(currentRoute[1] == "projects" ? "active" : "")} nav-btn-link`}>
                                    <a href="/projects"><AIcon startPaths={Icons.Filter}/></a>
                                    <label hidden={openState.value}>Projects</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                
                    <div class="search-modal">
    
                    </div>

                    <div class="settings-modal">
                        
                    </div>

                    <div class="signout-modal">
                        
                    </div>
                </nav>
                
                ) : (
                
                <nav class="nav guest-nav">
                    <ul class="nav-list nav-left">
                        <li class="nav-btn-link logo"><a href="/">DuckTasks</a></li>
                        <li class="nav-btn-link"><a href="/about">About</a></li>
                        <li class="nav-btn-link"><a href="#">Explore</a></li>
                    </ul>
    
                    <ul class="nav-list nav-right">
                        <li class="nav-btn-link"><a href="#">News</a></li>
                        <li class="nav-btn-link"><a href="#">Business</a></li>
                        <li class="nav-btn-log btn-login"><a href="/user/account/login">Log In</a></li>
                        <li class="nav-btn-log btn-signup"><a href="/user/account/signup">Sign Up</a></li>
                        <li class="nav-btn-link"></li>
                    </ul>
                </nav>

                )
            }
        </div>
    );
}