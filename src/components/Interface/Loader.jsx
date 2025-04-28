// src/components/Interface/Loader.jsx

'use client';

import { useLoader } from '@/hooks/useLoader';
import { useLoadingEvents } from '@/hooks/useLoadingEvents';
import styles from '@/styles/components/loader.pcss';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  // Wire up DOM + GL ready events
  useLoadingEvents();

  const { isLoading, isFadingOut, progress } = useLoader();

  return (
    <AnimatePresence>
      {(isLoading || isFadingOut) && (
        <motion.div
          className={`${styles.loaderOverlay} loader`}
          initial={{ opacity: 1 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.19,1,0.22,1] }}
        >
          {/* Dark background */}
          <div className="loader_bg" />

          {/* Container matching legacy .loader_cnt */}
          <div className="loader_cnt">
            {/* Title portion (e.g. percentage) */}
            <div className="loader_tp">{progress}%</div>

            {/* Center spinner */}
            <div className={styles.loaderContent}>
              <div className={styles.spinner} />
            </div>

            {/* Optional body text */}
            <div className="loader_bp">
              <div className="Awrite">Loading</div>
              <div className="Awrite">{progress}% complete</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}