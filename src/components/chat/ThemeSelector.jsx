import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const ThemeSelector = ({ currentTheme, setTheme, onClose }) => {
    const themeSingleClasses = [
        '_default', 
        '_sky', 
        '_blue', 
        '_indigo', 
        '_rose', 
        '_orange', 
        '_amber',
        '_yellow',
        '_pink',
        '_lime',
        '_violet'
    ];
    const themeGradientClasses = [
        '_g-pinkindigo',
        '_g-yellowrose', 
        '_g-rosepurple', 
        '_g-yellowteal',
        '_g-skyblue'
    ];

    const [selectedTheme, setSelectedTheme] = useState(currentTheme);

    useEffect(() => {
        setSelectedTheme(currentTheme);
    }, []);

    const handleChange = () => {
        setTheme(selectedTheme);
        onClose();
    }

    return (
        <div className='p-4 bg-white dark:bg-gray-800 shadow rounded-xl border border-slate-300 dark:border-gray-700'>
            <div className="flex justify-between">
                <h1 className='text-black dark:text-white py-2 mb-2 font-semibold'>
                    Choisir un thème:
                </h1>
                <button type="button" className='text-slate-700 dark:text-gray-400'
                    onClick={() => onClose()}
                >
                    <IoMdClose className='w-6 h-6' />
                </button>
            </div>
            <div className='border-b border-slate-200 dark:border-gray-700' />
            {/* Simple */}
            <div className="flex flex-col my-2">
                <p className="text-sm text-slate-800 dark:text-gray-300 ">Simple:</p>
                <div className="grid grid-cols-4 gap-1">
                    {
                        themeSingleClasses.map((theme, index) => (
                            <div key={index}
                                className={`${theme === selectedTheme && 'bg-gray-300 dark:bg-gray-700'} cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-2`}
                                onClick={() => setSelectedTheme(theme)}
                            >
                                <div className={`${theme} rounded-full h-12 w-12`}></div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/* Gradient */}
            <div className="flex flex-col my-2">
                <p className="text-sm text-slate-800 dark:text-gray-300 ">Gradient:</p>
                <div className="grid grid-cols-4 gap-1">
                    {
                        themeGradientClasses.map((theme, index) => (
                            <div key={index}
                                className={`${theme === selectedTheme && 'bg-gray-300 dark:bg-gray-700'} cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-2`}
                                onClick={() => setSelectedTheme(theme)}
                            >
                                <div className={`${theme} rounded-full h-12 w-12`}></div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='border-b border-slate-200 dark:border-gray-700' />
            <div className='flex mt-4'>
                <button
                    className='p-2 px-4 mx-auto text-white rounded-md bg-emerald-700 hover:bg-emerald-600'
                    onClick={handleChange}
                >Changer</button>
            </div>
        </div>
    )
}

export default ThemeSelector