import { ReputableSource } from '../types';

export const REPUTABLE_NEWS_SOURCES: ReputableSource[] = [
  {
    id: 'gse-official',
    name: 'Ghana Stock Exchange (GSE)',
    category: 'Official Exchange',
    reputation: 'Government / Official',
    website: 'https://gse.com.gh',
    verified: true
  },
  {
    id: 'sec-ghana',
    name: 'Securities and Exchange Commission (SEC Ghana)',
    category: 'Central Bank / Regulator',
    reputation: 'Licensed Regulatory',
    website: 'https://sec.gov.gh',
    verified: true
  },
  {
    id: 'bank-of-ghana',
    name: 'Bank of Ghana (BoG)',
    category: 'Central Bank / Regulator',
    reputation: 'Government / Official',
    website: 'https://bog.gov.gh',
    verified: true
  },
  {
    id: 'joy-business',
    name: 'JoyBusiness (MyJoyOnline)',
    category: 'Financial News',
    reputation: 'Top Tier National Media',
    website: 'https://myjoyonline.com/business',
    verified: true
  },
  {
    id: 'citi-business',
    name: 'Citi Business News Ghana',
    category: 'Financial News',
    reputation: 'Top Tier National Media',
    website: 'https://citibusinessnews.com',
    verified: true
  },
  {
    id: 'graphic-business',
    name: 'Graphic Business Online',
    category: 'Financial News',
    reputation: 'Top Tier National Media',
    website: 'https://graphic.com.gh/business',
    verified: true
  },
  {
    id: 'bft-ghana',
    name: 'Business & Financial Times (B&FT)',
    category: 'Financial News',
    reputation: 'Top Tier National Media',
    website: 'https://thebftonline.com',
    verified: true
  },
  {
    id: 'bloomberg-africa',
    name: 'Bloomberg Africa Markets',
    category: 'Global Media',
    reputation: 'International Wire',
    website: 'https://bloomberg.com/africa',
    verified: true
  },
  {
    id: 'reuters-africa',
    name: 'Reuters West Africa Desk',
    category: 'Global Media',
    reputation: 'International Wire',
    website: 'https://reuters.com/world/africa',
    verified: true
  }
];
