// src/lib/startup/useLoadRestApi.js
import { useState, useEffect } from 'react';

export default function useLoadRestApi({
  url = '',
  device = 0,
  webp = 0,
  id = '',
  template = '',
  logged = 0,
  visible = 0,
  webgl = 1,
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${url}?device=${device}&id=${id}&webp=${webp}&template=${template}&logged=${logged}&visible=${visible}&webgl=${webgl}`
        );

        if (!response.ok) throw new Error('Failed to load data');

        setData(await response.json());
      } catch (error) {
        console.error('API Error:', error);
      }
    }

    fetchData();
  }, [url, device, webp, id, template, logged, visible, webgl]);

  return data;
}
