import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { LogOut, PackageSearch, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        toast.success('Logged out safely');
    };

    return (
        <nav className="sticky top-0 z-[100] bg-[var(--color-bg-matte)]/80 backdrop-blur-md border-b border-white/[0.05]">
            <div className="container mx-auto px-6 h-[80px] flex justify-between items-center max-w-7xl">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                        <PackageSearch className="text-slate-100" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">LostFound.io</span>
                </Link>
                <div className="flex items-center gap-8">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/[0.02] rounded-full border border-white/[0.03]">
                                <User size={16} className="text-slate-400" />
                                <span className="text-sm font-medium text-slate-300">{user?.name}</span>
                            </div>
                            <button onClick={onLogout} className="btn btn-outline py-2 border-none hover:bg-red-500/10 hover:text-red-400 group">
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="btn btn-primary py-2 px-6 shadow-none">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
