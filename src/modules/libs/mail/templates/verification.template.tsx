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
            <Preview>Верификация аккаунта</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'> 
                        <Heading className='text-3xl text-black font-bold'>Подтвердите ваш аккаунт</Heading>
                        <Text className='text-base text-black mt-2'>
                            Спасибо за регистрацию! Нажмите на кнопку ниже, чтобы подтвердить ваш аккаунт:
                        </Text>
                        <Link
                            href={verificationLink}
                            className='inline-flex justify-center items-center rounded-full
                             text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
                            Подтвердить аккаунт
                        </Link>
                    </Section>

                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>
                            Если вы не создавали аккаунт, никаких дополнительных действий не требуется.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
