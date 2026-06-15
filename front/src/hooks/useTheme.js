import { useState, useEffect } from 'react';

export function useTheme() {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('app_theme') || 'light';
    });

    useEffect(() => {

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}