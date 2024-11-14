'use client'
import { useSearchParams } from "next/navigation"
import { verifyToken } from "@/server/actions/tokens"
import { useEffect } from "react"
import {useRouter} from "next/navigation"

export default function VerificationToken(){
    const Router = useRouter()
    const token = useSearchParams().get('token')
    if(!token) {
        return <p>No verification token found.</p>
    }
    useEffect(() => {
        const verify = async () => {
            await verifyToken(token)
        }
        verify()
        Router.push('/auth/login')
    }, [token])
    return (
        <p>Successfully verified!</p>
    )
}