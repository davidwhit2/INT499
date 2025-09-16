import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CartProvider from "./context/CartContext";
import NavBar from "./components/NavBar";
import SubscriptionsPage from "./pages/Subscriptions";
import CartPage from "./pages/Cart";

function Home() {
  return (
    <section className="container">
      <h1>Welcome to EZTech Store</h1>
      <p className="muted">
        Browse <strong>Subscriptions</strong> and <strong>Accessories</strong>, then view your <strong>Cart</strong>.
      </p>
    </section>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
