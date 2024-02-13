"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Game, Question } from '@prisma/client'
import { LuBarChart, LuChevronRight, LuLoader2, LuTimer } from 'react-icons/lu'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button, buttonVariants } from './ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import { z } from 'zod';
import { useToast } from './ui/use-toast';
import Link from 'next/link';
import { cn, formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns'

type Props = {
  game: Game & {questions: Pick<Question, "id" | "question" | "options">[]}
}

const MCQ = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [wrongAnswers, setWrongAnswers] = useState<number>(0)
  const [hasEnded, setHasEnded] = useState<boolean>(false)
  const [now, setNow] = useState<Date>(new Date())
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

  const options = useMemo(() => {
    if(!currentQuestion?.options) return []
    return JSON.parse(currentQuestion.options as string) as string[]
  }, [currentQuestion])

  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
    mutationFn: async () => {
      if (selectedChoice === null) throw new Error("No selected question")
      
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice]
      }
      const response = await axios.post('/api/checkAnswer', payload)
      return response.data
    }
  })

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({isCorrect}) => {
        if (isCorrect) {
          setCorrectAnswers((prev) => prev + 1)
          toast({
            title: "Correct",
            description: "Correct answer",
            variant: "success"
          })
        } else {
          setWrongAnswers((prev) => prev + 1)
          toast({
            title: "Incorrect",
            description: "Incorrect answer",
            variant: "destructive"
          })
        }
        if (questionIndex === game.questions.length - 1) {
          setHasEnded(true)
          return
        }
        setQuestionIndex((prev) => prev + 1)
        setSelectedChoice(null)
      }
    })
  }, [checkAnswer, toast, isChecking, questionIndex])
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == '1') {
        setSelectedChoice(0)
      } else if (event.key == '2') {
        setSelectedChoice(1)
      } else if (event.key == '3') {
        setSelectedChoice(2)
      } else if (event.key == '4') {
        setSelectedChoice(3)
      } else if (event.key == 'Enter') {
        handleNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleNext])

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed this quiz in {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), 'mt-2')}>
          View Statistics
          <LuBarChart className="m-4 h-4 ml-2" />
        </Link>
      </div>
    )
  }

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
        {/* counter */}
        <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} />
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
        {options.map((option: string, index: number) => {
          return (
            <Button
              key={index}
              className="justify-start w-full py-8 mb-4 border"
              variant={selectedChoice === index ? "default" : "secondary"}
              onClick={() => {
                setSelectedChoice(index)
              }}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          )
        })}
        <Button
          className='mt-2'
          disabled={selectedChoice === null || isChecking}
          onClick={handleNext}
        >
          {isChecking && <LuLoader2 className='w-4 h-4 mr-2 animate-spin' />}
          Next <LuChevronRight className="w-4 h-4 ml-2"/>
        </Button>
      </div>
    </div>
  )
}

export default MCQ