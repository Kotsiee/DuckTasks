import { PageProps } from "$fresh/server.ts";
import NavBar from "../islands/Navbar.tsx";

export default function Layout(pageProps: PageProps) {
  // do something with state here
  return (
    <div class="layout">
        <NavBar pageProps={pageProps}/>
        <div class="body"> <pageProps.Component /> </div>
    </div>
  );
}