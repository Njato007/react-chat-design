import React from 'react'
import { BiSolidMoon, BiSolidSun } from 'react-icons/bi'
import { useTheme } from '../utils/tools'

const ThemSwitcher = () => {
    const { theme, setTheme } = useTheme();

    return (
        <>
            {
                theme === 'light' ?
                <button className='p-1 text-slate-700' onClick={() => setTheme('dark')}>
                    <BiSolidMoon className='h-6 w-6' />
                </button>
                :
                <button className='p-1 text-yellow-500' onClick={() => setTheme('light')}>
                    <BiSolidSun className='h-6 w-6' />
                </button>
            }
        </>
    )
}

export default ThemSwitcher