import { useState, useEffect, useCallback } from "react";

const HEADERS = { "Content-Type": "application/json" };

export default function ItemsPanel() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(() => {
    fetch("/api/items")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const body = JSON.stringify({ name, description: desc });
      if (editId) {
        const r = await fetch(`/api/items/${editId}`, { method: "PUT", headers: HEADERS, body });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        setEditId(null);
      } else {
        const r = await fetch("/api/items", { method: "POST", headers: HEADERS, body });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
      }
      setName("");
      setDesc("");
      fetchItems();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      const r = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      fetchItems();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setDesc(item.description);
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setDesc("");
  };

  return (
    <section>
      <h2>Items</h2>

      {error && <p className="error">Error: {error}</p>}

      <form className="item-form" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <table className="items-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={4}>No items yet — add one above.</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
