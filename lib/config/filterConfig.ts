export type filterOption = {
    label : string;
    value : string | boolean;
}
export type filterItem ={
    key: "filter";
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
        }
    ]
}