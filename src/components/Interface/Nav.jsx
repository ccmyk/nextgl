'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAppEvents }               from '@/context/AppEventsContext';
import { useSplitText }               from '@/hooks/useSplitText';
import { useNavClock }                from '@/hooks/useNavClock';
import styles                         from '@/styles/components/nav.pcss';

/**
 * @param {{
 *   logo: string,
 *   links: Array<{ href: string; label: string }>,
 * }} props
 */
export default function Nav({ logo, links }) {
  const navRef     = useRef(null);
  const { dispatchAnim } = useAppEvents();
  const [isOpen, setIsOpen] = useState(false);

  // 1️⃣ Split all the text nodes exactly as legacy did
  useSplitText(
    navRef,
    '.nav_logo, .nav_right a, .nav_clock_p .char, .nav_clock_h .char, .nav_clock_m .char, .nav_clock_a .char'
  );

  // 2️⃣ On mount: fire your entry animations for logo, clock & links
  useEffect(() => {
    if (!navRef.current) return;

    const targets = [
      '.nav_logo',
      '.nav_clock_p',
      '.nav_clock_h',
      '.nav_clock_m',
      '.nav_clock_a',
      ...Array.from(links.keys()).map(i => `.nav_right a:nth-child(${i+1})`)
    ];

    targets.forEach(sel => {
      dispatchAnim(0, sel);
      dispatchAnim(1, sel);
    });
  }, [dispatchAnim, links]);

  // 3️⃣ Live clock—updates its own animations via your hook
  const { hour, minute, ampm } = useNavClock(dispatchAnim);

  // 4️⃣ Burger toggle => same .act-menu class + open/closemenu events
  const toggleMenu = () => {
    if (isOpen) {
      document.documentElement.classList.remove('act-menu');
      dispatchAnim(null, 'closemenu');
    } else {
      document.documentElement.classList.add('act-menu');
      dispatchAnim(null, 'openmenu');
    }
    setIsOpen(open => !open);
  };

  return (
    <nav className={styles.nav} ref={navRef}>
      {/* Logo */}
      <div className="nav_logo">{logo}</div>

      {/* Burger */}
      <button className="nav_burger" onClick={toggleMenu}>
        <span /><span /><span />
      </button>

      {/* Links */}
      <div className="nav_right">
        {links.map(({ href, label }, i) => (
          <a
            key={href}
            href={href}
            onMouseEnter={() => dispatchAnim(1, `.nav_right a:nth-child(${i+1})`)}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Clock */}
      <div className="nav_clock_s">
        <span className="nav_clock_p">
          {ampm.split('').map((c, i) => (
            <span key={i} className="char"><span className="n">{c}</span></span>
          ))}
        </span>
        <span className="nav_clock_h">
          {hour.split('').map((c, i) => (
            <span key={i} className="char"><span className="n">{c}</span></span>
          ))}
        </span>
        <span className="nav_clock_m">
          {minute.split('').map((c, i) => (
            <span key={i} className="char"><span className="n">{c}</span></span>
          ))}
        </span>
      </div>
    </nav>
  );
}