import { PageProps } from '$fresh/server.ts';
import { useUser } from "../components/UserContext.tsx";
import Test from "../islands/Test.tsx";
import { User } from "../lib/types/index.ts";

export default function Home() {
  const user: User | null = useUser();
  
  return (
    <div class="home">
      <h1>Home</h1>
      <h1>{user?.id}</h1>
      <Test />
    </div>
  );
}
