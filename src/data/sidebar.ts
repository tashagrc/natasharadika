import { LuUser, LuWrench, LuNewspaper } from "react-icons/lu";

export const sidebar = {
  userName: `[Your Name]`,
  profileImage: `https://github.com/shadcn.png`,
  sections: [
    {
      title: `About Me`,
      url: ``,
      icon: LuUser
    },
    {
      title: `Projects`,
      url: `projects`,
      icon: LuWrench
    },
    {
      title: `Articles`,
      url: `articles`,
      icon: LuNewspaper
    }
  ]
};