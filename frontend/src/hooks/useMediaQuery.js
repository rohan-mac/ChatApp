import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoints
 * Uses Tailwind CSS breakpoints (sync with tailwind.config.js)
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * @param {keyof BREAKPOINTS} breakpoint - 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @returns {boolean} true if window width >= breakpoint
 */
export const useMediaQuery = (breakpoint) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    const px = BREAKPOINTS[breakpoint];
    return window.innerWidth >= px;
  });

  useEffect(() => {
    const px = BREAKPOINTS[breakpoint];
    if (!px) {
      console.warn(`Unknown breakpoint: ${breakpoint}`);
      return;
    }

    const handler = () => setMatches(window.innerWidth >= px);
    const mediaQuery = window.matchMedia(`(min-width: ${px}px)`);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen to changes
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
};

/**
 * Get multiple breakpoint states at once
 * @param {string[]} breakpoints - ['sm', 'md', 'lg']
 * @returns {Object} { sm: bool, md: bool, lg: bool }
 */
export const useMedia = (breakpoints = ['sm', 'md', 'lg']) => {
  const [state, setState] = useState(() => {
    const initialState = {};
    breakpoints.forEach((bp) => {
      const px = BREAKPOINTS[bp];
      initialState[bp] = typeof window === 'undefined' ? false : window.innerWidth >= px;
    });
    return initialState;
  });

  useEffect(() => {
    const handler = () => {
      const newState = {};
      breakpoints.forEach((bp) => {
        const px = BREAKPOINTS[bp];
        newState[bp] = window.innerWidth >= px;
      });
      setState(newState);
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoints]);

  return state;
};

export default useMediaQuery;
