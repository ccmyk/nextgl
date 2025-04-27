// src/components/Interface/Loader.jsx

'use client';

import { useLoader } from '@/hooks/useLoader';
import { useLoadingEvents } from '@/hooks/useLoadingEvents';
import styles from '@/styles/components/loader.pcss';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  // Subscribe to DOM and GL ready events
  useLoadingEvents();

  const { isLoading, isFadingOut } = useLoader();

  return (
    <AnimatePresence>
      {(isLoading || isFadingOut) && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 1 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.loaderContent}>
            <div className={styles.spinner} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}