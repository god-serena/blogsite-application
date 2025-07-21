"use client"

import { useState } from "react"
import BloggerApi from "@/lib/blogger"
import Editor from "@/components/Editor"
import { useRouter } from "next/navigation"
import { Blog } from "@/types/blog"

export default function BlogCreate() {
    const router = useRouter()
    const [blogTitle, setBlogTitle] = useState<string>("")
    const [initialBlogBody, setInitialBlogBody] = useState<object | null>({
        ops: [
            {
                insert: "\n",
            },
        ],
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [finalBlogBody, setFinalBlogBody] = useState<object | null>(null)

    async function handleCreate() {
        setLoading(true)
        try {
            const response = await BloggerApi<{
                blog: Omit<Blog, "author">
            }>({
                endpoint: `blog/create`,
                method: "POST",
                payload: {
                    title: blogTitle,
                    body: finalBlogBody,
                    banner: null,
                },
            })
            setBlogTitle("")
            setInitialBlogBody(null)
            router.push(`/blogs/${response.blog.id}`)
        } catch (e) {
            console.error("Blog creation failed:", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-10 py-8 bg-gray-200 rounded-md h-auto">
            <h1 className="text-3xl font-bold mb-4">Create New Blog</h1>

            <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                    Title
                </label>
                <input
                    type="text"
                    className="w-full bg-gray-200 rounded-md border-gray-400 shadow-sm text-gray-900
                focus:outline-none self-center h-[40px] p-2.5"
                    placeholder="Enter blog title..."
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                />
            </div>

            <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                    Content
                </label>
                <div className="overflow-auto">
                    <Editor
                        textOnly={false}
                        initialContent={initialBlogBody}
                        onChange={(e: object) => setFinalBlogBody(e)}
                    />
                </div>
            </div>

            <button
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleCreate}
            >
                {loading ? "Saving..." : "Create Blog"}
            </button>
        </div>
    )
}
