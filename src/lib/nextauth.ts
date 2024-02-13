import {DefaultSession, NextAuthOptions, getServerSession} from 'next-auth'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {prisma} from './db'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session extends DefaultSession{
    user: {
      id: string;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async({token, account, profile}) => {
      if (account) {
        token.accessToken = account.access_token
      }
      const db_user = await prisma.user.findFirst({
        where: {
          email: token?.email
        }
      })
      if (db_user) {
        token.id = db_user.id
      }
      return token
    },
    session: async({session, token, user}) => {

      if (!token) return session

      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      session.user.image = token.picture
      session.accessToken = token.accessToken as string

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
}

export const getAuthSession = () => {
  return getServerSession(authOptions)
}