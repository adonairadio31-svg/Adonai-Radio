import React, { createContext, useContext, useState, useEffect } from 'react';
import { NEWS_DATA, EVENTS_DATA, MARKET_DATA, PROGRAMS_DATA, PARTNERS } from '../constants';
import { NewsItem, EventItem, MarketItem, ProgramItem, Partner, AboutContent, ServicesContent } from '../types';
import { supabase } from '../supabaseClient';

interface DataContextType {
  news: NewsItem[];
  events: EventItem[];
  market: MarketItem[];
  programs: ProgramItem[];
  partners: Partner[];
  aboutContent: AboutContent;
  servicesContent: ServicesContent;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  updateAdminPassword: (newPassword: string) => void;
  addItem: (type: 'news' | 'events' | 'market' | 'programs' | 'partners', item: any) => void;
  updateItem: (type: 'news' | 'events' | 'market' | 'programs' | 'partners', id: number, item: any) => void;
  deleteItem: (type: 'news' | 'events' | 'market' | 'programs' | 'partners', id: number) => void;
  updateAboutPage: (content: AboutContent) => void;
  updateServicesPage: (content: ServicesContent) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_ABOUT: AboutContent = {
  mission: "To provide high-quality entertainment, factual news, and community-driven content that empowers and connects our listeners. We strive to be the bridge between culture, business, and people.",
  email: "info@adonairadio.com",
  location: "Accra, Ghana"
};

const DEFAULT_SERVICES: ServicesContent = {
  bannerTitle: "Our Services",
  bannerSubtitle: "Connecting businesses, community, and entertainment.",
  mainDescription: "Adonai Radio is more than just a radio station. We offer a comprehensive suite of media and marketing services designed to elevate your brand and connect you with your target audience effectively.",
  serviceList: [
    "Radio Advertising & Jingles",
    "Live Event Coverage",
    "Social Media Promotion",
    "Brand Activations",
    "Podcast Production",
    "Community Outreach Programs"
  ]
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [market, setMarket] = useState<MarketItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  
  // Page Content State
  const [aboutContent, setAboutContent] = useState<AboutContent>(DEFAULT_ABOUT);
  const [servicesContent, setServicesContent] = useState<ServicesContent>(DEFAULT_SERVICES);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('@admin1234!');

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Lists
      const { data: newsData } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (newsData && newsData.length > 0) setNews(newsData);
      else setNews(NEWS_DATA);

      const { data: eventsData } = await supabase.from('events').select('*').order('id', { ascending: false });
      if (eventsData && eventsData.length > 0) setEvents(eventsData);
      else setEvents(EVENTS_DATA);

      const { data: marketData } = await supabase.from('market').select('*').order('id', { ascending: false });
      if (marketData && marketData.length > 0) setMarket(marketData);
      else setMarket(MARKET_DATA);

      const { data: progData } = await supabase.from('programs').select('*').order('id', { ascending: false });
      if (progData && progData.length > 0) setPrograms(progData);
      else setPrograms(PROGRAMS_DATA);

      const { data: partnerData } = await supabase.from('partners').select('*').order('id', { ascending: false });
      if (partnerData && partnerData.length > 0) setPartners(partnerData);
      else setPartners(PARTNERS);

      // 2. Fetch Content (About & Services)
      const { data: contentData } = await supabase.from('site_content').select('*');
      
      if (contentData) {
        const aboutRow = contentData.find(r => r.key === 'about');
        if (aboutRow) setAboutContent(aboutRow.content);

        const servicesRow = contentData.find(r => r.key === 'services');
        if (servicesRow) setServicesContent(servicesRow.content);
      }
    };

    fetchData();

    // Check Admin Session
    const storedPwd = localStorage.getItem('adonai_admin_pwd');
    if (storedPwd) setAdminPassword(storedPwd);
    
    const session = sessionStorage.getItem('adonai_admin_session');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const login = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      sessionStorage.setItem('adonai_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('adonai_admin_session');
  };

  const updateAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem('adonai_admin_pwd', newPassword);
  };

  // Generic Helper to sync state to Supabase
  const addItem = async (type: string, item: any) => {
    const newItem = { ...item, id: Date.now() };
    
    // Optimistic Update
    switch (type) {
      case 'news': setNews(prev => [newItem, ...prev]); break;
      case 'events': setEvents(prev => [newItem, ...prev]); break;
      case 'market': setMarket(prev => [newItem, ...prev]); break;
      case 'programs': setPrograms(prev => [newItem, ...prev]); break;
      case 'partners': setPartners(prev => [newItem, ...prev]); break;
    }

    // Supabase Insert
    await supabase.from(type).insert(newItem);
  };

  const updateItem = async (type: string, id: number, updatedItem: any) => {
    const updateList = (list: any[]) => list.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    
    // Optimistic Update
    switch (type) {
      case 'news': setNews(prev => updateList(prev)); break;
      case 'events': setEvents(prev => updateList(prev)); break;
      case 'market': setMarket(prev => updateList(prev)); break;
      case 'programs': setPrograms(prev => updateList(prev)); break;
      case 'partners': setPartners(prev => updateList(prev)); break;
    }

    // Supabase Update
    await supabase.from(type).update(updatedItem).eq('id', id);
  };

  const deleteItem = async (type: string, id: number) => {
    const filterList = (list: any[]) => list.filter(item => item.id !== id);
    
    // Optimistic Update
    switch (type) {
      case 'news': setNews(prev => filterList(prev)); break;
      case 'events': setEvents(prev => filterList(prev)); break;
      case 'market': setMarket(prev => filterList(prev)); break;
      case 'programs': setPrograms(prev => filterList(prev)); break;
      case 'partners': setPartners(prev => filterList(prev)); break;
    }

    // Supabase Delete
    await supabase.from(type).delete().eq('id', id);
  };

  const updateAboutPage = async (content: AboutContent) => {
    setAboutContent(content);
    // Upsert logic for site_content table
    await supabase.from('site_content').upsert({ key: 'about', content: content });
  };

  const updateServicesPage = async (content: ServicesContent) => {
    setServicesContent(content);
    // Upsert logic for site_content table
    await supabase.from('site_content').upsert({ key: 'services', content: content });
  };

  return (
    <DataContext.Provider value={{
      news, events, market, programs, partners, aboutContent, servicesContent,
      isAdmin, login, logout, updateAdminPassword,
      addItem, updateItem, deleteItem,
      updateAboutPage, updateServicesPage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
