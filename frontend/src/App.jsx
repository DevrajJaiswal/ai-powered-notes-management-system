import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/notes"
                element={
                    <ProtectedRoute>
                        <Notes />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/notes" replace />}
            />
        </Routes>
    );
};

export default App;