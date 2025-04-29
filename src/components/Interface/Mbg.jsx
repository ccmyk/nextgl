// src/components/interface/Mbg.jsx
import React from 'react';
import styles from '@/styles/components/mbg.pcss';

export default function Mbg({ columns = 14 }) {
  // Render `columns` number of <div class="Mbg_col">…
  return (
    <div className={styles.Mbg}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className={styles.Mbg_col}>
          <div className={`${styles.Mbg_col_el} ${styles[`Mbg_col_el-${(i % 2) + 1}`]}`} />
          <div className={`${styles.Mbg_col_el} ${styles[`Mbg_col_el-${(i % 2) + 2}`]}`} />
        </div>
      ))}
    </div>
  );
}