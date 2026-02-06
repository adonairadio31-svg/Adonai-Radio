import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ContactButtons } from '../components/ui/Buttons';
import { Modal } from '../components/ui/Modal';
import { EventItem } from '../types';

const Events: React.FC = () => {
  const { events } = useData();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <div className="p-4 md:p-8 animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Join us at the hottest happenings in town.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
               <img 
                 src={event.imageUrl} 
                 alt={event.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold text-gray-900 shadow-sm">
                 {event.date}
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed line-clamp-2">{event.description}</p>
              
              <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
                 View Details
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      <Modal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
            <div className="pb-8">
                <img 
                    src={selectedEvent.imageUrl} 
                    alt={selectedEvent.title} 
                    className="w-full h-64 md:h-80 object-cover"
                />
                <div className="px-6 py-6 md:px-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-lg font-medium text-sm">
                            <CalendarIcon size={18} />
                            <span>{selectedEvent.date}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-medium text-sm">
                             <MapPin size={18} />
                             <span>Main Venue</span>
                        </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About this Event</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                        {selectedEvent.description} 
                        <br/><br/>
                        Don't miss out on this incredible experience. Join the community and be part of the vibe!
                    </p>

                    <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-center">Book Your Spot / Inquire</h4>
                        <ContactButtons />
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;