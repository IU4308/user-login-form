import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
    let effectRan = useRef(false)
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            } 
            finally {
                isMounted && setIsLoading(false);
            }
        }

        if (effectRan.current) {
            !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
        }

        //!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
            effectRan.current = true;
        }
        
    }, [])

    useEffect(() => {
        
        if (effectRan.current) {
            console.log(`isLoading: ${isLoading}`)
            console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
        }

        return () => {
            effectRan.current = true;
        }
        
    }, [isLoading])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin

