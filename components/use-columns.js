'use client'

import { useEffect, useState } from 'react'

// 1 column on phones, 2 on tablets, 3 from 1024px.
export function useColumns() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const read = () => setCols(window.innerWidth < 600 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [])
  return cols
}
