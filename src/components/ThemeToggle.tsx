import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'day' | 'night'>('day');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'day' || current === 'night') {
      setTheme(current);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'day' ? 'night' : 'day';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={theme === 'night'}
      aria-label={`Switch to ${theme === 'day' ? 'night' : 'day'} mode`}
    >
      {theme === 'day' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
