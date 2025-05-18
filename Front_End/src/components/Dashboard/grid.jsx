import React from 'react'
import { Statcards } from './statcards'
import { ActivityGraph } from './activitygraph'
import { RecentAdds } from './recentadds'

export const Grid = () => {
  return (
    <div className='text-zinc-700 px-4'>
      <div className='space-y-6'> {/* Adiciona espaço vertical entre seções */}
        {/* Cards */}
        <div className='grid grid-cols-12 gap-4'>
          <Statcards />
        </div>
        
        {/* Gráficos */}
        <ActivityGraph />

        {/* Novas adições */}
        <RecentAdds />
      </div>
    </div>
  )
}
