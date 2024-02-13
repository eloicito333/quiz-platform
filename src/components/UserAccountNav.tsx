'use client';

import { User } from 'next-auth'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { LuLogOut } from 'react-icons/lu'
import UserAvatar from './UserAvatar';

type Props = {
  user: Pick<User, "name" | "image" | "email">
}

const UserAccountNav = ({user}: Props) => {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger>
        <UserAvatar user={user} hoverEffect={false}/>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="flexitems-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 loading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator/>

        <DropdownMenuItem asChild className="">
          <Link href="/">Menu</Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={(e:Event) => {
          e.preventDefault();
          signOut().catch(console.error)
        }}
        className="text-red-600 cursor-pointer">
          Sign Out
          <LuLogOut className="w-4 h-4 ml-2"/>
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UserAccountNav