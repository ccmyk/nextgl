// src/app/layout.js

import { useEffect } from 'react';
import { initClient } from '@/lib/startup/initClient.mjs';

export default function AppInitializer() {
  useEffect(() => {
    initClient();
  }, []);

  return null;
}