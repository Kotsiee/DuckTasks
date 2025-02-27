import AIcon, { Icons } from "../../components/Icons.tsx";
import type { User } from "../../lib/types/index.ts";

export default function LoginIsland(){

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await fetch("/api/account/login", {
            method: "POST",
            body: formData,
            credentials: "include", // Ensure cookies are sent & received
        });

        // const user = await response.text();

        // if (user) {
        //     let usr = null
        //     try {
        //         usr = (JSON.parse(user) as User);
        //       } catch (error) {
        //         console.error("Error parsing user from localStorage:", error);
        //     }
        //     console.log("User ID:", usr?.id);

        //     // Set the `userID` in a **cookie**
        //     document.cookie = `user=${usr?.id}; Path=/; Secure; HttpOnly; SameSite=Strict;`;

        //     // Redirect and refresh
        //     // globalThis.history.replaceState({}, "", "/");
        //     // globalThis.window.location.reload();
        // }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div class="input">
                <div class="container">

                    <div class="email text">
                        <div class="container-1">
                        <p>Email</p>
                        <input name='email' type='email' autocomplete='email' placeholder='example@email.com'/>
                        </div>
                    </div>

                    <div class="password text">
                        <div class="container-1">
                        <p>Password</p>
                        <input name='password' type='password' autocomplete='current-password' placeholder='********'/>
                        </div>
                    </div>

                    <div class="additional">
                        <div class="container-2">
                        <div class="remeberme">
                            <input type='checkbox' id="remember" hidden/>
                            <label for="remember">
                            <AIcon className="check" startPaths={Icons.Tick} size={16}/>
                            Remember me
                            </label>
                        </div>
                        
                        <a href="/user/account/forgotpassword">Forgot Password?</a>
                        </div>
                    </div>

                </div>
            </div>

            <button type='submit' class="enter">Log In</button>
        </form>
    )
}