import { emailVerificationLink } from "@/email/emailVerification";
import { connectDB } from "@/lib/db";
import { response } from "@/lib/helper";
import { sendMailer } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";

export async function POST(req) {
    try {
        await connectDB();
        // validation schema
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true,
        })

        const payload = await req.json();

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input', validatedData.error)
        }

        const { name, email, password } = validatedData.data;

        // Check already register user
        const checkUser = await UserModel.exists({ email });

        if (checkUser) {
            return response(true, 409, 'User already register')
        }

        // New registration

        const newRegistration = new UserModel({
            name,
            email,
            password
        })

        await newRegistration.save();

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)

        const token = await new SignJWT({ userId: newRegistration._id.toString() })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

        await sendMailer('Email Verification request from Sourav Basak', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

        return response(true, 200, 'Registration successful, please verify your email')


    } catch (error) {
        catchError(error)
    }
}