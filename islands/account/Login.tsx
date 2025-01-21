import AIcon, { Icons } from "../../components/Icons.tsx";

export default function LoginIsland(){
    const user = localStorage.getItem('user')
    
    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = await fetch("/api/account/login", {
            method: "POST",
            body: formData,
        });

        data.text()
        .then(uid => {
            console.log(uid)
            localStorage.setItem('user', uid)
        })

        globalThis.history.replaceState({}, '', '/')
        globalThis.window.location.reload()
    }

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