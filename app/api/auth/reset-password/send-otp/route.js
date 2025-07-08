import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/db";
import { catchError, generateOtp, response } from "@/lib/helper";
import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/otp.model";
import UserModel from "@/models/user.model";

export async function POST(req) {
    try {
        await connectDB()
        const payload = await req.json()
        const validationSchema = zSchema.pick({
            email: true
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing input fields", validatedData.error)
        }

        const { email } = validatedData.data
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()

        if (!getUser) {
            return response(false, 404, "User Not Found")
        }

        // remove old otp
        await OtpModel.deleteMany({ email })
        const otp = generateOtp()
        const newOtpData = new OtpModel({ email, otp })

        await newOtpData.save()

        const otpSendStatus = await sendMailer('Your login verification code.', email, otpEmail(otp))

        if (!otpSendStatus.success) {
            return response(false, 400, 'Failed to send OTP email')
        }
        return response(true, 200, 'Please verify your account')
    } catch (error) {
        return catchError(error)
    }
}