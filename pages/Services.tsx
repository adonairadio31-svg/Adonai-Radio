import React, { useState } from 'react';
import { SERVICES_BANNER_URL, CONTACT_PHONE, WHATSAPP_LINK } from '../constants';
import { CheckCircle2, X, ZoomIn, Phone, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const Services: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { servicesContent } = useData();

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Banner with Zoom Trigger */}
      <div 
        className="relative w-full h-64 md:h-80 lg:h-96 cursor-zoom-in group overflow-hidden"
        onClick={() => setIsZoomed(true)}
      >
        <img 
          src={SERVICES_BANNER_URL} 
          alt="Our Services" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end pointer-events-none">
          <div className="p-6 md:p-10 w-full max-w-4xl mx-auto">
             <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{servicesContent.bannerTitle}</h1>
             <p className="text-gray-200 text-lg">{servicesContent.bannerSubtitle}</p>
          </div>
        </div>
        
        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <ZoomIn size={24} />
        </div>
      </div>

      {/* Full Screen Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
           <button 
             className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
             onClick={() => setIsZoomed(false)}
           >
             <X size={32} />
           </button>
           <img 
             src={SERVICES_BANNER_URL} 
             alt="Our Services Full View" 
             className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-up"
           />
        </div>
      )}

      {/* Services List */}
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-12">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h2>
           <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 whitespace-pre-wrap">
             {servicesContent.mainDescription}
           </p>

           <div className="grid md:grid-cols-2 gap-6">
              {servicesContent.serviceList.map((service, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]">
                  <CheckCircle2 className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" size={20} />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{service}</span>
                </div>
              ))}
           </div>
        </div>
        
        {/* CTA */}
        <div className="text-center bg-primary-900 dark:bg-primary-950 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-primary-900/20 dark:shadow-none transition-transform duration-300 hover:scale-[1.01]">
          <h3 className="text-2xl font-bold mb-4">Ready to work with us?</h3>
          <p className="text-primary-200 mb-8">Contact our sales team today to get a custom quote for your business.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-2 bg-white text-primary-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1 active:scale-95"
            >
              <Phone size={20} />
              <span>Call Sales Team</span>
            </a>

            <a 
              href={WHATSAPP_LINK}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white font-bold py-3 px-8 rounded-full hover:bg-[#20bd5a] transition shadow-lg transform hover:-translate-y-1 active:scale-95"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Sales</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;