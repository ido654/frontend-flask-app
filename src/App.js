import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    axios.get("/todos").then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!newText.trim()) return;
    const res = await axios.post("/todos", { text: newText });
    setTodos([...todos, res.data]);
    setNewText("");
  };

  const updateTodo = async (id, text) => {
    const newText = prompt("Edit todo:", text);
    if (newText) {
      await axios.put(`/todos/${id}`, { text: newText });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2>📝 Todo NEW List</h2>
      <input
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(({ id, text }) => (
          <li key={id}>
            {text}
            <button onClick={() => updateTodo(id, text)} style={{ marginLeft: 10 }}>✏️</button>
            <button onClick={() => deleteTodo(id)} style={{ marginLeft: 5 }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
