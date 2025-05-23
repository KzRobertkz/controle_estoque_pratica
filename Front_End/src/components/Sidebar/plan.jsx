import React from 'react'

export const Plan = () => {
  return (
    <div className='flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs'>
        <div className='flex items-center justify-between'>
            <div>
                <p className='font-bold text-slate-200'>Enterprise</p>
                <p className='text-stone-500'>Feito com ❤️ by Eu... <br/> Robert</p>
            </div>
            <button className='px-2 py-2 font-medium bg-zinc-800 text-zinc-100 shadow hover:bg-zinc-800/50 '>
                Support
            </button>
        </div>
    </div>
  )
}
