import { useEffect, useState } from "react"
import useSession from "./useSession";

const useToken = () => {
    const [accessToken, setAccessToken] = useState('');
    const { session } = useSession();
    useEffect(() => {
        setAccessToken(session.token);
    });
    
    return accessToken;
}
export default useToken;