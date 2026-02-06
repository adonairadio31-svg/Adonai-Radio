import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Play, Pause, Volume2, Radio, ExternalLink, Calendar, Newspaper, ShoppingBag, Clock, ArrowRight, MessageCircle, Phone, Cpu, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { ContactButtons } from '../components/ui/Buttons';
import { RADIO_BACKGROUND_URL, BIBLE_VERSES } from '../constants';

interface HomeContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (val: number) => void;
}

const Home: React.FC = () => {
  const { isPlaying, togglePlay, volume, setVolume } = useOutletContext<HomeContextType>();
  const { news, events, market, programs, partners } = useData();
  const [currentPartner, setCurrentPartner] = useState(0);

  // Get pinned or latest items
  const featuredNews = news.find(i => i.isPinned) || news[0];
  const featuredEvent = events.find(i => i.isPinned) || events[0];
  const featuredMarket = market.find(i => i.isPinned) || market[0];
  const featuredProgram = programs.find(i => i.isPinned) || programs[0];

  // Daily Verse Logic
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const dailyVerse = BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length];

  // Auto-slide partners
  useEffect(() => {
    if (partners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPartner((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      
      {/* Header */}
      <header className="mb-4 lg:mb-8 text-center md:text-left">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome to <span className="text-primary-600 dark:text-primary-400">Adonai Radio</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">The heartbeat of the city.</p>
      </header>

      {/* Main Radio Card - Background Image Enabled */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl dark:hover:shadow-none max-w-xl mx-auto group bg-slate-900">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60" 
          style={{ backgroundImage: `url(${RADIO_BACKGROUND_URL})` }}
        ></div>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 backdrop-blur-[2px]"></div>

        <div className="relative p-6 flex flex-col items-center text-center z-10">
          
          {/* Status Badge */}
          <div className="mb-3 flex items-center gap-2 px-2.5 py-0.5 bg-red-500/20 text-red-200 border border-red-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${isPlaying ? '' : 'hidden'}`}></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            {isPlaying ? 'Live' : 'Offline'}
          </div>

          {/* Visualizer / Icon - Glass Effect */}
          <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center mb-4 border border-white/20 ring-1 ring-white/10 relative ${isPlaying ? 'animate-pulse-slow' : ''}`}>
             {isPlaying ? (
                <div className="flex gap-1 items-end h-10">
                  <div className="w-1 bg-primary-400 rounded-full animate-[bounce_1s_infinite] h-5"></div>
                  <div className="w-1 bg-primary-500 rounded-full animate-[bounce_1.2s_infinite] h-8"></div>
                  <div className="w-1 bg-accent-500 rounded-full animate-[bounce_0.8s_infinite] h-12"></div>
                  <div className="w-1 bg-primary-500 rounded-full animate-[bounce_1.1s_infinite] h-6"></div>
                  <div className="w-1 bg-primary-400 rounded-full animate-[bounce_1.3s_infinite] h-3"></div>
                </div>
             ) : (
                <Radio size={40} className="text-white/80" />
             )}
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-md">Live Stream Radio</h2>
          <p className="text-gray-300 text-xs mb-5 max-w-[200px]">Best Music, News, and Entertainment 24/7.</p>

          {/* Controls */}
          <div className="w-full max-w-[240px] space-y-5">
            <button
              onClick={togglePlay}
              className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full shadow-lg text-white transition-all transform hover:scale-105 active:scale-95 ${
                isPlaying 
                ? 'bg-black/50 backdrop-blur-md hover:bg-black/70 border border-white/10' 
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-purple-500/30'
              }`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 hover:border-primary-500/50 transition-colors">
              <Volume2 size={16} className="text-gray-300" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
            
            {/* Contact Buttons */}
            <ContactButtons className="scale-95" />
          </div>
        </div>
      </div>

      {/* Daily Verse Card */}
      <div className="max-w-xl mx-auto w-full transform transition-transform duration-300 hover:scale-[1.01]">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-md border border-amber-100 dark:border-slate-700 relative overflow-hidden group">
          
          {/* Decorative Icon Background */}
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
            <BookOpen size={96} className="text-amber-500 dark:text-amber-400" />
          </div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4">
               <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400 shadow-sm">
                 <BookOpen size={16} />
               </div>
               <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Verse of the Day</span>
             </div>
             
             <blockquote className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-100 italic leading-relaxed mb-4 font-serif">
               "{dailyVerse.text}"
             </blockquote>
             
             <div className="flex items-center justify-end">
               <div className="h-px bg-amber-200 dark:bg-slate-700 w-12 mr-3"></div>
               <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{dailyVerse.reference}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Highlights / Quick Links Section */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">What's Happening</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* News Card */}
            {featuredNews && (
            <Link to="/news" className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                            <Newspaper size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Latest News</span>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all"/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2">{featuredNews.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{featuredNews.description}</p>
                        </div>
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-inner">
                            <img src={featuredNews.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="News" />
                        </div>
                    </div>
                </div>
            </Link>
            )}

            {/* Events Card */}
            {featuredEvent && (
            <Link to="/events" className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-3 py-1 rounded-full">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Event</span>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-pink-600 dark:group-hover:text-pink-400 group-hover:translate-x-1 transition-all"/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2">{featuredEvent.title}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{featuredEvent.date}</div>
                        </div>
                         <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-inner">
                            <img src={featuredEvent.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Event" />
                        </div>
                    </div>
                </div>
            </Link>
            )}

             {/* Market Card */}
             {featuredMarket && (
             <Link to="/market" className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                            <ShoppingBag size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Marketplace</span>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all"/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">{featuredMarket.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{featuredMarket.description}</p>
                        </div>
                         <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-inner">
                            <img src={featuredMarket.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Market" />
                        </div>
                    </div>
                </div>
            </Link>
            )}

             {/* Program Card */}
             {featuredProgram && (
             <Link to="/programs" className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                            <Clock size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">On Air</span>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all"/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">{featuredProgram.title}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{featuredProgram.time}</div>
                        </div>
                         <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-inner">
                            <img src={featuredProgram.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Program" />
                        </div>
                    </div>
                </div>
            </Link>
            )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="pt-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 px-1">Our Partners</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 relative min-h-[300px] flex items-center justify-center overflow-hidden transition-shadow hover:shadow-lg">
          {partners.length > 0 ? partners.map((partner, index) => (
             <a 
              key={partner.id}
              href={partner.websiteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform group
                ${index === currentPartner 
                  ? 'opacity-100 translate-x-0 z-10' 
                  : 'opacity-0 translate-x-8 z-0 pointer-events-none'}`}
             >
                <div className="relative transform transition-transform duration-300 group-hover:scale-110">
                  <img 
                    src={partner.imageUrl} 
                    alt={partner.name}
                    className="h-40 md:h-52 object-contain mb-6 grayscale group-hover:grayscale-0 transition-all duration-300 rounded-lg" 
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow-sm">
                    <ExternalLink size={16} className="text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {partner.name}
                  </p>
                </div>
             </a>
          )) : <p className="text-gray-400">No partners listed yet.</p>}
          
          <div className="absolute bottom-4 flex gap-2 z-20">
            {partners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPartner(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentPartner ? 'bg-primary-500 w-4' : 'bg-gray-200 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Developer Credits - SharkTech IT Solutions */}
      <section className="pt-6">
        <div className="relative group perspective-[1000px]">
           {/* Ambient Glow */}
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
           
           <div className="relative bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-none border border-slate-800 dark:border-slate-700 transform transition-transform duration-500 group-hover:scale-[1.01] overflow-hidden">
              
              {/* Tech Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              {/* Brand Info */}
              <div className="text-center lg:text-left z-10">
                 <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                       <Cpu size={20} className="text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-400">Powering Innovation</span>
                 </div>
                 <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                    App Built & Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 drop-shadow-sm">SharkTech IT Solutions</span>
                 </h3>
                 <p className="text-slate-400 text-sm max-w-md mx-auto lg:mx-0">
                    Delivering cutting-edge mobile and web solutions tailored for the modern digital era.
                 </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 shrink-0 z-10 w-full sm:w-auto">
                 <a 
                    href="https://wa.me/2335356635799" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-1 active:scale-95 group/btn"
                 >
                    <MessageCircle size={20} className="group-hover/btn:animate-bounce" />
                    <span>WhatsApp</span>
                 </a>
                 <a 
                    href="tel:+2335356635799" 
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-1 active:scale-95 group/btn"
                 >
                    <Phone size={20} className="group-hover/btn:animate-pulse" />
                    <span>Call Us</span>
                 </a>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;