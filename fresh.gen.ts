// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_user_index from "./routes/[user]/index.tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $about_index from "./routes/about/index.tsx";
import * as $account_layout from "./routes/account/_layout.tsx";
import * as $account_forgotpassword from "./routes/account/forgotpassword.tsx";
import * as $account_login from "./routes/account/login.tsx";
import * as $account_signup from "./routes/account/signup.tsx";
import * as $api_account_login from "./routes/api/account/login.ts";
import * as $api_account_user from "./routes/api/account/user.ts";
import * as $api_chats_chatId_chat from "./routes/api/chats/[chatId]/chat.ts";
import * as $api_chats_chatId_messages from "./routes/api/chats/[chatId]/messages.ts";
import * as $api_chats_id_ from "./routes/api/chats/[id].ts";
import * as $api_projects from "./routes/api/projects.ts";
import * as $dashboard_index from "./routes/dashboard/index.tsx";
import * as $explore_layout from "./routes/explore/_layout.tsx";
import * as $explore_index from "./routes/explore/index.tsx";
import * as $explore_people_index from "./routes/explore/people/index.tsx";
import * as $explore_posts_index from "./routes/explore/posts/index.tsx";
import * as $explore_projects_index from "./routes/explore/projects/index.tsx";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $messages_id_attachments_attId_ from "./routes/messages/[id]/attachments/[attId].tsx";
import * as $messages_id_attachments_index from "./routes/messages/[id]/attachments/index.tsx";
import * as $messages_id_index from "./routes/messages/[id]/index.tsx";
import * as $messages_id_info from "./routes/messages/[id]/info.tsx";
import * as $messages_layout from "./routes/messages/_layout.tsx";
import * as $messages_index from "./routes/messages/index.tsx";
import * as $partials_explore_project from "./routes/partials/explore/project.tsx";
import * as $partials_messages_id_ from "./routes/partials/messages/[id].tsx";
import * as $partials_messages_id_attachments_attId_ from "./routes/partials/messages/[id]/attachments/[attId].tsx";
import * as $partials_messages_id_attachments_index from "./routes/partials/messages/[id]/attachments/index.tsx";
import * as $partials_messages_id_index from "./routes/partials/messages/[id]/index.tsx";
import * as $projects_project_chatid_layout from "./routes/projects/[project]/[chatid]/_layout.tsx";
import * as $projects_project_chatid_attachments from "./routes/projects/[project]/[chatid]/attachments.tsx";
import * as $projects_project_chatid_description from "./routes/projects/[project]/[chatid]/description.tsx";
import * as $projects_project_chatid_index from "./routes/projects/[project]/[chatid]/index.tsx";
import * as $projects_project_chatid_info from "./routes/projects/[project]/[chatid]/info.tsx";
import * as $projects_project_chatid_submissions from "./routes/projects/[project]/[chatid]/submissions.tsx";
import * as $projects_project_description from "./routes/projects/[project]/description.tsx";
import * as $projects_project_timeline from "./routes/projects/[project]/timeline.tsx";
import * as $projects_layout from "./routes/projects/_layout.tsx";
import * as $projects_index from "./routes/projects/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $Navbar from "./islands/Navbar.tsx";
import * as $Test from "./islands/Test.tsx";
import * as $Txtbox from "./islands/Txtbox.tsx";
import * as $account_Login from "./islands/account/Login.tsx";
import * as $account_Register from "./islands/account/Register.tsx";
import * as $chat_Attachment from "./islands/chat/Attachment.tsx";
import * as $chat_Attachments from "./islands/chat/Attachments.tsx";
import * as $chat_ChatLayout from "./islands/chat/ChatLayout.tsx";
import * as $chat_ChatMessages from "./islands/chat/ChatMessages.tsx";
import * as $chat_ChatResize from "./islands/chat/ChatResize.tsx";
import * as $chat_ChatsList from "./islands/chat/ChatsList.tsx";
import * as $explore_ExploreFilter from "./islands/explore/ExploreFilter.tsx";
import * as $explore_ProjectDetails from "./islands/explore/ProjectDetails.tsx";
import * as $explore_ProjectList from "./islands/explore/ProjectList.tsx";
import * as $profile_profile from "./islands/profile/profile.tsx";
import * as $projects_ProjectChatList from "./islands/projects/ProjectChatList.tsx";
import * as $projects_ProjectsList from "./islands/projects/ProjectsList.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[user]/index.tsx": $_user_index,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/_middleware.ts": $_middleware,
    "./routes/about/index.tsx": $about_index,
    "./routes/account/_layout.tsx": $account_layout,
    "./routes/account/forgotpassword.tsx": $account_forgotpassword,
    "./routes/account/login.tsx": $account_login,
    "./routes/account/signup.tsx": $account_signup,
    "./routes/api/account/login.ts": $api_account_login,
    "./routes/api/account/user.ts": $api_account_user,
    "./routes/api/chats/[chatId]/chat.ts": $api_chats_chatId_chat,
    "./routes/api/chats/[chatId]/messages.ts": $api_chats_chatId_messages,
    "./routes/api/chats/[id].ts": $api_chats_id_,
    "./routes/api/projects.ts": $api_projects,
    "./routes/dashboard/index.tsx": $dashboard_index,
    "./routes/explore/_layout.tsx": $explore_layout,
    "./routes/explore/index.tsx": $explore_index,
    "./routes/explore/people/index.tsx": $explore_people_index,
    "./routes/explore/posts/index.tsx": $explore_posts_index,
    "./routes/explore/projects/index.tsx": $explore_projects_index,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/messages/[id]/attachments/[attId].tsx":
      $messages_id_attachments_attId_,
    "./routes/messages/[id]/attachments/index.tsx":
      $messages_id_attachments_index,
    "./routes/messages/[id]/index.tsx": $messages_id_index,
    "./routes/messages/[id]/info.tsx": $messages_id_info,
    "./routes/messages/_layout.tsx": $messages_layout,
    "./routes/messages/index.tsx": $messages_index,
    "./routes/partials/explore/project.tsx": $partials_explore_project,
    "./routes/partials/messages/[id].tsx": $partials_messages_id_,
    "./routes/partials/messages/[id]/attachments/[attId].tsx":
      $partials_messages_id_attachments_attId_,
    "./routes/partials/messages/[id]/attachments/index.tsx":
      $partials_messages_id_attachments_index,
    "./routes/partials/messages/[id]/index.tsx": $partials_messages_id_index,
    "./routes/projects/[project]/[chatid]/_layout.tsx":
      $projects_project_chatid_layout,
    "./routes/projects/[project]/[chatid]/attachments.tsx":
      $projects_project_chatid_attachments,
    "./routes/projects/[project]/[chatid]/description.tsx":
      $projects_project_chatid_description,
    "./routes/projects/[project]/[chatid]/index.tsx":
      $projects_project_chatid_index,
    "./routes/projects/[project]/[chatid]/info.tsx":
      $projects_project_chatid_info,
    "./routes/projects/[project]/[chatid]/submissions.tsx":
      $projects_project_chatid_submissions,
    "./routes/projects/[project]/description.tsx":
      $projects_project_description,
    "./routes/projects/[project]/timeline.tsx": $projects_project_timeline,
    "./routes/projects/_layout.tsx": $projects_layout,
    "./routes/projects/index.tsx": $projects_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/Navbar.tsx": $Navbar,
    "./islands/Test.tsx": $Test,
    "./islands/Txtbox.tsx": $Txtbox,
    "./islands/account/Login.tsx": $account_Login,
    "./islands/account/Register.tsx": $account_Register,
    "./islands/chat/Attachment.tsx": $chat_Attachment,
    "./islands/chat/Attachments.tsx": $chat_Attachments,
    "./islands/chat/ChatLayout.tsx": $chat_ChatLayout,
    "./islands/chat/ChatMessages.tsx": $chat_ChatMessages,
    "./islands/chat/ChatResize.tsx": $chat_ChatResize,
    "./islands/chat/ChatsList.tsx": $chat_ChatsList,
    "./islands/explore/ExploreFilter.tsx": $explore_ExploreFilter,
    "./islands/explore/ProjectDetails.tsx": $explore_ProjectDetails,
    "./islands/explore/ProjectList.tsx": $explore_ProjectList,
    "./islands/profile/profile.tsx": $profile_profile,
    "./islands/projects/ProjectChatList.tsx": $projects_ProjectChatList,
    "./islands/projects/ProjectsList.tsx": $projects_ProjectsList,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
