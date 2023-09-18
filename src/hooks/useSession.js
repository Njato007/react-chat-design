import { useEffect, useState } from "react"


const useSession = () => {
    const [session, _setSession] = useState(null);

    useEffect(() => {
        const session = localStorage.getItem('_user');
        setSession(JSON.parse(session));
    }, []);

    const setSession = (session) => {
        _setSession(session);
        localStorage.setItem('_user', JSON.stringify(session));
    }

    return {
        session,
        setSession
    }
}

export default useSession;