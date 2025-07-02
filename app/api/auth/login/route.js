import { emailVerificationLink } from "@/email/emailVerification";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/db";
import { catchError, generateOtp, response } from "@/lib/helper";
import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";
import { z } from "zod";

export async function POST(req) {
    try {
        await connectDB()
        const payload = await req.json()

        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string()
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing input", validatedData.error)
        }

        const { email, password } = validatedData.data

        // get user data
        const getUser = await UserModel.findOne({ deletedAt: null, email }).select('+password')

        if (!getUser) {
            return response(false, 400, "Invalid login credentials")
        }

        // verify email
        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY)

            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime('1h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret)

            await sendMailer('Email Verification request from Sourav Basak', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

            return response(false, 401, "Your email is not verified, please verify your email")
        }

        // verify password
        const isPasswordVerified = await getUser.comparePassword(password)

        if (!isPasswordVerified) {
            return response(false, 400, "Invalid login credentials")
        }

        // OTP creation
        await OtpModel.deleteMany({ email }) // delete old otp

        const otp = generateOtp()

        // storing otp in db
        const otpData = new OtpModel({
            email,
            otp
        })

        await otpData.save()

        const otpEmailStatus = await sendMailer('Your login verification code', email, otpEmail(otp))

        if (!otpEmailStatus.success) {
            return response(false, 400, "Failed to send OTP")
        }

        return response(true, 200, "Please verify your device")

    } catch (error) {
        return catchError(error)
    }
}