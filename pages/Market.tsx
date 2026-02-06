import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ContactButtons } from '../components/ui/Buttons';
import { ShoppingBag, Tag, Info } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { MarketItem } from '../types';

const Market: React.FC = () => {
  const { market } = useData();
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  return (
    <div className="p-4 md:p-8 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-accent-500/10 dark:bg-accent-500/20 rounded-xl text-accent-500">
           <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market & Services</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Classifieds and professional services.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {market.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 transform hover:scale-[1.02] group"
          >
            <div className="h-56 overflow-hidden relative">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                 <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{item.description}</p>
              <div className="text-primary-600 dark:text-primary-400 font-bold text-sm flex items-center gap-2">
                 <Info size={16} /> View Details
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Item Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Item Details"
      >
        {selectedItem && (
            <div className="pb-6">
                <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.title} 
                    className="w-full h-64 md:h-80 object-cover"
                />
                <div className="px-6 py-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedItem.title}</h2>
                    {selectedItem.price && (
                        <div className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg font-bold text-lg mb-4">
                            <Tag size={18} />
                            {selectedItem.price}
                        </div>
                    )}
                    
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                        {selectedItem.description}
                    </p>

                    <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-4 text-sm font-medium">Contact the seller directly via</p>
                        <ContactButtons />
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Market;