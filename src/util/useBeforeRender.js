/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
export default function useBeforeRender(callback, deps) {
    const [isRun, setIsRun] = useState(false);

    if (!isRun) {
        callback();
        setIsRun(true);
    }

    useEffect(() => () => setIsRun(false), deps);
};