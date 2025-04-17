// src/app/page.js
export default function Page() {
  return null
}

export const metadata = {
  // optional
}

export const dynamic = 'force-static' // or 'auto' depending on your config

export async function generateStaticParams() {
  return []
}

export const redirect = {
  permanent: false,
  destination: '/home',
}