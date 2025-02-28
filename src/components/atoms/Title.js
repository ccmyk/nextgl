"use client";

import { forwardRef } from 'react';

const Title = forwardRef(({ level = 2, children, className, ...props }, ref) => {
  const Tag = `h${level}`;
  
  return (
    <Tag 
      className={className} 
      ref={ref}
      {...props}
    >
      {children}
    </Tag>
  );
});

Title.displayName = 'Title';

export default Title;
