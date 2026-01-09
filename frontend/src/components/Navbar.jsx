import React from 'react'

export default function Navbar({ user, onNavigate, onLogout }){
  return (
    <header className="nav">
      <div className="brand" onClick={()=>onNavigate('products')}>SmartShop</div>
      <nav>
        <button onClick={()=>onNavigate('products')}>Products</button>
        <button onClick={()=>onNavigate('orders')}>My Orders</button>
        {user?.role === 'admin' && <button onClick={()=>onNavigate('create')}>Create Product</button>}
        {user ? (
          <button onClick={onLogout} className="btn-ghost">Logout</button>
        ) : (
          <button onClick={()=>onNavigate('auth')}>Login / Register</button>
        )}
      </nav>
    </header>
  )
}
