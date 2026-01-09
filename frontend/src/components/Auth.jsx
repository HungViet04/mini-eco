import React, { useState } from 'react'
import { api } from '../api'

export default function Auth({ onLogin }){
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({ identifier:'', password:'', name:'', email:'' })

  const submit = async (e)=>{
    e.preventDefault(); setLoading(true); setError(null)
    try{
      if(mode === 'login'){
        const res = await api.post('/auth/login', { identifier: form.identifier, password: form.password }, false)
        onLogin(res.data.accessToken || res.data?.accessToken || res.data)
      } else {
        await api.post('/auth/register', { name: form.name, email: form.email, password: form.password }, false)
        setMode('login')
      }
    }catch(err){ setError(err.body?.error?.message || err.body?.message || 'Error') }
    setLoading(false)
  }

  return (
    <section className="card">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit} className="form">
        {mode === 'register' && (
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        )}
        {mode === 'login' ? (
          <input placeholder="Username or Email" value={form.identifier} onChange={e=>setForm({...form, identifier:e.target.value})} />
        ) : (
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        )}
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />

        {error && <div className="error">{error}</div>}
        <div className="row">
          <button disabled={loading}>{mode === 'login' ? 'Login' : 'Register'}</button>
          <button type="button" className="btn-ghost" onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Switch to Register' : 'Back to Login'}</button>
        </div>
      </form>
    </section>
  )
}
