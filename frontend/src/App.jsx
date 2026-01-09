import React, { useState, useEffect } from 'react'
import { getToken, clearToken, setToken, api } from './api'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Products from './components/Products'
import ProductForm from './components/ProductForm'
import Orders from './components/Orders'

export default function App(){
  const [view, setView] = useState('products')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const token = getToken()
    if(token){
      // try decode minimal info from token payload
      try{
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.id, role: payload.role })
      }catch(e){ setUser(null) }
    }
  },[])

  const handleLogout = ()=>{ clearToken(); setUser(null); setView('products') }

  const onLogin = (token)=>{ setToken(token); try{ const payload = JSON.parse(atob(token.split('.')[1])); setUser({ id: payload.id, role: payload.role }) }catch(e){} setView('products') }

  return (
    <div className="app-root">
      <Navbar user={user} onNavigate={setView} onLogout={handleLogout} />
      <main className="container">
        {view === 'auth' && <Auth onLogin={onLogin} />}
        {view === 'products' && <Products />}
        {view === 'create' && user?.role === 'admin' && <ProductForm onCreated={()=>setView('products')} />}
        {view === 'orders' && <Orders user={user} />}
      </main>
    </div>
  )
}
