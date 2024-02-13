"use client";

import React, { ChangeEvent } from 'react'

type Props = {
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  questionIndex: number
}

const BlankAnswerInput = ({setAnswer, questionIndex}: Props) => {
  const [inputValue, setInputValue] = React.useState<string>("")
  const [inputWidth, setInputWidth] = React.useState<number>(0)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.trimStart())
    setAnswer(inputValue.trim())

    setInputWidth(e.target.scrollWidth)
  }

  React.useEffect(() => {
    setInputValue("")
    setAnswer("")
  }, [questionIndex])
  return (
    <div className="flex justify-start w-full mt-4">
      Answer:
      <input
        id="user-answer-input"
        className="ml-2 border-b-2 border-black dark:border-white focus:border-2 focus:border-b-4 focus:outline-none border-box h-7 min-w-[224px] max-w-full whitespace-normal"
        style={{
          width: `${inputWidth}px`,
        }}
        type="text"
        spellCheck="false"
        autoComplete="off"
        onChange={handleInputChange}
        value={inputValue}
      />
    </div>
  )
}

export default BlankAnswerInput