export type Blog = {
    id: number
    title: string
    author_id: number
    banner: object
    body: object
    published_at: string
    updated_at?: string
    author: Author
}

export type Author = {
    full_name: string
    avatar_url: string
}

export type Blogs = {
    blogs: Blog[]
}
