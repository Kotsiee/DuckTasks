import { PageProps } from "$fresh/server.ts";
import NavBar from "../islands/Navbar.tsx";

export default function Layout({ Component, state }: PageProps) {
  // do something with state here
  return (
    <div class="layout">
        <link rel="stylesheet" href="/styles/islands/navbar.css" />
        <NavBar/>
        <div class="body"> <Component /> </div>
    </div>
  );
}