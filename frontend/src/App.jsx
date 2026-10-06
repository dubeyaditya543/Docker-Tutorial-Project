import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const API_URL = "/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title || title.trim() === "") {
      return;
    }

    const response = await axios.post(`${API_URL}/tasks`, {
      title,
    });

    setTasks((currentTasks) => [...currentTasks, response.data]);
    setTitle("");
  };

  const toggleTask = async (id) => {
    const response = await axios.patch(`${API_URL}/tasks/${id}`);
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? response.data : task)),
    );
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return (
    <main>
      <h1>Docker Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.title}
            </span>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
