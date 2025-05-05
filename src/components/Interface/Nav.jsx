// src/components/Interface/Nav.jsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNavAnimation } from '@/hooks/useNavAnimation';

export default function Nav({ logo, links }) {
  const [isOpen, setIsOpen] = useState(false);

  useNavAnimation(isOpen);

  return (
    <nav className={styles.nav}>
      <div className="nav_logo">{logo}</div>
      <button
        className="nav_burger"
        onClick={() => setIsOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
      <div className="nav_right">
        {links.map(({ href, label }, i) => (
          <Link key={href} href={href}>
            <a>{label}</a>
          </Link>
        ))}
      </div>
    </nav>
  );
}