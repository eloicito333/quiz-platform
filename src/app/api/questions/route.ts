import { NextResponse } from "next/server"
import { quizCreationSchema } from "@/schemas/form/quiz"
import { ZodError } from "zod"
import { strictOutput } from "@/lib/gpt"
import { getAuthSession } from "@/lib/nextauth"
import { prisma } from "@/lib/db"
import { headers } from 'next/headers'

export const POST = async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession()
    if (!session?.user) {

      const authorizationToken = headers().get('Authorization')?.split(" ")[1]
      const userFromHeader = await prisma.account.findFirst({
        where: {
          access_token: authorizationToken
        },
        include: {
          user: true
        }
      }).user

      if(!userFromHeader) {
        return NextResponse.json(
          {
            error: "You must be logged in to create a quiz",
          },
          { status: 401 }
        )
      }
    }

    const body = await req.json()
    const { amount, topic, type } = quizCreationSchema.parse(body)

    let questions: any;
    if (type === 'open_ended') {
      questions = await strictOutput(
        "You are a helpful AI that is able to generate a pair of questions and answers, the lenght of the answer should not exeed 15 words, store all the questions and answers in a JSON array.",
        new Array(amount).fill(`You are to generate a random hard open-ended question about: ${topic}`),
        {
          question: 'question',
          answer: 'answer with max lenght of 15 words',
        }
      )
    } else if (type === 'mcq') {
      questions = await strictOutput(
        "You are a helpful AI that is able to generate a pair of questions and answers, the lenght of the answer should not exeed 15 words, store all the questions and answers in a JSON array.",
        new Array(amount).fill(`You are to generate a random mcq question about ${topic}`),
        {
          question: 'question',
          answer: 'answer with max lenght of 15 words',
          option1: '1st option with a max length of 15 words',
          option2: '2nd option with a max length of 15 words',
          option3: '3rd option with a max length of 15 words'
        }
      )
    }

    return NextResponse.json(
      {
       questions
      },
      {
        status: 200
      }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      )
    }
  }
}