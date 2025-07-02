import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helper";
import UserModel from "@/models/user.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(req) {
    try {
        await connectDB();
        const { token } = await req.json()

        if(!token) {
            return response(false, 400, 'Token Missing!!!')
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const decoded = await jwtVerify(token, secret)
        const userId = decoded.payload.userId

        if(!isValidObjectId) {
            return response(false, 400, 'Invalid User ID', userId)
        }
        // get user
        const user = await UserModel.findById(userId)
        if(!user) {
            return response(false, 404, 'User not found')
        }

        user.isEmailVerified = true
        await user.save()

        return response(true, 200, 'Email verified successfully')
    } catch (error) {
        catchError(error)
    }
}