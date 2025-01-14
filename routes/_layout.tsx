import { PageProps } from "$fresh/server.ts";
import NavBar from "../islands/Navbar.tsx";

export default function Layout(pageProps: PageProps) {
  return (
    <div class="layout">
        <NavBar pageProps={pageProps}/>
        <div class="body"> <pageProps.Component /> </div>
    </div>
  );
}