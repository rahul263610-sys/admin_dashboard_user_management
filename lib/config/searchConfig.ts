export const searchConfig: Record<string, { placeholder: string; filterType?: "users" | "blogs" }> = {
  users: {
    placeholder: "Search users...",
    filterType: "users",
  },
  blogs: {
    placeholder: "Search blogs...",
    filterType: "blogs",
  },
};
