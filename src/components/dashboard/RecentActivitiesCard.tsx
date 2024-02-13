import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

type Props = {}

const RecentActivitiesCard = (props: Props) => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activities</CardTitle>
      </CardHeader>
      <CardDescription>
        You have played a total of 7 games.
      </CardDescription>
      <CardContent className="max-h-[580px] overflow-auto">
        Histories
      </CardContent>
    </Card>
  )
}

export default RecentActivitiesCard