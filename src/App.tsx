/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  PieChart, 
  CloudSun, 
  Zap, 
  Trash2, 
  TrendingUp, 
  Leaf, 
  Droplets, 
  Satellite, 
  Trophy, 
  User, 
  Bot, 
  ArrowRight, 
  MapPin, 
  AlertTriangle, 
  Send,
  Menu,
  X,
  Search,
  Building2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// --- Data ---

const CITIES: Record<string, any> = {
  bangalore: { 
      name: 'Bangalore', 
      temp: '28°', 
      cond: '⛅', 
      humid: '74%', 
      wind: '8', 
      aqi: '58',
      eScore: 78,
      sScore: 82,
      gScore: 91,
      co2: '385',
      energy: '6.8',
      waste: '7.2',
      water: '135',
      desc: 'Garden City, known for its pleasant climate and tech industry',
      tips: 'Use Namma Metro to reduce emissions, Cubbon Park absorbs 130 tons CO₂',
      lat: '12.9716',
      lng: '77.5946',
      bg: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=80'
  },
  hyderabad: { 
      name: 'Hyderabad', 
      temp: '32°', 
      cond: '☀️', 
      humid: '45%', 
      wind: '12', 
      aqi: '72',
      eScore: 72,
      sScore: 78,
      gScore: 85,
      co2: '420',
      energy: '7.5',
      waste: '8.1',
      water: '142',
      desc: 'City of Pearls, HITEC City, growing tech hub',
      tips: 'Metro is 100% solar powered, use public transport',
      lat: '17.3850',
      lng: '78.4867',
      bg: 'https://images.unsplash.com/photo-1605135738133-2fdb10b3f715?auto=format&fit=crop&w=2000&q=80'
  },
  mumbai: { 
      name: 'Mumbai', 
      temp: '31°', 
      cond: '🌧️', 
      humid: '82%', 
      wind: '15', 
      aqi: '95',
      eScore: 68,
      sScore: 71,
      gScore: 76,
      co2: '452',
      energy: '8.2',
      waste: '9.5',
      water: '165',
      desc: 'Financial capital, coastal city, high population density',
      tips: 'Leads in waste-to-energy plants, use local trains',
      lat: '19.0760',
      lng: '72.8777',
      bg: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=2000&q=80'
  },
  delhi: { 
      name: 'Delhi', 
      temp: '36°', 
      cond: '☀️', 
      humid: '38%', 
      wind: '10', 
      aqi: '156',
      eScore: 58,
      sScore: 62,
      gScore: 68,
      co2: '520',
      energy: '9.1',
      waste: '10.2',
      water: '178',
      desc: 'National capital, historical monuments, high AQI',
      tips: 'Metro reduces 3.5 lakh tons CO₂ yearly, use odd-even scheme',
      lat: '28.6139',
      lng: '77.2090',
      bg: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=80'
  },
  chennai: { 
      name: 'Chennai', 
      temp: '34°', 
      cond: '☀️', 
      humid: '68%', 
      wind: '14', 
      aqi: '68',
      eScore: 74,
      sScore: 76,
      gScore: 82,
      co2: '398',
      energy: '7.8',
      waste: '7.8',
      water: '148',
      desc: 'Detroit of India, coastal city, auto hub',
      tips: 'Desalination plants provide 100M liters daily, rainwater harvesting',
      lat: '13.0827',
      lng: '80.2707',
      bg: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80'
  },
  kolkata: { 
      name: 'Kolkata', 
      temp: '30°', 
      cond: '⛅', 
      humid: '78%', 
      wind: '9', 
      aqi: '112',
      eScore: 64,
      sScore: 68,
      gScore: 72,
      co2: '475',
      energy: '8.5',
      waste: '8.9',
      water: '158',
      desc: 'Cultural capital, Howrah Bridge, Victoria Memorial',
      tips: 'Wetlands treat 40% wastewater naturally, use trams',
      lat: '22.5726',
      lng: '88.3639',
      bg: 'https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&w=2000&q=80'
  },
  pune: { 
      name: 'Pune', 
      temp: '29°', 
      cond: '⛅', 
      humid: '62%', 
      wind: '11', 
      aqi: '48',
      eScore: 82,
      sScore: 84,
      gScore: 88,
      co2: '340',
      energy: '6.2',
      waste: '6.5',
      water: '128',
      desc: 'Oxford of East, IT hub, educational center',
      tips: 'Ranks #1 in water conservation, use bicycles',
      lat: '18.5204',
      lng: '73.8567',
      bg: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?auto=format&fit=crop&w=2000&q=80'
  },
  ahmedabad: { 
      name: 'Ahmedabad', 
      temp: '35°', 
      cond: '☀️', 
      humid: '42%', 
      wind: '13', 
      aqi: '88',
      eScore: 70,
      sScore: 74,
      gScore: 80,
      co2: '405',
      energy: '7.9',
      waste: '7.6',
      water: '145',
      desc: 'Heritage city, Sabarmati Ashram, textile hub',
      tips: 'BRTS saves 50,000 tons CO₂ annually, use rapid transit',
      lat: '23.0225',
      lng: '72.5714',
      bg: 'https://images.unsplash.com/photo-1626243171350-425679586119?auto=format&fit=crop&w=2000&q=80'
  }
};

const TIPS = [
  "India's solar capacity grew by 30% in 2025",
  "Delhi metro reduces 3.5 lakh tons CO₂ yearly",
  "Mumbai leads in waste-to-energy plants",
  "Bangalore's Cubbon Park absorbs 130 tons CO₂",
  "Chennai's desalination plants provide 100M liters daily",
  "Hyderabad's metro is 100% solar powered",
  "Pune ranks #1 in water conservation",
  "Ahmedabad's BRTS saves 50,000 tons CO₂ annually",
  "Kolkata's wetlands naturally treat 40% of wastewater"
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      active 
        ? 'bg-white/10 text-white border-l-2 border-white' 
        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const ESGCard = ({ icon: Icon, title, score, label, color, stats }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-3xl p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <Icon className={color} size={24} />
      <span className="font-medium text-white">{title}</span>
    </div>
    <div className="text-4xl font-bold text-white mb-2">{score}</div>
    <div className="text-xs text-zinc-400 mb-4">{label}</div>
    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-6">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className={`h-full ${color.replace('text-', 'bg-')}`}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat: any, i: number) => (
        <div key={i}>
          <div className="text-lg font-semibold text-white">{stat.value}</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon }: any) => (
  <div className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl p-6">
    <div className="text-zinc-400 text-sm mb-2">{label}</div>
    <div className="flex items-end justify-between">
      <div className="text-3xl font-bold text-white">{value}</div>
      {Icon && <Icon className="text-zinc-600" size={20} />}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [currentPage, setCurrentPage] = useState('climatemap');
  const [currentCity, setCurrentCity] = useState('bangalore');
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('roadmap');
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const cityData = CITIES[currentCity];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAIQuery = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are EcoPulse AI, an ESG expert for Indian cities. 
        Current Context: User is looking at ${cityData.name}. 
        City Data: ${JSON.stringify(cityData)}.
        User Question: ${aiInput}
        Provide a concise, insightful response.`,
      });
      const result = await model;
      setAiResponse(result.text || "I'm sorry, I couldn't process that.");
    } catch (error) {
      console.error(error);
      setAiResponse("Error connecting to EcoPulse Intelligence. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!isLaunched) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
        <div 
          className="fixed inset-0 z-[-2] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80')" }}
        />
        <div className="fixed inset-0 z-[-1] bg-black/80" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl w-full bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-[40px] p-12 md:p-20"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-xl">🌍</div>
                <div className="text-2xl font-bold text-white">Eco<span className="font-light text-zinc-400">Pulse</span></div>
              </div>
              
              <h1 className="text-6xl font-bold text-white leading-tight mb-6">
                ESG Intelligence<br />
                <span className="font-light text-zinc-500">for India</span>
              </h1>
              
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Real-time Environmental, Social & Governance monitoring for major Indian cities. 
                Track climate impact, carbon footprint, and sustainability metrics with live satellite data.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-10">
                {['Climate Map', 'ESG Dashboard', 'Energy', 'Waste', 'Carbon', 'Satellite'].map(f => (
                  <div key={f} className="bg-zinc-800/50 border border-zinc-700 py-3 px-4 rounded-xl text-center text-xs text-zinc-400">
                    {f}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsLaunched(true)}
                className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-semibold text-lg hover:bg-zinc-200 transition-all"
              >
                Launch Platform <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex gap-12 mt-12">
                <div>
                  <div className="text-3xl font-bold text-white">1.4B</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">Population</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">Cities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">2.5B</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">kg CO₂</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-3xl p-8 mb-6">
                <div className="flex items-center gap-3 mb-6 text-zinc-400">
                  <MapPin size={18} />
                  <span>India · Live ESG Data</span>
                </div>
                <div className="text-5xl font-bold text-white mb-8">15+ Cities</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/80 p-5 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-emerald-400">78</div>
                    <div className="text-[10px] text-zinc-500 uppercase">E-Score</div>
                  </div>
                  <div className="bg-zinc-900/80 p-5 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-blue-400">82</div>
                    <div className="text-[10px] text-zinc-500 uppercase">S-Score</div>
                  </div>
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
                <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                <p className="text-sm text-amber-200/80">Delhi AQI: 156 · Mumbai: 95 · Bangalore: 58</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-zinc-100">
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${cityData.bg}')` }}
      />
      <div className="fixed inset-0 z-[-1] bg-black/85 backdrop-blur-sm" />

      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl fixed h-full z-20 p-8">
        <div className="text-2xl font-bold text-white mb-12 px-4">
          Eco<span className="font-light text-zinc-400">Pulse</span>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={MapIcon} label="Climate Map" active={currentPage === 'climatemap'} onClick={() => setCurrentPage('climatemap')} />
          <SidebarItem icon={PieChart} label="ESG Dashboard" active={currentPage === 'esg'} onClick={() => setCurrentPage('esg')} />
          <SidebarItem icon={CloudSun} label="Climate" active={currentPage === 'climate'} onClick={() => setCurrentPage('climate')} />
          <SidebarItem icon={Zap} label="Energy" active={currentPage === 'energy'} onClick={() => setCurrentPage('energy')} />
          <SidebarItem icon={Trash2} label="Waste" active={currentPage === 'waste'} onClick={() => setCurrentPage('waste')} />
          <SidebarItem icon={TrendingUp} label="Carbon" active={currentPage === 'carbon'} onClick={() => setCurrentPage('carbon')} />
          <SidebarItem icon={Leaf} label="Agriculture" active={currentPage === 'agriculture'} onClick={() => setCurrentPage('agriculture')} />
          <SidebarItem icon={Droplets} label="Water" active={currentPage === 'water'} onClick={() => setCurrentPage('water')} />
          <SidebarItem icon={Satellite} label="Satellite" active={currentPage === 'satellite'} onClick={() => setCurrentPage('satellite')} />
          <SidebarItem icon={Trophy} label="Leaderboard" active={currentPage === 'leaderboard'} onClick={() => setCurrentPage('leaderboard')} />
          <SidebarItem icon={User} label="Profile" active={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} />
          <SidebarItem icon={Bot} label="AI Insights" active={currentPage === 'ai'} onClick={() => setCurrentPage('ai')} />
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
            <div className="font-medium text-white mb-2">Guest User</div>
            <div className="flex gap-4 text-[10px] text-zinc-500 uppercase tracking-widest">
              <span>🌱 Lvl 1</span>
              <span>🔥 0 Days</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 pb-32">
        <header className="flex justify-between items-center mb-10 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl px-8 py-5">
          <h1 className="text-2xl font-bold text-white capitalize">
            {currentPage.replace('map', ' Map')}
          </h1>
          <div 
            onClick={() => {
              const keys = Object.keys(CITIES);
              const next = keys[(keys.indexOf(currentCity) + 1) % keys.length];
              setCurrentCity(next);
            }}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full cursor-pointer transition-colors text-sm"
          >
            <MapPin size={14} className="text-emerald-400" />
            <span className="font-medium">{cityData.name}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + currentCity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'climatemap' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-[32px] p-6">
                  <div className="flex gap-4 mb-6">
                    <select 
                      value={currentCity}
                      onChange={(e) => setCurrentCity(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-6 py-3 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                    >
                      {Object.keys(CITIES).map(k => <option key={k} value={k}>{CITIES[k].name}</option>)}
                    </select>
                    <div className="flex bg-zinc-800 rounded-full p-1">
                      <button 
                        onClick={() => setMapView('roadmap')}
                        className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${mapView === 'roadmap' ? 'bg-white text-black' : 'text-zinc-400'}`}
                      >
                        Map
                      </button>
                      <button 
                        onClick={() => setMapView('satellite')}
                        className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${mapView === 'satellite' ? 'bg-white text-black' : 'text-zinc-400'}`}
                      >
                        Satellite
                      </button>
                    </div>
                  </div>
                  
                  <div className="aspect-video w-full bg-zinc-800 rounded-2xl overflow-hidden relative">
                    <iframe 
                      className="w-full h-full border-none grayscale invert contrast-125 opacity-80"
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d${cityData.lng}!3d${cityData.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDU4JzI3LjgiTiA3N8KwMzUnNDAuNSJF!5e0!3m2!1sen!2sin!4v1645876543210!5m2!1sen!2sin&t=${mapView === 'satellite' ? 'k' : 'm'}`}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-white">{cityData.name} Climate Data</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-zinc-800/50 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-1">{cityData.temp}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Temperature</div>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">{cityData.humid}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Humidity</div>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-zinc-300 mb-1">{cityData.wind} <span className="text-sm font-normal">km/h</span></div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Wind</div>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-2xl text-center">
                      <div className="text-3xl font-bold text-amber-400 mb-1">{cityData.aqi}</div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">AQI</div>
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700/50 text-zinc-400 text-sm leading-relaxed">
                    {cityData.desc}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'esg' && (
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <ESGCard 
                    icon={Leaf} 
                    title="Environmental" 
                    score={cityData.eScore} 
                    label="E-Score · Above National Avg" 
                    color="text-emerald-400"
                    stats={[
                      { value: cityData.co2, label: 'kg CO₂' },
                      { value: cityData.energy, label: 'kWh' }
                    ]}
                  />
                  <ESGCard 
                    icon={Users} 
                    title="Social" 
                    score={cityData.sScore} 
                    label="S-Score · Community Impact" 
                    color="text-blue-400"
                    stats={[
                      { value: cityData.waste, label: 'kg Waste' },
                      { value: cityData.water, label: 'L Water' }
                    ]}
                  />
                  <ESGCard 
                    icon={Building2} 
                    title="Governance" 
                    score={cityData.gScore} 
                    label="G-Score · Transparency" 
                    color="text-amber-400"
                    stats={[
                      { value: '94%', label: 'Compliance' },
                      { value: '12', label: 'Initiatives' }
                    ]}
                  />
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-lg font-medium text-white mb-8">ESG Trend · Last 12 Months</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Environmental', val: cityData.eScore, color: 'bg-emerald-400' },
                      { label: 'Social', val: cityData.sScore, color: 'bg-blue-400' },
                      { label: 'Governance', val: cityData.gScore, color: 'bg-amber-400' }
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-zinc-400 mb-2 uppercase tracking-widest">
                          <span>{item.label}</span>
                          <span>{item.val}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {['climate', 'energy', 'waste', 'carbon', 'agriculture', 'water'].includes(currentPage) && (
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <StatCard label="Primary Metric" value={cityData[currentPage === 'climate' ? 'temp' : currentPage === 'energy' ? 'energy' : currentPage === 'waste' ? 'waste' : currentPage === 'carbon' ? 'co2' : currentPage === 'water' ? 'water' : '12']} icon={Zap} />
                  <StatCard label="Secondary Metric" value={cityData.aqi} icon={CloudSun} />
                  <StatCard label="Efficiency" value="↑ 12%" icon={TrendingUp} />
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-lg font-medium text-white mb-8 capitalize">{currentPage} Distribution</h3>
                  <div className="space-y-6">
                    {['Category A', 'Category B', 'Category C'].map((cat, i) => (
                      <div key={cat}>
                        <div className="flex justify-between text-xs text-zinc-400 mb-2 uppercase tracking-widest">
                          <span>{cat}</span>
                          <span>{80 - i * 20}%</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${80 - i * 20}%` }}
                            className="h-full bg-white/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'satellite' && (
              <div className="space-y-8">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-lg font-medium text-white mb-8">Satellite Imagery · Indian Cities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(CITIES).map(key => (
                      <button 
                        key={key}
                        onClick={() => setCurrentCity(key)}
                        className={`p-4 rounded-2xl border transition-all ${currentCity === key ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700'}`}
                      >
                        <div className="text-sm font-medium text-white mb-1">{CITIES[key].name}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{CITIES[key].cond} {CITIES[key].temp}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-medium text-white">{cityData.name} · High Resolution</h3>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Source: ISRO EOS-04</div>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-800 relative group">
                    <img 
                      src={cityData.bg} 
                      alt={cityData.name} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                      <div>
                        <div className="text-2xl font-bold text-white mb-2">{cityData.name}</div>
                        <div className="text-sm text-zinc-400">Lat: {cityData.lat} · Lng: {cityData.lng}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'leaderboard' && (
              <div className="space-y-8">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-lg font-medium text-white mb-8">Sustainability Leaderboard · India</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Priya K.', city: 'Bangalore', pts: 4870, level: 12 },
                      { name: 'Rahul S.', city: 'Hyderabad', pts: 4650, level: 11 },
                      { name: 'Anita M.', city: 'Pune', pts: 4210, level: 10 },
                      { name: 'Vikram R.', city: 'Mumbai', pts: 3980, level: 9 },
                      { name: 'Deepa N.', city: 'Chennai', pts: 3760, level: 8 },
                      { name: 'Arjun K.', city: 'Delhi', pts: 3540, level: 7 }
                    ].map((user, i) => (
                      <div key={i} className="flex items-center gap-6 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${i < 3 ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-zinc-500">{user.city}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{user.pts} pts</div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Level {user.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'profile' && (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-10 text-center">
                  <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-zinc-500 border-4 border-zinc-700">
                    G
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Guest User</h2>
                  <p className="text-zinc-500 text-sm mb-8">Level 1 Sustainability Advocate · {cityData.name}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-zinc-800/50 p-4 rounded-2xl">
                      <div className="text-xl font-bold text-white">0</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Points</div>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-2xl">
                      <div className="text-xl font-bold text-white">0</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Streak</div>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-2xl">
                      <div className="text-xl font-bold text-white">0</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Badges</div>
                    </div>
                  </div>

                  <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-2xl font-medium transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {currentPage === 'ai' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-10 text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Bot className="text-emerald-400" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">EcoPulse Intelligence</h2>
                  <p className="text-zinc-400 max-w-lg mx-auto mb-10">
                    Ask me anything about sustainability, climate data, or ESG metrics for Indian cities. 
                    I have access to real-time satellite insights and historical trends.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    {[
                      "What's the climate in Bangalore?",
                      "Tell me about Mumbai's ESG scores",
                      "Sustainability tips for Delhi",
                      "Compare Pune and Hyderabad"
                    ].map(q => (
                      <button 
                        key={q}
                        onClick={() => {
                          setAiInput(q);
                          handleAIQuery();
                        }}
                        className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-2xl text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* AI Chat Bar */}
        <div className="fixed bottom-10 left-80 right-10 z-30">
          <AnimatePresence>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-6 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl text-sm text-zinc-200 shadow-2xl relative"
              >
                <button 
                  onClick={() => setAiResponse(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
                <div className="flex gap-4">
                  <Bot className="text-emerald-400 shrink-0" size={20} />
                  <div className="leading-relaxed prose prose-invert prose-sm max-w-none">
                    <Markdown>{aiResponse}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 rounded-full p-2 flex items-center gap-4 shadow-2xl">
            <div className="pl-6 text-zinc-500">
              <Bot size={20} />
            </div>
            <input 
              type="text" 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              placeholder={`Ask about ${cityData.name}...`}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm py-3"
            />
            <button 
              onClick={handleAIQuery}
              disabled={isAiLoading}
              className="bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {isAiLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>

        {/* Eco Tip Toast */}
        <motion.div 
          key={tipIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-28 right-10 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-3 text-xs text-zinc-400 z-20"
        >
          <Leaf size={14} className="text-emerald-500" />
          {TIPS[tipIndex]}
        </motion.div>
      </main>
    </div>
  );
}
