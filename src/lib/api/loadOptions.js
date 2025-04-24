export async function loadOptions({
  baseUrl,
  id,
  template,
  device,
  webp,
  webgl
}) {
  const params = new URLSearchParams({
    device,
    id,
    webp,
    template,
    webgl
  })
  const url = `${baseUrl}/wp-json/csskiller/v1/options?${params}`
  const res = await fetch(url, { credentials: 'same-origin' })
  if (!res.ok) {
    throw new Error(`loadOptions failed: ${res.statusText}`)
  }
  return res.json()
}