import React from 'react';
import { Facebook, Instagram, Youtube, Mail, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

const About: React.FC = () => {
  const { aboutContent } = useData();

  return (
    <div className="p-4 md:p-8 animate-fade-in pb-20">
      <div className="text-center mb-10">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Adonai Radio</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-2">The voice of the new generation.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden mb-8">
        <div className="bg-primary-900 dark:bg-primary-950 h-32 relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="px-6 md:px-10 pb-10 -mt-12 relative">
           <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-primary-600 dark:text-primary-400 border-4 border-white dark:border-slate-800 mx-auto md:mx-0">
              <span className="font-bold text-3xl">AR</span>
           </div>
           
           <div className="mt-6 space-y-6">
             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {aboutContent.mission}
                </p>
             </section>
             
             <div className="h-px bg-gray-100 dark:bg-slate-800"></div>

             <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h3>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-primary-600 dark:text-primary-400"><MapPin size={20} /></div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Location</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{aboutContent.location}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-primary-600 dark:text-primary-400"><Mail size={20} /></div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Email</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{aboutContent.email}</p>
                      </div>
                   </div>
                </div>
             </section>
           </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {[
          { icon: Facebook, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: Instagram, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20" },
          { icon: Youtube, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" }
        ].map((social, idx) => (
          <button key={idx} className={`w-12 h-12 rounded-full ${social.bg} ${social.color} flex items-center justify-center shadow-sm hover:scale-110 transition-transform`}>
            <social.icon size={24} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default About;