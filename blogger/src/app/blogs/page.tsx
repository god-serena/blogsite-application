"use client"

import BloggerApi from "@/lib/blogger"
import { Blog, Blogs } from "@/types/blog"
import { useEffect, useState } from "react"
import Image from "next/image"
import Editor from "@/components/Editor"
import { useRouter } from "next/navigation"

export default function BlogsPage() {
    const router = useRouter()
    const [blogsList, setBlogsList] = useState<Blog[]>([])
    const [top, setTop] = useState(0)
    const [loading, setLoading] = useState<boolean>(true)

    async function fetchBlogs(top: number): Promise<Blog[]> {
        try {
            const response = await BloggerApi<Blogs>({
                endpoint: `blog?top=${top}`,
            })
            return response.blogs
        } catch (error) {
            console.error(error)
            return []
        }
    }

    function handleLoadMore() {
        setTop((prev) => (prev += 20))
    }

    function handleSelectedBlog(blogID: number) {
        router.push(`/blogs/${blogID}`)
    }

    useEffect(() => {
        async function getBlogs() {
            const result = await fetchBlogs(top)
            setBlogsList((prev) => {
                const keys = prev.map((blog) => blog.id)
                const updated = result.filter(
                    (fetched) => !keys.includes(fetched.id),
                )
                return [...prev, ...updated]
            })
        }
        setLoading(false)
        getBlogs()
    }, [top])

    if (loading) return <div>Loading...</div>

    return (
        <div className="w-full p-10">
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
                {blogsList?.length > 0 &&
                    blogsList.map((blog: Blog) => (
                        <article
                            key={blog.id}
                            className="flex flex-col items-center justify-between h-[500px] p-5 bg-gray-200 rounded-md w-full hover:bg-gray-300 cursor-pointer"
                            onClick={() => handleSelectedBlog(blog.id)}
                        >
                            <Image
                                src="https://placehold.co/600x400"
                                alt="banner"
                                width={300}
                                height={200}
                                priority
                                unoptimized
                            />
                            <h2 className="text-2xl font-bold mb-2 mt-4 text-center line-clamp-2">
                                {blog.title}
                            </h2>
                            <Editor
                                textOnly
                                truncText
                                initialContent={blog.body}
                                maxLength={200}
                                onChange={() => {}}
                            />
                            <p className="text-sm text-white text-center bg-blue-400 rounded p-2 self-end">
                                {new Date(
                                    blog.updated_at ?? blog.published_at,
                                ).toLocaleDateString()}
                            </p>
                        </article>
                    ))}
            </div>

            <div className="mt-10 flex justify-center">
                <button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Load More
                </button>
            </div>
        </div>
    )
}
