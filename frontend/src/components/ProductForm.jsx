import React, { useState } from 'react'
import { api } from '../api'

export default function ProductForm({ onCreated }){
  const [form, setForm] = useState({ name:'', price:'', stock:'', category_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e)=>{
    e.preventDefault(); setLoading(true); setError(null)
    try{
      const body = { name: form.name, price: Number(form.price), stock: Number(form.stock), category_id: form.category_id || null }
      await api.post('/products', body)
      onCreated && onCreated()
    }catch(err){ setError(err.body?.error?.message || 'Error') }
    setLoading(false)
  }

  return (
    <section className="card">
      <h2>Create Product</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} />
        <input placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} />
        <input placeholder="Category ID (optional)" value={form.category_id} onChange={e=>setForm({...form, category_id:e.target.value})} />
        {error && <div className="error">{error}</div>}
        <div className="row"><button disabled={loading}>Create</button></div>
      </form>
    </section>
  )
}
