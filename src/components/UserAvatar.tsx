import { User } from 'next-auth'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  user: Pick<User, "name" | "image">;
  hoverEffect: boolean;
}

const UserAvatar = ({user, hoverEffect}: Props) => {
  return (
    <div className={cn(hoverEffect && "p-1 rounded-full hover:bg-slate-300/50 transition-all")}>
      <Avatar>
      {user.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image
            fill
            src={user.image}
            alt="profile image"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
    </div>
  )
}

export default UserAvatar