import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Clock, Radio, Calendar } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ProgramItem } from '../types';

const Programs: React.FC = () => {
  const { programs } = useData();
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  return (
    <div className="p-4 md:p-8 animate-fade-in pb-20">
       <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Program Schedule</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Don't miss your favorite shows.</p>
      </div>

      <div className="space-y-4">
        {programs.map((prog) => (
          <div 
            key={prog.id} 
            onClick={() => setSelectedProgram(prog)}
            className="group flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
          >
            <div className="sm:w-32 h-32 shrink-0">
               <img 
                 src={prog.imageUrl} 
                 alt={prog.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
               />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{prog.title}</h3>
                 <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md">
                    <Clock size={14} />
                    <span>{prog.time}</span>
                 </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center gap-1">
                 <Calendar size={14} /> {prog.days}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{prog.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Program Details Modal */}
      <Modal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        title="Show Details"
      >
        {selectedProgram && (
            <div className="pb-6">
                <div className="relative">
                    <img 
                        src={selectedProgram.imageUrl} 
                        alt={selectedProgram.title} 
                        className="w-full h-64 md:h-72 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedProgram.title}</h2>
                        <div className="flex items-center gap-4 text-white/90 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar size={18} /> {selectedProgram.days}</span>
                            <span className="flex items-center gap-1.5"><Clock size={18} /> {selectedProgram.time}</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
                            <Radio size={24} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">About the Show</h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {selectedProgram.description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                        <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Host & Segments</h5>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                Top Hits Countdown
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                Celebrity Interviews
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                Listener Requests
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Programs;