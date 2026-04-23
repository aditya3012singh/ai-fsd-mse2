import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, searchItems, addItem, deleteItem, updateItem } from '../features/items/itemSlice';
import { Search, Plus, MapPin, Calendar, Phone, Edit, Trash2, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.items);
    const { user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [formData, setFormData] = useState({
        itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            dispatch(fetchItems());
        } else {
            dispatch(searchItems(searchTerm));
        }
    }, [dispatch, searchTerm]);

    const openAddModal = () => {
        setEditMode(false); setSelectedItem(null);
        setFormData({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
        setSelectedFile(null); setPreviewUrl(null); setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditMode(true); setSelectedItem(item);
        setFormData({
            itemName: item.itemName, description: item.description, type: item.type,
            location: item.location, date: item.date ? item.date.split('T')[0] : '', contactInfo: item.contactInfo,
        });
        setPreviewUrl(item.imageUrl ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.imageUrl}` : null);
        setIsModalOpen(true);
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (selectedFile) data.append('image', selectedFile);

        try {
            if (editMode) {
                await dispatch(updateItem({ id: selectedItem._id, itemData: data })).unwrap();
                toast.success('Report updated successfully');
            } else {
                await dispatch(addItem(data)).unwrap();
                toast.success('Item reported successfully!');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this report?')) {
            try {
                await dispatch(deleteItem(id)).unwrap();
                toast.success('Report removed');
            } catch (error) {
                toast.error(error);
            }
        }
    };

    return (
        <div className="container mx-auto px-5 py-10 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Explore Items</h1>
                    <p className="text-slate-400">Help others find what they've lost or report something you found.</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary shadow-lg shadow-indigo-500/20">
                    <Plus size={20} />
                    <span>Report Item</span>
                </button>
            </div>

            <div className="mb-10">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-slate-200 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search items by name..." 
                        className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/[0.03] rounded-2xl outline-none focus:border-white/10 transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <div key={item._id} className="item-card glass-card group border-white/[0.03] hover:border-white/[0.08] bg-[#0c0c0c]">
                        <div className="relative h-56 overflow-hidden rounded-t-xl">
                            <img 
                                src={item.imageUrl ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.imageUrl}` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} 
                                alt={item.itemName} 
                                className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent opacity-60"></div>
                            <span className={`absolute top-4 left-4 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${item.type === 'Lost' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                {item.type}
                            </span>
                        </div>
                        <div className="p-7 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-100">{item.itemName}</h3>
                            <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                    <MapPin size={14} className="text-slate-600" />
                                    <span>{item.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                    <Calendar size={14} className="text-slate-600" />
                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                    <Phone size={14} className="text-slate-600" />
                                    <span>{item.contactInfo}</span>
                                </div>
                            </div>

                            {item.user && item.user._id === user?._id && (
                                <div className="flex gap-3 mt-auto">
                                    <button onClick={() => openEditModal(item)} className="btn btn-outline flex-1 py-2 scale-95 hover:scale-100">
                                        <Edit size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="btn bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all p-2 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[1000] p-5">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-8 md:p-10 relative animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">{editMode ? 'Edit Item' : 'Report New Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={onFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm text-slate-400 mb-2">Item Name</label><input type="text" className="input-field" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} required /></div>
                                <div><label className="block text-sm text-slate-400 mb-2">Type</label><select className="input-field" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}><option value="Lost">Lost</option><option value="Found">Found</option></select></div>
                            </div>
                            <div><label className="block text-sm text-slate-400 mb-2">Description</label><textarea className="input-field" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3"></textarea></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm text-slate-400 mb-2">Location</label><input type="text" className="input-field" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required /></div>
                                <div><label className="block text-sm text-slate-400 mb-2">Date</label><input type="date" className="input-field" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required /></div>
                            </div>
                            <div><label className="block text-sm text-slate-400 mb-2">Contact Info</label><input type="text" className="input-field" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} required placeholder="Email or Phone Number" /></div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Item Image</label>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                                        {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Camera size={32} className="text-slate-500" />}
                                    </div>
                                    <input type="file" id="file-upload" className="hidden" onChange={(e) => { setSelectedFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); }} />
                                    <label htmlFor="file-upload" className="btn btn-outline py-2 cursor-pointer text-sm">Choose Image</label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-full py-4 text-lg mt-4">{editMode ? 'Update Report' : 'Submit Report'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
