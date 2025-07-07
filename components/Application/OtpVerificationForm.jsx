import { zSchema } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import ButtonLoading from "./ButtonLoading"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import axios from "axios"
import { showToast } from "@/lib/showToast"
import { useState } from "react"

const OtpVerificationForm = ({ email, onSubmit, loading }) => {

    const [isResendingOtp, setIsResendingOtp] = useState(false);

    const formSchema = zSchema.pick({
        otp: true,
        email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email
        }
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }

    const resendOtp = async () => {
        try {
            setIsResendingOtp(true);
            const { data: resendOtpResponse } = await axios.post('/api/auth/resend-otp', {email})
            if (!resendOtpResponse.success) {
                throw new Error(resendOtpResponse.message);
            }
            showToast('success', resendOtpResponse.message);

        } catch (error) {
            showToast('error', error.message);

        } finally {
            setIsResendingOtp(false);
        }
    }


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Please complete verification</h1>
                        <p className="text-md">We have send an one time password to your register email address. The OTP is valid for 10 minutes.</p>
                    </div>
                    <div className='mb-5 mt-5 flex justify-center'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-center flex justify-center font-semibold'>One Time Password - OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot className="text-xl size-10" index={0} />
                                                <InputOTPSlot className="text-xl size-10" index={1} />
                                                <InputOTPSlot className="text-xl size-10" index={2} />
                                                <InputOTPSlot className="text-xl size-10" index={3} />
                                                <InputOTPSlot className="text-xl size-10" index={4} />
                                                <InputOTPSlot className="text-xl size-10" index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='mb-3'>
                        <ButtonLoading loading={loading} type='submit' text="Verify" className="w-full cursor-pointer" />
                        <div className="text-center mt-5">
                            {!isResendingOtp ?
                                <button type="button" onClick={resendOtp} className="text-primary cursor-pointer hover:underline">Resend OTP</button>
                                :
                                <span className="text-md">Resending...</span>
                            }
                        </div>
                    </div>
                </form>
            </Form>
        </div >
    )
}

export default OtpVerificationForm