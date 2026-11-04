import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Students from './pages/Students';
import ProtectedRoute from './components/ProtectedRoute';

import { useAuth } from './hooks/useAuth';

import './App.css';

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/students" replace />
                        : <Login />
                }
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/students"
                element={
                    <ProtectedRoute>
                        <Students />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/"
                element={
                    <Navigate
                        to={isAuthenticated ? '/students' : '/login'}
                        replace
                    />
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
