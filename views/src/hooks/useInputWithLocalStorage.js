import {useState} from 'react';
import useLocalStorage from './useLocalStorage';

// Custom input with validation and saving values to local storage
const useInputWithLocalStorage = (key, initValue, validator) => {
    const [value, setValue] = useLocalStorage(key, initValue);
    const [isTouched, setIsTouched] = useState(false);

    const isValid = validator(value);
    const hasError = !isValid && isTouched;

    function handleChange(event) {
        setValue(event.target.value);
    }

    function handleBlur() {
        setIsTouched(true);
    }

    function reset() {
        setValue(initValue);
        setIsTouched(false);
    }

    return {
        value,
        hasError,
        isValid,
        handleChange,
        handleBlur,
        reset
    }
}

export default useInputWithLocalStorage;