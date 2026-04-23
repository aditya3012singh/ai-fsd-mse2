import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, resetError } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { name, email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            toast.success('Account created successfully!');
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(resetError());
        }
    }, [error, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ name, email, password }));
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-150px)]">
            <div className="w-full max-w-[400px] p-10 glass-card">
                <div className="text-center mb-7.5">
                    <h1 className="text-3xl font-bold mb-2.5">Join Us</h1>
                    <p className="text-slate-400">Create an account to start managing lost items</p>
                </div>
                {error && <div className="text-red-500 mb-5 text-center">{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-slate-400 text-sm">Full Name</label>
                        <input className="input-field" type="text" name="name" value={name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter name" required />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-slate-400 text-sm">Email Address</label>
                        <input className="input-field" type="email" name="email" value={email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter email" required />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-slate-400 text-sm">Password</label>
                        <input className="input-field" type="password" name="password" value={password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Create password" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <div className="text-center mt-5 text-slate-400">
                    <p>Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
