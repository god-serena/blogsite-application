"use client"

import Image from "next/image"
import { FormEvent, useState } from "react"
import BloggerApi from "@/lib/blogger"

type SignInResponse = {
    access_token: string
    user: string
}
export default function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [role, setRole] = useState("")

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        BloggerApi<SignInResponse>({
            method: "POST",
            endpoint: "user/sign-up",
            payload: {
                email,
                role,
                password,
                first_name: firstName,
                last_name: lastName,
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
            <div className="p-10 flex flex-col items-center justify-center rounded-xl shadow mx-85 bg-gray-200 mt-5">
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={200}
                    height={20}
                    priority
                />
                <h2 className="text-3xl font-bold mb-2 mt-5 text-center">
                    Create your account
                </h2>
                <form
                    className="w-100 flex flex-col gap-10 mt-4"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div>
                        <label
                            htmlFor="firstName"
                            className="text-md font-medium text-gray-700"
                        >
                            First name
                        </label>
                        <div>
                            <input
                                required
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-900 p-2
                focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="text-md font-medium text-gray-700"
                        >
                            Last name
                        </label>
                        <div>
                            <input
                                required
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-900 p-2
                focus:outline-none"
                            />
                        </div>
                    </div>
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
                    <div>
                        <p className=" text-md font-medium text-gray-700">
                            Role
                        </p>
                        <div className="mt-2 flex gap-10">
                            <div className="flex gap-2">
                                <input
                                    required
                                    name="role"
                                    type="radio"
                                    id="author"
                                    checked={role === "author"}
                                    onChange={() => setRole("author")}
                                />
                                <label
                                    htmlFor="author"
                                    className="text-md font-medium text-gray-900"
                                >
                                    Blogger
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    required
                                    type="radio"
                                    name="role"
                                    id="reader"
                                    checked={role === "reader"}
                                    onChange={() => setRole("reader")}
                                />
                                <label
                                    htmlFor="reader"
                                    className="text-md font-medium text-gray-900"
                                >
                                    Reader
                                </label>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-80 py-2 rounded bg-blue-600 shadow-sm text-md text-white
                        hover:bg-blue-500 self-center"
                    >
                        Signup
                    </button>
                </form>
            </div>
        </div>
    )
}
