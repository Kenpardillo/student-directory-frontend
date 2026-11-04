import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Students() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/students',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        logout();
                        navigate('/login');
                        return;
                    }

                    throw new Error(data.error || 'Failed to fetch students.');
                }

                setStudents(Array.isArray(data) ? data : data.students || []);

            } catch (err) {
                setError(err.message || 'Unable to connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStudents();
        } else {
            setLoading(false);
        }
    }, [token, logout, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="students-container">
            <header className="students-header">
                <div>
                    <h1>Student Directory</h1>
                    <p>Welcome, {user?.email || 'User'}!</p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="students-content">
                <h2>Students List</h2>

                {loading && <p>Loading students...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && students.length === 0 && (
                    <p>No students found.</p>
                )}

                {!loading && !error && students.length > 0 && (
                    <div className="student-list">
                        {students.map((student) => (
                            <div
                                className="student-card"
                                key={student._id || student.id}
                            >
                                <h3>
                                    {student.name || student.firstName || 'Unnamed Student'}
                                </h3>
                                <p>
                                    Email: {student.email || 'No email available'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Students;
