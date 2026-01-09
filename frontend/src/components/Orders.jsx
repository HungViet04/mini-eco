import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Orders({ user }){
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    try{ const res = await api.get('/products', false); setProducts(res.data || res || []) }catch(e){}
  }

  function add(p){ setItems([...items, { productId: p.id, quantity: 1 }]) }
  function update(i, qty){ const c = [...items]; c[i].quantity = Number(qty); setItems(c) }
  function remove(i){ const c = [...items]; c.splice(i,1); setItems(c) }

  async function submit(){
    setLoading(true); setMsg(null)
    try{
      const body = { items }
      if(user?.role === 'admin') body.userId = user.id
      const res = await api.post('/orders', body)
      setMsg('Order created: ' + (res.data?.orderId || res.orderId || ''))
      setItems([])
    }catch(err){ setMsg('Error: ' + (err.body?.error?.message || err.body?.message || 'failed')) }
    setLoading(false)
  }

  return (
    <div>
      <div className="grid">
        {products.map(p=> (
          <div key={p.id} className="card small">
            <div className="title">{p.name}</div>
            <div>Price: ${p.price}</div>
            <div>Stock: {p.stock}</div>
            <button onClick={()=>add(p)}>Add</button>
          </div>
        ))}
      </div>

      <section className="card">
        <h3>Cart</h3>
        {items.map((it, i)=> (
          <div key={i} className="row">
            <div>PID: {it.productId}</div>
            <input type="number" value={it.quantity} onChange={e=>update(i, e.target.value)} />
            <button onClick={()=>remove(i)}>Remove</button>
          </div>
        ))}
        <div className="row">
          <button disabled={loading || items.length===0} onClick={submit}>Place Order</button>
        </div>
        {msg && <div className="muted">{msg}</div>}
      </section>
    </div>
  )
}
