export type filterOption = {
    label : string;
    value : string | boolean;
}
export type filterItem ={
    key: "filter" | "isDeleted"
    role?: "admin";
    options: filterOption[];
}

export const filterConfig : Record<string, filterItem[]>={
    users: [
        {
            key : "filter",
            options : [
                {label: "All", value: ""},
                {label: "Admin", value: "admin"},
                {label: "User", value: "user"},
            ]
        },
        {
            key : "isDeleted",
            options : [
                {label : "Users", value: false},
                {label : "Deleted User", value: true},
            ]
        }
    ],
    blogs: [
        {
            key: "filter",
            options : [
                { label: "All Categories", value: "" },
                { label: "Tech", value: "tech" },
                { label: "Lifestyle", value: "lifestyle" },
                { label: "Education", value: "education" },
                { label: "Business", value: "business" },
                { label: "Philosophy", value: "philosophy" },
            ]
        },
        {
            key: "isDeleted",
            role: 'admin',
            options: [
                {label: "Blogs", value: false},
                {label : "Deleted Blogs", value: true},
            ]
        }
    ]
}