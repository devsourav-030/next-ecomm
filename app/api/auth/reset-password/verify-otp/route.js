import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDB();

        const payload = await req.json()
        const validationSchema = zSchema.pick({
            otp: true,
            email: true
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const { email, otp } = validatedData.data

        const getOtpData = await OtpModel.findOne({ email, otp })
        if (!getOtpData) {
            return response(false, 404, 'Invalid or expired OTP')
        }

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response(false, 404, 'Invalid or User not found')
        }

        // remove otp from database after validation
        await getOtpData.deleteOne()

        return response(true, 200, 'OTP verified successfully')

    } catch (error) {
        return catchError(error)
    }
}