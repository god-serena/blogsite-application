"use client"

import Image from "next/image"
import { FormEvent, useState } from "react"
import BloggerApi from "@/lib/blogger"

type SignUpResponse = {
    access_token: string
    user: string
}

export default function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        BloggerApi<SignUpResponse>({
            method: "POST",
            endpoint: "user/sign-in",
            payload: {
                email,
                password,
            },
        })
            .then((response) => {
                localStorage.setItem("access_token", response.access_token)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <div className="w-full h-full">
            <div className="p-10 flex flex-col items-center justify-center rounded-xl shadow mx-85 bg-gray-200 mt-40">
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={200}
                    height={20}
                    priority
                />
                <h2 className="text-3xl font-bold mb-2 mt-5 text-center">
                    Log in
                </h2>
                <form
                    className="w-100 flex flex-col gap-10 mt-4"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="text-md font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-900 p-2
                focus:outline-none"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-md font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div>
                            <input
                                required
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-900 p-2
                focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-80 py-2 rounded-md bg-blue-600 shadow-sm text-md text-white
                        hover:bg-blue-500 self-center"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    )
}
