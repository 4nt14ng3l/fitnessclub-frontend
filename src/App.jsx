import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usersEntity, employeesEntity, workoutsEntity } from './store';
import { EntitySection } from './components/EntitySection';
import './App.css';

const ALLOWED_ACCOUNTS = [
  { email: 'admin@fitness.com', password: '123' },
  { email: 'nastya@gmail.com', password: 'qwerty' },
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

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>
      </div>
      <div className="login-footer">
        First time here? <span className="pink-link">Create your account.</span>
      </div>
    </div>
  );
}

function WorkspacePage({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');

  const users = useSelector(usersEntity.selectors.selectItems);
  const employees = useSelector(employeesEntity.selectors.selectItems);
  const workouts = useSelector(workoutsEntity.selectors.selectItems);

  return (
    <div className="container">
      <div className="user-header">
        <span>
          Вы вошли как: <strong>{currentUser?.email}</strong>
        </span>
        <button onClick={onLogout} className="btn-logout">
          Выйти 🚪
        </button>
      </div>

      <div className="toggle-buttons" style={{ marginBottom: '25px' }}>
        <button
          className={`btn-toggle ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={`btn-toggle ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees ({employees.length})
        </button>
        <button
          className={`btn-toggle ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts ({workouts.length})
        </button>
      </div>

            {activeTab === 'users' &&
        EntitySection({
          title: 'Fitnessclub users',
          entity: usersEntity,
          addLabel: 'Add User',
          saveLabel: 'Save User',
          fields: [
            { name: 'firstName', label: 'FirstName' },
            { name: 'lastName', label: 'LastName' },
            { name: 'email', label: 'Email', type: 'email' },
          ],
        })}

      {activeTab === 'employees' &&
        EntitySection({
          title: 'Fitnessclub employees (TanStack Table)',
          entity: employeesEntity,
          addLabel: 'Add Employee',
          saveLabel: 'Save Employee',
          useLibraryTable: true,
          fields: [
            { name: 'firstName', label: 'FirstName' },
            { name: 'lastName', label: 'LastName' },
            { name: 'position', label: 'Position' },
          ],
        })}

      {activeTab === 'workouts' &&
        EntitySection({
          title: 'Fitnessclub workouts',
          entity: workoutsEntity,
          addLabel: 'Add Workout',
          saveLabel: 'Save Workout',
          fields: [
            { name: 'title', label: 'Title' },
            { name: 'hall', label: 'Hall' },
            { name: 'time', label: 'Time' },
          ],
        })}
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
          element={
            currentUser ? (
              <WorkspacePage currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;