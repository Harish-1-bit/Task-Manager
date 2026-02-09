import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");

  const isAuthenticated = !!token;

  const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setAuthError(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        email,
        password,
      });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setAuthError(
        error.response?.data?.message ||
          "Registration failed. Please try a different email."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTasks([]);
  };

  const fetchTasks = async () => {
    setTasksLoading(true);
    setTasksError("");
    try {
      const { data } = await axiosInstance.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error(error);
      setTasksError(error.response?.data?.message || "Failed to load tasks.");
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    try {
      const { data } = await axiosInstance.post("/tasks", { title: taskTitle.trim() });
      setTasks((prev) => [data, ...prev]);
      setTaskTitle("");
    } catch (error) {
      console.error(error);
      setTasksError(error.response?.data?.message || "Failed to add task.");
    }
  };

  const toggleTaskCompleted = async (task) => {
    try {
      const { data } = await axiosInstance.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch (error) {
      console.error(error);
      setTasksError(error.response?.data?.message || "Failed to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
      setTasksError(error.response?.data?.message || "Failed to delete task.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="App">
      <header className="navbar">
        <div className="navbar-title">Task Manager</div>
        {isAuthenticated && (
          <div className="navbar-actions">
            <span className="navbar-user">{user?.email}</span>
            <button type="button" className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>
      <div className="container">
        <h1>Mini Task Management System (Admin)</h1>

        {!isAuthenticated ? (
          <div className="card">
            <h2>{isRegisterMode ? "Register Admin" : "Admin Login"}</h2>
            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin@123"
                  required
                />
              </div>
              {authError && <div className="error">{authError}</div>}
              <button type="submit" disabled={authLoading}>
                {authLoading
                  ? isRegisterMode
                    ? "Registering..."
                    : "Logging in..."
                  : isRegisterMode
                  ? "Register"
                  : "Login"}
              </button>
            </form>
            <p className="hint">
              {isRegisterMode
                ? "Register a new admin. You can also use the seeded admin from backend `.env`."
                : "Use existing credentials or switch to Register to create a new admin."}
            </p>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setAuthError("");
                setIsRegisterMode((prev) => !prev);
              }}
            >
              {isRegisterMode ? "Already have an account? Login" : "New here? Register"}
            </button>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleAddTask} className="form inline-form">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title"
              />
              <button type="submit">Add Task</button>
            </form>

            {tasksLoading && <div className="info">Loading tasks...</div>}
            {tasksError && <div className="error">{tasksError}</div>}

            <ul className="task-list">
              {tasks.length === 0 && !tasksLoading && (
                <li className="empty">No tasks yet. Add one above.</li>
              )}
              {tasks.map((task) => (
                <li key={task._id} className="task-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(task)}
                    />
                    <span className={task.completed ? "completed" : ""}>{task.title}</span>
                  </label>
                  <button
                    className="danger"
                    type="button"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
