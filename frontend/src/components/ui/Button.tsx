import React from 'react'
import clsx from 'clsx'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center font-medium rounded-md transition-colors',
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg'
        },
        {
          'bg-sky-600 text-white hover:bg-sky-700': variant === 'default',
          'bg-transparent text-slate-700 hover:bg-slate-100': variant === 'ghost',
          'bg-rose-600 text-white hover:bg-rose-700': variant === 'destructive',
          'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50': variant === 'outline'
        },
        className
      )}
      {...props}
    />
  )
}
