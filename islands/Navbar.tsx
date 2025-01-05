import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../components/Icons.tsx";
import { useRef } from 'preact/hooks';

export default function NavBar({pageProps}: { pageProps: PageProps }) {
    const currentRoute = pageProps.route.split("/");
    const refs = useRef<{ [key: string]: AIcon | null }>({});
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = (key: string) => {
        refs.current[key]?.click();
    };

    return (
        <div>
            <link rel="stylesheet" href="/styles/islands/navbar.css" />

            <nav>
                <div class="nav user-nav">
                    <div class="nav-list nav-left">
                        <AIcon 
                        ref={(el) => (refs.current['r'] = el)} 
                        className="navMenuIcon"
                        startPaths={Icons.Menu} endPaths={Icons.X}
                        onClick={(state) => {
                            if (state) menuRef.current?.classList.add("hidden");
                            else menuRef.current?.classList.remove("hidden");
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
                        <AIcon ref={(el) => (refs.current['settings-btn'] = el)} className="settings-btn" startPaths={Icons.Settings}/>
                    </div>
                </div>

                <div class="user-nav-popout">
                    <div ref={menuRef} class="container hidden">
                        <ul>
                            <li class={`${(currentRoute[1] == "dashboard" ? "active" : "")} nav-btn-link`}>
                                <a href="/dashboard">Dashboard</a>
                            </li>
                            <li class={`${(currentRoute[1] == "messages" ? "active" : "")} nav-btn-link`}>
                                <a href="/messages">Messages</a>
                            </li>
                        </ul>

                        <hr/>

                        <ul>
                            <li class={`${(currentRoute[1] == "explore" ? "active" : "")} nav-btn-explore`}>
                                <p onClick={() => {location.href='/explore'}}>Explore</p>
                                <AIcon ref={(el) => (refs.current['r1'] = el)} className="chevron" startPaths={Icons.DownChevron} endPaths={Icons.UpChevron}/>
                            </li>
                            <li class={`${((currentRoute[1] + "/" + currentRoute[2]) == "explore/projects" ? "active" : "")} nav-btn-link`}>
                                <a href="/explore/projects">Projects</a>
                            </li>
                            <li class={`${((currentRoute[1] + "/" + currentRoute[2]) == "explore/people" ? "active" : "")} nav-btn-link`}>
                                <a href="/explore/people">People</a>
                            </li>
                            <li class={`${((currentRoute[1] + "/" + currentRoute[2]) == "explore/posts" ? "active" : "")} nav-btn-link`}>
                                <a href="/explore/posts">Posts</a>
                            </li>
                        </ul>

                        <hr/>

                        <div class="workspaces">
                            <div class="workspaces-nav">
                                <div class="workspaces-select" onClick={() => handleClick("r2")}>
                                    <p>Main Workspace</p>
                                    <AIcon ref={(el) => (refs.current['r2'] = el)} className="chevron" startPaths={Icons.DownChevron} endPaths={Icons.UpChevron} onClick={(state) => {console.log(state)}}/>
                                </div>

                                <div>
                                    <AIcon ref={(el) => (refs.current['search-btn2'] = el)} className="search-btn" startPaths={Icons.Search}/>
                                </div>
                            </div>

                            <div class="workspaces-projects">
                                <div class="workspaces-projects-viewall">
                                    <a>View All</a>
                                </div>

                                <ul class="workspaces-projects-list">
                                    <li>
                                        <div class="project-details">
                                            <p class="project-name">Web Deisgn</p>
                                            <p class="project-owner">Matillion</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div class="search-popout">

                </div>

                <div class="user-settings-popout">

                </div>
            </nav>

            {/* <nav class="nav guest-nav">
                <ul class="nav-list nav-left">
                    <li class="nav-btn-link logo"><a href="/">DuckTasks</a></li>
                    <li class="nav-btn-link"><a href="/about">About</a></li>
                    <li class="nav-btn-link"><a href="#">Explore</a></li>
                </ul>

                <ul class="nav-list nav-right">
                    <li class="nav-btn-link"><a href="#">News</a></li>
                    <li class="nav-btn-link"><a href="#">Business</a></li>
                    <li class="nav-btn-log btn-login"><a href="/user/login">Log In</a></li>
                    <li class="nav-btn-log btn-signup"><a href="/user/signup">Sign Up</a></li>
                    <li class="nav-btn-link"><Icon paths={Icons.Settings} classs="settingIcon"/></li>
                </ul>
            </nav> */}
        </div>
    );
}
