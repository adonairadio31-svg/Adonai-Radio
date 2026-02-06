import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Lock, LogOut, Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Pin, Settings, Info, Briefcase } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { AboutContent, ServicesContent } from '../types';

const Admin: React.FC = () => {
  const { 
    isAdmin, login, logout, updateAdminPassword,
    news, events, market, programs, partners,
    aboutContent, servicesContent,
    addItem, updateItem, deleteItem,
    updateAboutPage, updateServicesPage
  } = useData();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'events' | 'market' | 'programs' | 'partners' | 'about' | 'services' | 'settings'>('news');
  
  // Edit/Add State for Lists
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit State for Pages (About/Services)
  const [editAbout, setEditAbout] = useState<AboutContent>(aboutContent);
  const [editServices, setEditServices] = useState<ServicesContent>(servicesContent);
  const [servicesListString, setServicesListString] = useState('');

  // Settings State
  const [newPassword, setNewPassword] = useState('');

  // Sync state when data changes
  useEffect(() => {
    setEditAbout(aboutContent);
    setEditServices(servicesContent);
    setServicesListString(servicesContent.serviceList.join('\n'));
  }, [aboutContent, servicesContent]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = () => {
    if (editingItem.id) {
      updateItem(activeTab as any, editingItem.id, editingItem);
    } else {
      addItem(activeTab as any, editingItem);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(activeTab as any, id);
    }
  };

  const openAddModal = () => {
    setEditingItem({ imageUrl: '' }); // Reset
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const togglePin = (item: any) => {
    updateItem(activeTab as any, item.id, { isPinned: !item.isPinned });
  };

  // Page Save Handlers
  const saveAboutPage = () => {
    updateAboutPage(editAbout);
    alert('About page updated successfully!');
  };

  const saveServicesPage = () => {
    const list = servicesListString.split('\n').filter(line => line.trim() !== '');
    updateServicesPage({ ...editServices, serviceList: list });
    alert('Services page updated successfully!');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800 animate-scale-up transform transition-all hover:scale-[1.01]">
           <div className="flex justify-center mb-6">
             <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
               <Lock size={32} />
             </div>
           </div>
           <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Admin Access</h2>
           <form onSubmit={handleLogin} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
               <input 
                 type="password" 
                 className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Enter admin password"
               />
             </div>
             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
             <button 
               type="submit"
               className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition shadow-lg shadow-primary-500/20 transform hover:-translate-y-0.5"
             >
               Unlock Panel
             </button>
           </form>
        </div>
      </div>
    );
  }

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div>
           <label className="block text-sm font-medium mb-1">Title / Name</label>
           <input 
             className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" 
             value={editingItem?.title || editingItem?.name || ''} 
             onChange={e => setEditingItem({...editingItem, [activeTab === 'partners' ? 'name' : 'title']: e.target.value})}
           />
        </div>
        <div>
           <label className="block text-sm font-medium mb-1">Image</label>
           <div className="flex items-center gap-2">
             <input 
               type="file" 
               ref={fileInputRef}
               className="hidden" 
               accept="image/*"
               onChange={handleFileChange}
             />
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-gray-200 dark:bg-slate-700 rounded text-sm hover:bg-gray-300 transition"
             >
                Upload
             </button>
             <input 
                className="flex-1 p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" 
                placeholder="Or paste URL..."
                value={editingItem?.imageUrl || ''} 
                onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
             />
           </div>
           {editingItem?.imageUrl && <img src={editingItem.imageUrl} alt="Preview" className="h-20 mt-2 rounded border" />}
        </div>
      </>
    );

    switch(activeTab) {
      case 'news': return (
        <>
          {commonFields}
          <div><label className="block text-sm font-medium mb-1">Category</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Date</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 h-24 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
        </>
      );
      case 'events': return (
        <>
          {commonFields}
          <div><label className="block text-sm font-medium mb-1">Date</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 h-24 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
        </>
      );
      case 'market': return (
        <>
          {commonFields}
          <div><label className="block text-sm font-medium mb-1">Price</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 h-24 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
        </>
      );
      case 'programs': return (
        <>
          {commonFields}
          <div><label className="block text-sm font-medium mb-1">Time</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.time || ''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Days</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.days || ''} onChange={e => setEditingItem({...editingItem, days: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 h-24 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /></div>
        </>
      );
      case 'partners': return (
        <>
          {commonFields}
          <div><label className="block text-sm font-medium mb-1">Website URL</label><input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none" value={editingItem?.websiteUrl || ''} onChange={e => setEditingItem({...editingItem, websiteUrl: e.target.value})} /></div>
        </>
      );
      default: return null;
    }
  };

  const getActiveList = () => {
    switch(activeTab) {
      case 'news': return news;
      case 'events': return events;
      case 'market': return market;
      case 'programs': return programs;
      case 'partners': return partners;
      default: return [];
    }
  };

  const renderContent = () => {
    if (activeTab === 'settings') {
      return (
        <div className="max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transform transition-all hover:scale-[1.01] hover:shadow-md">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings size={20} /> Security</h3>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium mb-1">New Admin Password</label>
               <input 
                  type="password"
                  className="w-full px-4 py-2 rounded bg-gray-50 dark:bg-slate-800 border focus:ring-2 focus:ring-primary-500 outline-none"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
               />
             </div>
             <button 
               onClick={() => {
                 if (newPassword) {
                   updateAdminPassword(newPassword);
                   setNewPassword('');
                   alert('Password updated successfully');
                 }
               }}
               className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition transform hover:-translate-y-0.5 shadow-md"
             >
               Update Password
             </button>
           </div>
        </div>
      );
    }

    if (activeTab === 'about') {
      return (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Info size={20} /> Edit About Page</h3>
           <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">Mission Statement</label>
                <textarea 
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none h-32"
                   value={editAbout.mission}
                   onChange={e => setEditAbout({...editAbout, mission: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input 
                   type="text"
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                   value={editAbout.email}
                   onChange={e => setEditAbout({...editAbout, email: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input 
                   type="text"
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                   value={editAbout.location}
                   onChange={e => setEditAbout({...editAbout, location: e.target.value})}
                />
             </div>
             <button 
                onClick={saveAboutPage}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 shadow-md transform transition hover:-translate-y-0.5"
             >
                <Check size={18} /> Save Changes
             </button>
           </div>
        </div>
      );
    }

    if (activeTab === 'services') {
      return (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase size={20} /> Edit Services Page</h3>
           <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">Banner Title</label>
                <input 
                   type="text"
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                   value={editServices.bannerTitle}
                   onChange={e => setEditServices({...editServices, bannerTitle: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Banner Subtitle</label>
                <input 
                   type="text"
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none"
                   value={editServices.bannerSubtitle}
                   onChange={e => setEditServices({...editServices, bannerSubtitle: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Main Description</label>
                <textarea 
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none h-24"
                   value={editServices.mainDescription}
                   onChange={e => setEditServices({...editServices, mainDescription: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1">Services List (One per line)</label>
                <textarea 
                   className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 outline-none h-40 font-mono text-sm"
                   value={servicesListString}
                   onChange={e => setServicesListString(e.target.value)}
                   placeholder="Radio Advertising&#10;Live Coverage&#10;..."
                />
             </div>
             <button 
                onClick={saveServicesPage}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 shadow-md transform transition hover:-translate-y-0.5"
             >
                <Check size={18} /> Save Changes
             </button>
           </div>
        </div>
      );
    }

    // Default List View for News, Events, etc.
    return (
      <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold capitalize text-gray-800 dark:text-white">{activeTab} List</h3>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 shadow-md transform transition-transform hover:-translate-y-0.5">
              <Plus size={20} /> Add New
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getActiveList().map((item: any) => (
              <div key={item.id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transform transition-all hover:scale-[1.01] hover:shadow-md">
                 <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.title || item.name} className="w-16 h-16 rounded object-cover bg-gray-100" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{item.title || item.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    {activeTab !== 'partners' && (
                      <button 
                        onClick={() => togglePin(item)}
                        className={`p-2 rounded-full transition ${item.isPinned ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400 hover:text-primary-600'}`}
                        title="Pin to Home"
                      >
                        <Pin size={18} fill={item.isPinned ? "currentColor" : "none"} />
                      </button>
                    )}
                    <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full hover:scale-110 transition-transform"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full hover:scale-110 transition-transform"><Trash2 size={18} /></button>
                 </div>
              </div>
            ))}
            {getActiveList().length === 0 && (
              <p className="text-center text-gray-500 py-10">No items found. Add one to get started.</p>
            )}
          </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your station's content.</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition transform hover:scale-105">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {['news', 'events', 'market', 'programs', 'partners', 'about', 'services', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-t-lg font-medium capitalize transition-colors ${activeTab === tab 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}

      {/* Edit/Add Modal for Lists (News, Events, etc) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${editingItem?.id ? 'Edit' : 'Add'} ${activeTab.slice(0, -1)}`}>
         <div className="p-6 space-y-4">
            {renderFormFields()}
            <div className="flex justify-end gap-3 pt-4">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
               <button onClick={handleSaveItem} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Save Changes</button>
            </div>
         </div>
      </Modal>

    </div>
  );
};

export default Admin;