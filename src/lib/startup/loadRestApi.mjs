// src/lib/startup/loadRestApi.mjs

export async function loadRestApi({
  url = '',
  device = 0,
  webp = 0,
  id = '',
  template = '',
  logged = 0,
  visible = 0,
  webgl = 1,
}) {
  const info = {
    device,
    webp,
    id,
    template,
    logged,
    webgl,
    visible,
  };

  const formData = new FormData();
  formData.set('form', JSON.stringify(info));

  const isDev = process.env.NODE_ENV === 'development';

  if (document.body.dataset.nonce) {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'X-WP-Nonce': document.body.dataset.nonce,
      },
    });

    const data = await response.json();
    if (isDev && data?.csskfields) console.log(data);
    return data;
  } else {
    const params = new URLSearchParams(info).toString();
    const response = await fetch(`${url}?${params}`, { method: 'GET' });
    const data = await response.json();
    if (isDev && data?.csskfields) console.log(data);
    return data;
  }
}