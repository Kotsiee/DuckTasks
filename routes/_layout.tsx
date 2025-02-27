import { PageProps } from "$fresh/server.ts";
import { UserProvider } from "../components/UserContext.tsx";
import NavBar from "../islands/Navbar.tsx";
import { fetchUser } from "../lib/types/index.ts";

export default function Layout(pageProps: PageProps) {
  const user = fetchUser(pageProps)
  
  return (
    <UserProvider user={user}>
      <div class="layout">
          <NavBar pageProps={pageProps} user={user}/>
          <div class="body"> <pageProps.Component /> </div>
      </div>
    </UserProvider>
  );
}