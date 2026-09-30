import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

const ALLOWED_ACCOUNTS = [
  { email: 'admin@fitness.com', password: '123' },
  { email: 'nastya@gmail.com', password: 'qwerty' }
];

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const account = ALLOWED_ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
      onLogin(account); 
      navigate('/workspace'); 
    } else {
      alert('Неверный Email или Пароль!');
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <h1>Welcome</h1>
        <p className="subtitle">Login to get started!</p>
        
        <form onSubmit={handleLoginSubmit}>
          <div className="login-input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="login-input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn-login">Login</button>
        </form>
      </div>
      <div className="login-footer">
        First time here? <span className="pink-link">Create your account.</span>
      </div>
    </div>
  );
}

function UserCard({ user, onDelete, onEdit }) {
  return (
    <div className="user-card">
      <div className="card-avatar">👤</div>
      <h3>{user.firstName} {user.lastName}</h3>
      <p className="card-email">✉ {user.email}</p>
      <p className="card-id">ID: {user.id}</p>
      <div className="card-actions">
        <button onClick={() => onEdit(user)} className="btn-edit-sm">Edit</button>
        <button onClick={() => onDelete(user.id)} className="btn-delete-sm">Delete</button>
      </div>
    </div>
  );
}

function WorkspacePage({ currentUser, onLogout }) {
  const [users, setUsers] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@gmail.com' },
    { id: 2, firstName: 'Dhiraj', lastName: 'Ray', email: 'only2dhir@gmail.com' },
    { id: 3, firstName: 'Anastasia', lastName: 'Petrova', email: 'nastya@gmail.com' }
  ]);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Заполните все поля!');
      return;
    }

    if (editingId !== null) {
      setUsers(users.map(user => user.id === editingId ? { ...user, ...formData } : user));
      setEditingId(null);
    } else {
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...formData
      };
      setUsers([...users, newUser]);
    }
    setFormData({ firstName: '', lastName: '', email: '' });
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ firstName: '', lastName: '', email: '' });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    if (editingId === id) cancelEdit();
  };

  return (
    <div className="container">
      <div className="user-header">
        <span>Вы вошли как: <strong>{currentUser?.email}</strong></span>
        <button onClick={onLogout} className="btn-logout">Выйти 🚪</button>
      </div>

      <form onSubmit={handleSubmit} className="user-form">
        <button type="submit" className={`btn-submit ${editingId !== null ? 'btn-save-mode' : ''}`}>
          {editingId !== null ? 'Save User' : 'Add User'}
        </button>
        {editingId !== null && (
          <button type="button" onClick={cancelEdit} className="btn-cancel">Cancel</button>
        )}
        
        <div className="input-group">
          <label>FirstName</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>LastName</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
      </form>

      <hr className="divider" />

      <div className="view-toggle-container">
        <h2>Fitnessclub users</h2>
        <div className="toggle-buttons">
          <button className={`btn-toggle ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>📋 Таблица</button>
          <button className={`btn-toggle ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>🎴 Карточки</button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Id</th><th>FirstName</th><th>LastName</th><th>Email</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td><td>{user.firstName}</td><td>{user.lastName}</td><td>{user.email}</td>
                <td>
                  <button onClick={() => startEdit(user)} className="btn-table-edit">Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="btn-table-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="cards-grid">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onDelete={handleDeleteUser} onEdit={startEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setCurrentUser} />} />
        
        <Route 
          path="/workspace" 
          element={currentUser ? <WorkspacePage currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
