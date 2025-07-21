import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Image from "next/image"
import Link from "next/link"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Blogger",
    description: "Blog it!",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html className="h-full" lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
            >
                <div className="h-20 z-50 relative flex items-center">
                    <div className="absolute left-2 top-2 h-full z-10">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={300}
                            height={200}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <div className="h-full w-full bg-gray-100 text-center flex gap-10">
                        <div className="pl-[400px] flex justify-end gap-10">
                            <Link
                                className="self-center bg-blue-600 h-10 w-30 flex rounded-md shadow hover:bg-blue-700"
                                href="/blogs"
                            >
                                <p className="w-full self-center text-white text-center">
                                    Blogs
                                </p>
                            </Link>
                            <Link
                                className="self-center bg-blue-600 h-10 w-30 flex rounded-md shadow hover:bg-blue-700"
                                href="/blogs/create"
                            >
                                <p className="w-full self-center text-white text-center">
                                    Write a blog
                                </p>
                            </Link>
                        </div>
                        <div className="flex justify-between w-full gap-2">
                            <input
                                className="w-100 bg-blue-200 rounded-md border-gray-400 shadow-sm text-gray-900
                focus:outline-none self-center h-[40px] p-2.5"
                                type="text"
                                placeholder="Search blog"
                            />
                            <Link
                                className="self-center bg-blue-600 h-10 w-30 flex rounded-md shadow hover:bg-blue-700 mr-10"
                                href="/signup"
                            >
                                <p className="w-full self-center text-white text-center">
                                    Sign up
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="container max-w-full h-full flex-1 overflow-auto pt-5">
                    {children}
                </div>
                {/*<div className="h-10 bg-gray-100"></div>*/}
            </body>
        </html>
    )
}
