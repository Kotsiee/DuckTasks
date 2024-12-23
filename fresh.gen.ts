// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $about_index from "./routes/about/index.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $user_layout from "./routes/user/_layout.tsx";
import * as $user_login from "./routes/user/login.tsx";
import * as $user_signup from "./routes/user/signup.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Navbar from "./islands/Navbar.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/about/index.tsx": $about_index,
    "./routes/api/joke.ts": $api_joke,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/user/_layout.tsx": $user_layout,
    "./routes/user/login.tsx": $user_login,
    "./routes/user/signup.tsx": $user_signup,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/Navbar.tsx": $Navbar,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
