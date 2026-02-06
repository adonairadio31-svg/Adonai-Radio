import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { CONTACT_PHONE, WHATSAPP_LINK } from '../../constants';

export const ContactButtons: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <a 
        href={`tel:${CONTACT_PHONE}`}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all transform active:scale-95"
      >
        <Phone size={18} />
        <span>Call Us</span>
      </a>
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all transform active:scale-95"
      >
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};