import { connectDB } from "@/lib/db";
import { catchError, response } from "@/lib/helper";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";

export async function PUT(req) {
    try {
        await connectDB()
        const payload = await req.json()

        const validationSchema = zSchema.pick({
            email: true, password: true
        })

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }

        const {email, password} = validatedData.data
        const getUser = await UserModel.findOne({deletedAt: null, email}).select("+password")

        if(!getUser){
            return response(false, 404, "User Not Found")
        }

        getUser.password = password
        await getUser.save()

        return response(true, 200, "Password Updated")
    } catch (error) {
        return catchError(error)
    }
}