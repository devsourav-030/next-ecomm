import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helper";
import { cookies } from "next/headers";

export async function POST(req){
    try {
        await connectDB()
        const cookieStore = await cookies()
        cookieStore.delete('access_token')

        return response(true, 200, 'Logout successfully')
    } catch (error) {
        return catchError(error)
    }
}