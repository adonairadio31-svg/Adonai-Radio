import React from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

export interface Partner {
  id: number;
  name: string;
  imageUrl: string;
  websiteUrl: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  isPinned?: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  date: string;
  isPinned?: boolean;
}

export interface MarketItem {
  id: number;
  title: string;
  price?: string;
  description: string;
  imageUrl: string;
  isPinned?: boolean;
}

export interface ProgramItem {
  id: number;
  title: string;
  time: string;
  days: string;
  description: string;
  imageUrl: string;
  isPinned?: boolean;
}

export interface AboutContent {
  mission: string;
  email: string;
  location: string;
}

export interface ServicesContent {
  bannerTitle: string;
  bannerSubtitle: string;
  mainDescription: string;
  serviceList: string[];
}