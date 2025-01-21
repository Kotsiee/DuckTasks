import { PageProps } from '$fresh/server.ts';
import { User } from "../lib/types/index.ts";

export default function Home(props: PageProps<User[]>) {
  return (
    <div class="home">
      <h1>Home</h1>
    </div>
  );
}
