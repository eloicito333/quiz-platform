import React from 'react'
import { Card } from './ui/card'
import { LuCheckCircle2, LuXCircle } from 'react-icons/lu'
import { Separator } from './ui/separator'

type Props = {
  correctAnswers: number,
  wrongAnswers: number
}

const MCQCounter = ({ correctAnswers, wrongAnswers }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <LuCheckCircle2 color="green" size={30} />
      <span className="mx-3 text-2xl text-[green]">{correctAnswers}</span>
      <Separator orientation="vertical" />
      <span className="mx-3 text-2xl text-[red]">{wrongAnswers}</span>
      <LuXCircle color="red" size={30} />
    </Card>
  )
}

export default MCQCounter