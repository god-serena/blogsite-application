/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client"

import { useEffect, useRef, useState } from "react"
import "quill/dist/quill.snow.css"
import "@/css_overrides/Editor.css"

export default function QuillEditor({
    onChange,
    initialContent,
    textOnly = false,
    truncText = false,
    maxLength = 2,
}) {
    const editorRef = useRef(null)
    const quillInstance = useRef(null)
    const [truncatedText, setTruncatedText] = useState("")
    const [content, setContent] = useState(initialContent)

    useEffect(() => {
        const toolbars = document.getElementsByClassName("ql-toolbar")
        if (toolbars.length) {
            for (const toolbar of toolbars) {
                toolbar.remove()
            }
        }
        let quill = undefined
        async function initQuill() {
            if (!editorRef.current) return

            const Quill = (await import("quill")).default

            const toolbar = [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ]

            quill = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "What do you have in mind?",
                modules: {
                    toolbar: textOnly ? false : toolbar,
                },
                readOnly: textOnly,
            })

            quill.setContents(initialContent)
            quill.on("text-change", () => {
                const delta = quill.getContents()
                setContent(delta)
            })

            if (truncText) {
                const plain = quill.getText().trim()
                setTruncatedText(
                    plain.length > maxLength
                        ? plain.slice(0, maxLength) + "..."
                        : plain,
                )
            }
            quillInstance.current = quill

            return () => {
                quillInstance.current.off("text-change", () => {})
                quillInstance.current = null
            }
        }

        initQuill()
    }, [initialContent, textOnly, maxLength, truncText])

    useEffect(() => {
        onChange(content)
    }, [content, onChange])

    if (truncText && quillInstance.current) {
        return <p className="text-[14px] text-gray-500">{truncatedText}</p>
    }

    return (
        <div
            ref={editorRef}
            className={`editor ${textOnly ? "select-none" : "select-text"}`}
        />
    )
}
