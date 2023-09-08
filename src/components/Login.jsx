import React, { useEffect, useState } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'
import ThemSwitcher from './ThemSwitcher'
import { getUsers, signIn } from '../utils/func';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn({
            username,
            password
        }).then(res => {
            if (res.status === 200) {
                // check result
                if (res.data.length === 0) {
                    console.log('Authentification invalid!')
                } else {
                    const user = res.data[0];
                    localStorage.setItem('_user', JSON.stringify(user));
                    return navigate('/messenger');
                }
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center w-full h-screen min-h-[400px] px-3'>
            <div className="my-auto w-full max-w-lg min-w-[200px] p-6 shadow-lg bg-white dark:bg-gray-800 rounded-xl">
                <div className="w-full flex-col items-center justify-center">
                    <img src={process.env.PUBLIC_URL + 'solumada.png'} />
                    <div className="py-1 flex items-center justify-center gap-2 w-full px-3">
                        <h1
                            className="text-center text-[#3C3A7F] opacity-90 dark:opacity-100 text-xl uppercase my-3 font-semibold qdrop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                        >Messagerie interne</h1>
                        <div className="ml-auto">
                            <ThemSwitcher />
                        </div>
                    </div>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="w-full">
                        <Input type="text"
                            className='login_input'
                            placeholder={"Nom d'utilisateur"}
                            icon={<FaUser className='w-6 h-6'/>}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        
                        <Input type="password"
                            className='login_input'
                            placeholder={"Mot de passe"}
                            icon={<FaLock className='w-6 h-6'/>}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="w-full mt-5">
                            <button
                                className='py-2 px-3 bg-green-600 hover:bg-green-500 text-gray-100 rounded-md'
                            >
                                Se connecter
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <p className="text-center my-3 text-sm text-gray-700 dark:text-gray-500">
                Copyright &copy; {2023} Solumada.
            </p>
        </div>
    )
}

const Input = ({type, value, onChange, className, placeholder, icon}) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={`flex items-center gap-2 login_formgroup ${isFocused && 'focused'}`}>
            <div className={`${isFocused ? 'text-green-500' : 'text-gray-500'}`}>
                {icon}
            </div>
            <input
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange && onChange}
                className={`${className} ${isFocused && 'focused'} my-1`}
                autoComplete='new-password'
            />
        </div>
    )
}

export default Login