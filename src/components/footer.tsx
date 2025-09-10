import React from 'react'
import Link from 'next/link'
import { getTranslations } from "next-intl/server"
import { BsTwitter } from 'react-icons/bs'

export const Footer = async () => {
  const t = await getTranslations("main.footer")

  return (
    <footer className='w-full h-60 flex flex-col items-center justify-center px-4 text-center text-gray-800 space-y-2'>
      <div className='flex flex-col my-6'>
        <Link href="/terms-of-service">
          <span className='text-sm'>{t("termsOfService")}</span>
        </Link>
        <Link href="/privacy-policy">
          <span className='text-sm'>{t("privacyPolicy")}</span>
        </Link>
        <Link href="/commerce-disclosure">
          <span className='text-sm'>{t("commerceDisclosure")}</span>
        </Link>
      </div>

      <div className='flex items-center justify-center'>
        <Link href='https://x.com/one-kyobashi-commons' target="_blank">
          <BsTwitter className='w-5 h-5' />
        </Link>
      </div>

      <div>
        <small className='text-xs'>
          &copy; 2025. all rights reserved
        </small>
      </div>
    </footer>
  )
}
