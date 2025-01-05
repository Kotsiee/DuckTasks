// deno-lint-ignore-file no-explicit-any
import { fetchUsers } from '../lib/api/userApi.ts';
import { FreshContext } from '$fresh/server.ts';
import { PageProps } from '$fresh/server.ts';
import { User } from "../lib/types/index.ts";

export const handler = {
  async GET(_req: any, ctx: FreshContext){
    const project = await fetchUsers();

    if (!project) {
      return ctx.renderNotFound({
        message: "Project does not exist",
      });
    }
    
    return ctx.render(project);
  }
}

export default function Home(props: PageProps<User[]>) {
  return (
    <div class="home">
      <img src={props.data[0].profilePicture as string}/>
    </div>
  );
}
