import axios from "axios"

async function BloggerApi<T = unknown>({
    method = "GET",
    payload,
    endpoint,
}: {
    method?: string
    payload?: Record<string, unknown>
    endpoint: string
}): Promise<T> {
    const access_token = localStorage.getItem("access_token")

    const axiosInstance = axios.create({
        baseURL: "http://localhost:8000/blogger-api/",
        headers: {
            "Content-Type": "application/json",
            ...(access_token
                ? { Authorization: `Bearer ${access_token}` }
                : {}),
        },
    })

    try {
        const response = await axiosInstance.request({
            ...(payload ? { data: JSON.stringify(payload) } : {}),
            method: method.toLowerCase(),
            url: endpoint,
        })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) throw error.response
        else throw error
    }
}

export default BloggerApi
