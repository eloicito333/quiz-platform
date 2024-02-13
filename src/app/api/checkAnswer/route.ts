import { prisma } from "@/lib/db"
import { strictOutput } from "@/lib/gpt"
import { getAuthSession } from "@/lib/nextauth"
import { checkAnswerSchema } from "@/schemas/form/quiz"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

export const POST = async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession()
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in to create a quiz",
        },
        { status: 401 }
      )
    }
    
    const body = await req.json()
    const {questionId, userAnswer} = checkAnswerSchema.parse(body)
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })
    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found"
        },
        { status: 404 }
      )
    }
    await prisma.question.update({
      where: {id: questionId },
      data: {
        userAnswer
      }
    })
    if (question.questionType === "mcq") {
      const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      await prisma.question.update({
        where:{id : questionId},
        data: {
          isCorrect,
        }
      })
      return NextResponse.json(
        {
          isCorrect,
        },
        { status: 200 }
      )
    } else if (question.questionType === "open_ended") {
      const gptScoreResponse: {score: number} = await strictOutput(
        `You are a helpful AI that is able tocorrect of questions given the user's anwser. You have to eval from a scale from 0 to 100 the user answer. The question is \`${question.question}\` This: \`${question.answer}\` is a correct possible answer to this question, so use it as reference.`,
        `User answer: ${userAnswer.trim()}`,
        {
          score: "a number from 0 to 100 that represents the mark given to the user answer to the question"
        }
      )
      const score = gptScoreResponse.score

      console.log("score: ", score)

      if (!score) return NextResponse.json(
        {
          error: "Error while correcting the asnwer"
        },
        { status: 500 }
      )

      await prisma.question.update({
        where: { id: questionId },
        data: {
          percentageCorrect: score
        }
      })
      return NextResponse.json(
        {
          score
        },
        { status: 200 }
      )
    }
  } catch (error) {
    if(error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      )
    }
  }
}