import Icon, { Icons } from "../components/Icons.tsx";

export default function NavBar() {
    return (
        <div>
            <link rel="stylesheet" href="/styles/islands/navbar.css" />

            <nav class="nav user-nav">
                <div class="nav-list nav-left">
                    <Icon paths={Icons.X} classs="settingIcon"/>
                    <a href="/">DuckTasks</a>
                </div>

                <div class="nav-list nav-center">
                <div
                    class="box"
                    style={{
                    width: "50px",
                    height: "50px",
                    background: "red",
                    margin: "20px",
                    }}
                />
                </div>

                <div class="nav-list nav-right">
                    <p>heyyy</p>
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
