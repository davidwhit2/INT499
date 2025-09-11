import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

/* -------------------- Layout -------------------- */
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

/* -------------------- Pages -------------------- */
function HomeStreamList() {
  // Input text
  const [title, setTitle] = useState("");

  // Items with persistence
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("streamlist.items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state for filtering and editing
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Persist items to localStorage
  useEffect(() => {
    localStorage.setItem("streamlist.items", JSON.stringify(items));
  }, [items]);

  // Add item & clear input
  function addItem(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const newItem = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    setTitle("");
    console.log("StreamList item:", trimmed);
  }

  // Toggle complete
  function toggleComplete(id) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, completed: !it.completed } : it
      )
    );
  }

  // Start edit
  function startEdit(id) {
    const it = items.find((x) => x.id === id);
    if (!it) return;
    setEditingId(id);
    setEditingText(it.title);
  }

  // Save / cancel edit
  function saveEdit() {
    const trimmed = editingText.trim();
    if (!trimmed) return cancelEdit();
    setItems((prev) =>
      prev.map((it) => (it.id === editingId ? { ...it, title: trimmed } : it))
    );
    setEditingId(null);
    setEditingText("");
  }
  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  // Delete single
  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  // Bulk clear completed
  function clearCompleted() {
    setItems((prev) => prev.filter((it) => !it.completed));
  }

  // Derived data
  const filtered = useMemo(() => {
    if (filter === "active") return items.filter((i) => !i.completed);
    if (filter === "completed") return items.filter((i) => i.completed);
    return items;
  }, [items, filter]);

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.completed).length;
    return { total, done, left: total - done };
  }, [items]);

  return (
    <div className="stack">
      {/* Composer */}
      <div className="card">
        <h1>Your Streaming List</h1>
        <p className="muted">Add a title, then manage it below.</p>

        <form onSubmit={addItem} className="row" aria-label="Add new item">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Super Troopers"
            aria-label="Title"
          />
          <button type="submit" className="btn primary">
            <span className="material-symbols-outlined">add</span>
            <span>Add</span>
          </button>
        </form>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="Filter items">
            <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterBtn>
            <FilterBtn
              active={filter === "active"}
              onClick={() => setFilter("active")}
            >
              Active
            </FilterBtn>
            <FilterBtn
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </FilterBtn>
          </div>
          <div className="stats">
            <span>{stats.left} left</span>
            <span>•</span>
            <span>{stats.done} done</span>
            {stats.done > 0 && (
              <>
                <span>•</span>
                <button className="link danger" onClick={clearCompleted}>
                  Clear completed
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="card">
        <h2>List</h2>
        {filtered.length === 0 ? (
          <p className="muted">Nothing here yet.</p>
        ) : (
          <ul className="list" aria-live="polite">
            {filtered.map((it) => (
              <li key={it.id} className={`item ${it.completed ? "completed" : ""}`}>
                {/* Complete toggle */}
                <button
                  className="icon-btn"
                  aria-label={it.completed ? "Mark as not completed" : "Mark as completed"}
                  onClick={() => toggleComplete(it.id)}
                  title={it.completed ? "Mark as not completed" : "Mark as completed"}
                >
                  <span className="material-symbols-outlined">
                    {it.completed ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </button>

                {/* Inline editor / title */}
                {editingId === it.id ? (
                  <div className="edit-row">
                    <input
                      autoFocus
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      aria-label="Edit title"
                    />
                    <div className="actions">
                      <button className="icon-btn" title="Save" onClick={saveEdit}>
                        <span className="material-symbols-outlined">check</span>
                      </button>
                      <button className="icon-btn" title="Cancel" onClick={cancelEdit}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="title" title={it.title}>
                    {it.title}
                  </span>
                )}

                {/* Row actions */}
                {editingId !== it.id && (
                  <div className="actions">
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => startEdit(it.id)}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Delete"
                      onClick={() => removeItem(it.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* Small component for filter chips */
function FilterBtn({ active, onClick, children }) {
  return (
    <button
      className={`chip ${active ? "chip-active" : ""}`}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      {children}
    </button>
  );
}

/* Placeholder pages */
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
      <p className="muted">Creating in week 4 & 5</p>
    </section>
  );
}

/* -------------------- App Root -------------------- */
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
