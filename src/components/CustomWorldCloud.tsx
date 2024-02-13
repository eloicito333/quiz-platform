"use client";
import { useTheme } from 'next-themes';
import React from 'react'
import WordCloud from 'react-d3-cloud';

type Props = {}

const data= [
  {
    text: 'hey',
    value: 1
  },
  {
    text: 'computer',
    value: 10
  },
  {
    text: 'nextjs',
    value: 8
  },
  {
    text: 'live',
    value: 7
  }
]

const fontSizeWrapper = (word: {value: number}) => Math.log2(word.value) * 5 + 16

const CustomWorldCloud = (props: Props) => {
  const theme = useTheme()
  return (
    <>
      <WordCloud
      height={550}
      font="Times"
      fontSize={fontSizeWrapper}
      rotate={0}
      padding={10}
      fill = {theme.resolvedTheme === "dark" ? "white" : "black"}
      data={data}
      />
    </>
  )
}

export default CustomWorldCloud