import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // ലോഗിൻ വിവരങ്ങൾ സൂക്ഷിക്കാൻ
  const [token, setToken] = useState(localStorage.getItem('token') || "")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // ടാസ്ക് വിവരങ്ങൾ സൂക്ഷിക്കാൻ
  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState("")

  // സുരക്ഷാ ടോക്കൺ (Token) Django-യിലേക്ക് അയക്കാൻ
  const axiosConfig = {
    headers: { Authorization: `Token ${token}` }
  }

  // ലോഗിൻ ബട്ടൺ അമർത്തുമ്പോൾ പ്രവർത്തിക്കുന്ന ഫംഗ്ഷൻ
  const handleLogin = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/login/', {
      username: username,
      password: password
    })
    .then(response => {
      setToken(response.data.token)
      localStorage.setItem('token', response.data.token) // ലോഗിൻ ബ്രൗസറിൽ സേവ് ചെയ്യാൻ
    })
    .catch(error => {
      alert("തെറ്റായ യൂസർനെയിം അല്ലെങ്കിൽ പാസ്‌വേഡ്!")
      console.error(error)
    })
  }

  // ലോഗൗട്ട് ചെയ്യാൻ
  const handleLogout = () => {
    setToken("")
    localStorage.removeItem('token')
    setTodos([])
  }

  // ടാസ്ക്കുകൾ എടുക്കാൻ (ഇത്തവണ ടോക്കൺ ഉപയോഗിച്ച്)
  const fetchTodos = () => {
    if (!token) return;
    axios.get('http://127.0.0.1:8000/api/todos/', axiosConfig)
      .then(response => setTodos(response.data))
      .catch(error => console.error("Error fetching data:", error))
  }

  // ലോഗിൻ ചെയ്യുമ്പോൾ ടാസ്ക്കുകൾ ലോഡ് ചെയ്യാൻ
  useEffect(() => {
    fetchTodos()
  }, [token]) 

  const addTask = () => {
    if (newTask.trim() === "") return;
    axios.post('http://127.0.0.1:8000/api/todos/', {
      title: newTask,
      completed: false
    }, axiosConfig) // ഇവിടെയും ടോക്കൺ അയക്കുന്നു
    .then(() => {
      setNewTask("");
      fetchTodos();
    })
    .catch(error => console.error("Error saving data:", error))
  }

  const toggleComplete = (todo) => {
    axios.put(`http://127.0.0.1:8000/api/todos/${todo.id}/`, {
      title: todo.title,
      completed: !todo.completed
    }, axiosConfig)
    .then(() => fetchTodos())
    .catch(error => console.error("Error updating data:", error))
  }

  const deleteTask = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`, axiosConfig)
    .then(() => fetchTodos())
    .catch(error => console.error("Error deleting data:", error))
  }

  // ലോഗിൻ ചെയ്തിട്ടില്ലെങ്കിൽ ലോഗിൻ പേജ് മാത്രം കാണിക്കുക
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all mt-2 shadow-md">
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ലോഗിൻ ചെയ്താൽ കാണേണ്ട To-Do പേജ്
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-5 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My To-Do List</h1>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-all border border-red-200">
            Logout
          </button>
        </div>
        
        <div className="flex gap-3 mb-8">
          <input 
            type="text" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            placeholder="What needs to be done?"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button 
            onClick={addTask} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md">
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleComplete(todo)}>
                <span className="text-2xl">{todo.completed ? "✅" : "⏳"}</span>
                <span className={`text-lg ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                  {todo.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(todo.id)}
                className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-all">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App