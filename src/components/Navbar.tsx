import { getAuthSession } from '@/lib/nextauth'
import Link from 'next/link'
import React from 'react'
import SignInButton from './SignInButton'
import UserAccountNav from './UserAccountNav'
import Logo from './Logo'
import { ThemeToggle } from './ThemeTogle'

type Props = {}

const Navbar = async(props: Props) => {
  const session = await getAuthSession()

  return(
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* LOGO */}
        <Link href="/">
          <Logo/>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle/>
          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user}/>
            ) : (
              <SignInButton text="Sign In"/>
            )}
          </div>
        </div>
      </div>
    </nav>
  )

} 

export default Navbar