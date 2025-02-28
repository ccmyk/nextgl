"use client";

import NextLink from 'next/link';
import { forwardRef } from 'react';

const Link = forwardRef(({ href, children, className, target, rel, onClick, ...props }, ref) => {
  // For external links (starting with http or https)
  const isExternal = href?.startsWith('http');
  
  if (isExternal) {
    return (
      <a 
        href={href}
        className={className}
        target={target || "_blank"}
        rel={rel || "noopener noreferrer"}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // For internal links
  return (
    <NextLink 
      href={href}
      className={className}
      onClick={onClick}
      ref={ref}
      {...props}
    >
      {children}
    </NextLink>
  );
});

Link.displayName = 'Link';

export default Link;
