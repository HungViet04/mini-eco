import React, { useEffect, useState } from 'react'
import { api, getToken } from '../api'

export default function Products(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{ fetchProducts() }, [])

  async function fetchProducts(){
    setLoading(true); setError(null)
    try{
      const res = await api.get('/products', false)
      const rows = res.data || res.data?.data || res.data || res
      setProducts(rows)
    }catch(err){ setError('Failed to load products') }
    setLoading(false)
  }

  return (
    <section>
      <div className="grid">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && products.map(p=> (
          <article key={p.id} className="card">
            <h3>{p.name}</h3>
            <div className="meta">Price: ${p.price} • Stock: {p.stock}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
