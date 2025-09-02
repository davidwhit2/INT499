import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

// LAYOUT COMPONENT
function Layout({ children }) {
  return (
    <div>
      <header>
        <div className="container nav">
          <div className="spacer" />
          <nav className="menu">
            <NavItem to="/" label="StreamList" icon="format_list_bulleted" end />
            <NavItem to="/movies" label="Movies" icon="movie" />
            <NavItem to="/cart" label="Cart" icon="shopping_cart" />
            <NavItem to="/about" label="About" icon="info" />
          </nav>
        </div>
      </header>

      <main>
        <div className="container">{children}</div>
      </main>

      <footer>
        <div className="container foot">
          <span>© {new Date().getFullYear()} EZTechMovie</span>
        </div>
      </footer>
    </div>
  );
}
// Nav Item
function NavItem({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      <span>{label}</span>
    </NavLink>
  );
}

// Pages
function HomeStreamList() {
  const [title, setTitle] = useState("");
  const [list, setList] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    console.log("StreamList item:", trimmed); // Input logging to console
    setList((prev) => [...prev, trimmed]);
    setTitle("");
  }

  return (
    <div className="stack">
      <div className="card">
        <h1>Your Streaming List</h1>
        <p className="muted">
          Add your streaming list here.
        </p>
        <form onSubmit={handleSubmit} className="row">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Super Troopers"
            aria-label="Add title"
          />
          <button type="submit">Add </button>
        </form>
      </div>

      <div className="card">
        <h2>Preview </h2>
        {list.length === 0 ? (
          <p className="muted">List Empty.</p>
        ) : (
          <ul>
            {list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Movies() {
  return <EmptyPage title="Movies" />;
}

function Cart() {
  return <EmptyPage title="Cart" />;
}

function About() {
  return <EmptyPage title="About" />;
}

function EmptyPage({ title }) {
  return (
    <section className="card" style={{ textAlign: "center", padding: 40 }}>
      <h1>{title}</h1>
      <p className="muted">
        Creating in week 4 & 5
      </p>
    </section>
  );
}

// App Root
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeStreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
