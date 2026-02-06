import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChevronRight, Calendar, User, Share2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { NewsItem } from '../types';

const News: React.FC = () => {
  const { news } = useData();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <div className="p-4 md:p-8 animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Latest News</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Stay updated with station and community news.</p>
      </div>

      <div className="grid gap-8">
        {news.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedNews(item)}
            className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] cursor-pointer group"
          >
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                 <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-md uppercase tracking-wide">{item.category}</span>
                 <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">{item.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
              <button className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:underline mt-auto w-fit">
                Read Full Story <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* News Details Modal */}
      <Modal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        title="News Article"
      >
        {selectedNews && (
            <article className="pb-8">
                <img 
                    src={selectedNews.imageUrl} 
                    alt={selectedNews.title} 
                    className="w-full h-64 md:h-80 object-cover"
                />
                <div className="px-6 py-6 md:px-8">
                    <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs font-bold rounded-full uppercase tracking-wide mb-4">
                        {selectedNews.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        {selectedNews.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mb-8 border-b border-gray-100 dark:border-slate-800 pb-6">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>{selectedNews.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User size={16} />
                            <span>Adonai Editorial</span>
                        </div>
                    </div>

                    <div className="prose prose-purple dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-loose">
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">{selectedNews.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                        <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                            <Share2 size={18} />
                            <span className="font-medium text-sm">Share Article</span>
                        </button>
                    </div>
                </div>
            </article>
        )}
      </Modal>
    </div>
  );
};

export default News;