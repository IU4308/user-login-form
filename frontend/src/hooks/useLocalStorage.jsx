import { useState, useEffect, useRef } from "react";

const getLocalValue = (key, initValue) => {
    //SSR Next.js
    if(typeof window === 'undefined') return initValue;

    // if a value is alreayy stored
    
    const localValue = JSON.parse(localStorage.getItem(key));
    if (localValue) return localValue;

    // return result of a function
    if (initValue instanceof Function) return initValue();

    return initValue;

}

const useLocalStorage = (key, initValue) => {
    let effectRan = useRef(false);
    const [value, setValue] = useState(() => {
        return getLocalValue(key, initValue);
    });

    useEffect(() => {
        if (effectRan.current) {
            localStorage.setItem(key, JSON.stringify(value));
        }
        
        return () => {
            effectRan.current = true;
        }
    }, [key, value])

    return [value, setValue];
}

export default useLocalStorage