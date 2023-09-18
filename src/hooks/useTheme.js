import { useEffect, useState } from "react";

export default useTheme = () => {
    const [theme, _setTheme] = useState('light');
  
    useEffect(() => {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme) setTheme(currentTheme);
    }, []);
  
    const setTheme = (theme) => {
      _setTheme(theme);
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  
    return { theme, setTheme }
  }