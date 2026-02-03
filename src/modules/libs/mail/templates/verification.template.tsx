import { Body, Head, Preview, Tailwind, Html, Section, Link, Text, Heading } from '@react-email/components'
import * as React from 'react'

interface VerificationTemplateProps {
    domain: string
    token: string
}

export function VerificationTemplate({domain, token}: VerificationTemplateProps) {
    const verificationLink = `${domain}/account/verify?token=${token}`

    return (
        <Html>
            <Head />
            <Preview>Account verification</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'> 
                        <Heading className='text-3xl text-black font-bold'>Verify your account</Heading>
                        <Text className='text-base text-black mt-2'>
                            Thank you for your registration! Click the button below to verify your account:
                        </Text>
                        <Link
                            href={verificationLink}
                            className='inline-flex justify-center items-center rounded-full
                             text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Verify Account
                        </Link>
                    </Section>

                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>
                            If you did not create an account, no further action is required.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
