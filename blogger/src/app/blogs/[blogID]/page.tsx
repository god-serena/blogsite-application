"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Blog, Author } from "@/types/blog"
import BloggerApi from "@/lib/blogger"
import Editor from "@/components/Editor"

export default function BlogDetails() {
    const params = useParams()
    const searchQuery = useSearchParams()
    const { blogID } = params

    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isEditing, setIsEditing] = useState<boolean>(
        searchQuery.get("edit") === "true",
    )
    const [blogBody, setBlogBody] = useState<object | null>(null)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    async function fetchBlog(): Promise<Blog | null> {
        try {
            const response = await BloggerApi<{
                blog: Omit<Blog, "author">
                author: Author
            }>({
                endpoint: `blog/${blogID}`,
            })

            const fullBlog: Blog = {
                ...response.blog,
                author: response.author,
            }

            return fullBlog
        } catch (e) {
            console.error(e)
            return null
        }
    }

    async function handleSave() {
        try {
            setIsSaving(true)
            await BloggerApi<Blog>({
                endpoint: `blog/update/${blogID}`,
                method: "PATCH",
                payload: {
                    body: blogBody,
                },
            })
            const result = await fetchBlog()
            setBlog(result)
            if (result) setBlogBody(result.body)
            setIsSaving(false)
            setIsEditing(false)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        async function getBlog() {
            const result: Blog | null = await fetchBlog()
            setBlog(result)
            if (result) setBlogBody(result.body)
            setLoading(false)
        }
        getBlog()
    }, [])

    if (loading) return <div>Loading...</div>
    if (!blog) return <div>No blog found.</div>

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-200 rounded-md h-[850px]">
            <div className="flex gap-10 p-5 justify-between">
                <div className="m-auto self-center">
                    <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <Image
                            src="/user.svg"
                            alt={blog.author.full_name}
                            width={68}
                            height={68}
                            className="rounded-full"
                        />
                        <div>
                            <p className="font-semibold">
                                {blog.author.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {blog?.updated_at
                                    ? "Updated at "
                                    : "Published on "}
                                {new Date(
                                    blog?.updated_at ?? blog.published_at,
                                ).toDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                <Image
                    src="https://placehold.co/600x400"
                    alt="banner"
                    width={300}
                    height={200}
                    priority
                    unoptimized
                />
            </div>
            <div className="ml-10 flex w-full gap-2">
                {!isEditing && (
                    <button
                        className="self-center bg-blue-600 h-10 w-30 flex rounded-md shadow hover:bg-blue-700 mr-10"
                        onClick={() => setIsEditing(true)}
                    >
                        <p className="w-full self-center text-white text-center">
                            Edit
                        </p>
                    </button>
                )}
                {isEditing && (
                    <>
                        <button className="self-center bg-blue-600 h-10 w-30 flex rounded-md shadow hover:bg-blue-700 mr-10">
                            <p
                                className="w-full self-center text-white text-center"
                                onClick={handleSave}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </p>
                        </button>
                        <button
                            className="self-center bg-red-600 h-10 w-30 flex rounded-md shadow hover:bg-red-700 mr-10"
                            onClick={() => {
                                setIsEditing(false)
                            }}
                        >
                            <p
                                className="w-full self-center text-white text-center"
                                onClick={() => {
                                    setBlog((prev) => ({
                                        ...prev,
                                    }))
                                }}
                            >
                                Discard
                            </p>
                        </button>
                    </>
                )}
            </div>
            <hr className="h-1 my-8 bg-gray-200 border-0 rounded-sm dark:bg-gray-700"></hr>
            <div className="h-[400px] border-red-200 flex flex-col">
                <Editor
                    textOnly={!isEditing}
                    initialContent={blog.body}
                    onChange={(e: object) => setBlogBody(e)}
                />
            </div>
        </div>
    )
}
