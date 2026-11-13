
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const API = "https://jsonplaceholder.typicode.com/users";

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    city: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // GET
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => alert("Error fetching users"))
      .finally(() => setLoading(false));
  }, []);

  // Input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // POST and PUT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      ...form,
      address: { city: form.city }
    };

    try {
      if (editId) {
        const res = await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setUsers(users.map(user =>
          user.id === editId
            ? { ...data, id: editId }
            : user
        ));

        alert("User Updated!");
      } else {
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setUsers([...users, {
          ...data,
          id: Math.max(0, ...users.map(u => u.id)) + 1
        }]);

        alert("User Added!");
      }

      setForm({
        name: "",
        username: "",
        email: "",
        phone: "",
        website: "",
        city: ""
      });

      setEditId(null);
    } catch {
      alert("Operation failed!");
    }
  };

  // EDIT
  const handleEdit = (user) => {
    setEditId(user.id);

    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      city: user.address?.city || ""
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error();

      setUsers(users.filter(user => user.id !== id));

      if (editId === id) {
        setEditId(null);
        setForm({
          name: "",
          username: "",
          email: "",
          phone: "",
          website: "",
          city: ""
        });
      }

      alert("User Deleted!");
    } catch {
      alert("Delete failed!");
    }
  };

  return (
    <div className="container">
      <h1>User Management CRUD</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <h2>{editId ? "Edit User" : "Add User"}</h2>

        {["name", "username", "email", "phone", "website", "city"].map(field => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            name={field}
            placeholder={field.toUpperCase()}
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}

        <button type="submit">
          {editId ? "Update User" : "Add User"}
        </button>

        {editId && (
          <button type="button" onClick={() => {
            setEditId(null);
            setForm({
              name: "",
              username: "",
              email: "",
              phone: "",
              website: "",
              city: ""
            });
          }}>
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <h2>Users List</h2>

      {loading ? <p>Loading...</p> : (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Website</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.website}</td>
                  <td>{user.address?.city}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
