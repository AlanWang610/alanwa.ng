import { useState } from 'react';
import { MenuIcon, CloseIcon, GithubIcon, LinkedInIcon, YoutubeIcon } from './icons';

interface NavItem {
  label: string;
  path: string;
}

interface Props {
  currentPath: string;
  navItems: NavItem[];
}

function isActive(navPath: string, current: string): boolean {
  if (navPath === '/') return current === '/' || current === '';
  return current.startsWith(navPath);
}

export default function MobileNav({ currentPath, navItems }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div className={`mobile-drawer ${open ? 'open' : ''}`}>
        <div className="mobile-drawer__social">
          <a href="https://github.com/AlanWang610" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
          <a href="https://www.linkedin.com/in/alanwang2024/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
          <a href="https://www.youtube.com/channel/UCtxHcguyCi5ufBJXPDU4YjA" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><YoutubeIcon /></a>
        </div>
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`mobile-drawer__link ${isActive(item.path, currentPath) ? 'mobile-drawer__link--active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}
