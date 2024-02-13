"use client";

import { Game, Question } from '@prisma/client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LuChevronRight, LuLoader2, LuTimer } from 'react-icons/lu'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useToast } from './ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import axios from 'axios'
import { formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import { Button } from './ui/button';
import BlankAnswerInput from './BlankAnswerInput';

type Props = {
  game: Game & {questions: Pick<Question, "id" | "question" | "answer">[]}
}

const OpenEnded = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [hasEnded, setHasEnded] = useState<boolean>(false)
  const [now, setNow] = useState<Date>(new Date())
  const [answer, setAnswer] = useState<string>("")
  const {toast} = useToast()
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [hasEnded])

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex]
  }, [questionIndex, game.questions])

  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
    mutationFn: async () => {
      if (!answer.length) throw new Error("No answer provided")
      
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: answer
      }
      const response = await axios.post('/api/checkAnswer', payload)
      return response.data
    }
  })

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({score}) => {
        toast({
          title: `Your answer is ${score}% correct.`,
          description: `Answers are corrected using AI`,
        })
        
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true)
          return
        }
        setQuestionIndex((prev) => prev + 1)
      }
    })
  }, [toast, isChecking, questionIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == 'Enter') {
        handleNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleNext])
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-slate-400">Topic</span>
            <span className="text-white px-2 py-1 ml-2 rounded-lg bg-slate-800">{game.topic.trim()}</span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <LuTimer className="mr-2 w-6 h-6" />
            <span>{formatTimeDelta(differenceInSeconds(now, game.timeStarted))}</span>
          </div>
        </div>
      </div>

      {/* questions */}
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row imtems-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50 dark:divide-zinc-400/50">
            <div className='mb-1'>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">{currentQuestion.question}</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <BlankAnswerInput setAnswer={setAnswer} questionIndex={questionIndex} />
        <Button
          className='mt-2'
          disabled={!answer.length || isChecking}
          onClick={handleNext}
        >
          {isChecking && <LuLoader2 className='w-4 h-4 mr-2 animate-spin' />}
          Next <LuChevronRight className="w-4 h-4 ml-2"/>
        </Button>
      </div>
    </div>
  )
}

export default OpenEnded