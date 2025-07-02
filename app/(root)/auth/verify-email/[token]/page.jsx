'use client'

import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import { use, useEffect, useState } from 'react'

import verifiedImage from '@/public/assets/images/verified.gif'
import verificationFailed from '@/public/assets/images/verification-failed.gif'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/websiteRoute'

const VerifyEmail = ({ params }) => {
  const { token } = use(params)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post('/api/auth/verify-email', { token })

      if (verificationResponse.success) {
        setIsVerified(true)
      }
    }

    verify()
  }, [token])
  return (
    <Card className="w-[400px]">
      <CardContent>
        {isVerified ?
          <div>
            <div className='flex justify-center items-center'>
              <Image src={verifiedImage.src} height={verifiedImage.height} width={verifiedImage.width} className='w-auto' alt='Verification success' />
            </div>
            <div className='text-center'>
              <h1 className='text-2xl font-bold my-5 text-green-500'>Email verification success</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
          :
          <div>
            <div className='flex justify-center items-center'>
              <Image src={verificationFailed.src} height={verificationFailed.height} width={verificationFailed.width} className='w-auto' alt='Verification failed' />
            </div>
            <div className='text-center'>
              <h1 className='text-2xl font-bold my-5 text-red-500'>Email verification failed</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default VerifyEmail