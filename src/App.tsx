import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowUpRight, 
  Layers, 
  Clock, 
  Cpu, 
  Activity, 
  ExternalLink, 
  Globe, 
  Compass, 
  X,
  FileCode,
  Tag
} from 'lucide-react';
import { TOOLS } from './data';
import { AIModel } from './types';

export default function App() {
  const [section, setSection] = useState<'cn' | 'global'>('cn');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isStamping, setIsStamping] = useState(false);

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set stamp effect on channel change
  const handleSectionChange = (newSec: 'cn' | 'global') => {
    if (newSec === section) return;
    setIsStamping(true);
    setSection(newSec);
    setActiveTag('ALL'); // Reset tag when changing sections
    setTimeout(() => setIsStamping(false), 380);
  };

  // Quick Tags Map based on descriptions and keywords
  const getTagsForModel = (model: AIModel): string[] => {
    const tags: string[] = [];
    const text = (model.name + ' ' + model.descCn + ' ' + model.descEn + ' ' + model.org).toLowerCase();
    
    if (text.includes('推理') || model.name === 'Claude' || model.name === 'DeepSeek') {
      tags.push('推理大模型 / REASON');
    }
    if (text.includes('开源') || model.name === '千问' || model.name === 'DeepSeek' || model.name === 'Qwen') {
      tags.push('开源大模型 / OPEN');
    }
    if (text.includes('语音') || text.includes('对话') || model.name === 'Doubao' || model.name === 'iFlytek Spark') {
      tags.push('智能对话 / CHAT');
    }
    if (text.includes('多模态') || model.name === 'Gemini' || model.name === 'Claude') {
      tags.push('多模态创作 / MULTI');
    }
    if (text.includes('长上下文') || text.includes('文档') || text.includes('长文本') || model.name === 'Kimi') {
      tags.push('长文本处理 / LONG');
    }
    if (text.includes('api') || text.includes('开发') || model.name?.includes('Platform') || model.name === 'NVIDIA API Catalog' || model.name === 'GLM Open Platform') {
      tags.push('开发者接口 / API');
    }
    return tags;
  };

  // Extract all unique tags dynamically for the current channel
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    TOOLS.filter(t => t.section === section).forEach(m => {
      getTagsForModel(m).forEach(tag => tagsSet.add(tag));
    });
    return ['ALL', ...Array.from(tagsSet)];
  }, [section]);

  // Filter models based on section, query, and category tags
  const filteredModels = useMemo(() => {
    return TOOLS.filter(t => {
      if (t.section !== section) return false;
      
      const matchesSearch = 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.descCn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.descEn.toLowerCase().includes(searchQuery.toLowerCase());
        
      if (!matchesSearch) return false;
      
      if (activeTag !== 'ALL') {
        const modelTags = getTagsForModel(t);
        return modelTags.includes(activeTag);
      }
      
      return true;
    });
  }, [section, searchQuery, activeTag]);

  // Helper to convert hex to rgba for glow effects
  const hexToRgba = (hex: string, alpha: number) => {
    const h = hex.replace('#', '');
    let r = 255, g = 255, b = 255;
    if (h.length === 6) {
      r = parseInt(h.substring(0, 2), 16);
      g = parseInt(h.substring(2, 4), 16);
      b = parseInt(h.substring(4, 6), 16);
    } else if (h.length === 3) {
      r = parseInt(h.substring(0, 1) + h.substring(0, 1), 16);
      g = parseInt(h.substring(1, 2) + h.substring(1, 2), 16);
      b = parseInt(h.substring(2, 3) + h.substring(2, 3), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="min-height-screen bg-bg-dark text-text-primary font-sans selection:bg-accent selection:text-bg-dark overflow-x-hidden pb-12 relative">
      {/* Background Grid Art */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse duration-10000" />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        
        {/* Main Header / Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-b border-white/10 pb-12">
          
          {/* LEFT: Massive Bold Typography Title */}
          <div className="lg:col-span-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                <span className="text-xs uppercase font-mono tracking-[0.25em] text-accent font-semibold">
                  AI 系统控制终端 v4.2 / AI SYSTEM TERMINAL v4.2
                </span>
              </div>
              <h1 className="text-7xl sm:text-8xl md:text-[110px] font-black tracking-[-0.06em] leading-[0.8] uppercase flex items-center gap-4 flex-wrap">
                <span className="text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.05)]">AI HUB</span>
                <motion.div 
                  id="sealMark"
                  className="w-16 h-16 md:w-20 md:h-20 border-2 border-accent flex items-center justify-center text-accent text-3xl md:text-4xl font-extrabold flex-none relative"
                  animate={{ 
                    borderRadius: section === 'cn' ? '4px' : '50%',
                    rotate: section === 'cn' ? -3 : 360,
                    scale: isStamping ? 0.85 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <AnimatePresence mode="wait">
                    {section === 'cn' ? (
                      <motion.span 
                        key="cn" 
                        initial={{ opacity: 0, scale: 0.5 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="font-bold select-none text-2xl md:text-3xl"
                      >
                        国
                      </motion.span>
                    ) : (
                      <motion.div 
                        key="global"
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                        className="flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8"/>
                          <ellipse cx="12" cy="12" rx="3.4" ry="8.4" stroke="currentColor" strokeWidth="1.8"/>
                          <line x1="3.6" y1="12" x2="20.4" y2="12" stroke="currentColor" strokeWidth="1.8"/>
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </h1>
              <div className="mt-8 text-base text-text-muted max-w-xl font-medium leading-relaxed flex flex-col gap-2">
                <p className="text-text-primary text-base md:text-lg font-bold">
                  一页收纳国内外核心大模型入口，极速秒切。
                </p>
                <p className="text-xs uppercase font-mono text-text-muted tracking-tight leading-snug">
                  A single-page portal gathering major domestic and global AI models with instant switching.
                </p>
                <p className="text-white text-sm block mt-2 font-semibold">
                  运用 Bold Typography 极硬朗排版美学，提供极致直达效率。
                </p>
                <p className="text-xs uppercase font-mono text-accent tracking-tight leading-snug">
                  Embodying bold typography design to maximize direct navigational efficiency.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Quick Telementry Statistics Panel (As requested in Design theme) */}
          <div className="lg:col-span-4 bg-[#111111] border border-white/10 rounded-md p-6 font-mono relative overflow-hidden flex flex-col gap-4">
            <div className="absolute top-2 right-4 text-xs text-white/5 font-bold tracking-widest pointer-events-none select-none text-9xl">
              01
            </div>
            <div className="border-b border-white/5 pb-3 flex items-center justify-between">
              <span className="text-[10px] text-text-muted tracking-wider uppercase font-semibold">
                系统实时遥测 / SYSTEM TELEMETRY
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] text-accent font-bold">运行中 / ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted tracking-widest uppercase">
                  当前频道 / SECTION CHANNEL
                </span>
                <span className="text-xs font-bold text-white uppercase mt-1">
                  {section === 'cn' ? '🇨🇳 国内频道 / DOMESTIC' : '🌐 全球频道 / GLOBAL'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted tracking-widest uppercase">
                  匹配节点 / NODES MATCHED
                </span>
                <span className="text-xs font-bold text-accent mt-1">
                  {filteredModels.length} / {TOOLS.filter(t => t.section === section).length} 个节点 / UNITS
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted tracking-widest uppercase">
                  协议链接 / PROTOCOL LINK
                </span>
                <span className="text-xs font-bold text-white mt-1">
                  安全重定向 / SECURE ROUTER
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted tracking-widest uppercase">
                  系统时钟 / SYSTEM CLOCK
                </span>
                <span className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  {currentTime || '00:00:00'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Dashboard Grid - Controls & Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12 items-start">
          
          {/* Controls Panel & Filter Drawer (Left Side on XL) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            
            {/* 1. CHANNEL SELECT (Brutalist Toggle) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-mono tracking-widest text-text-muted font-bold">
                选择频道 / SELECT CHANNEL
              </label>
              <div className="relative bg-[#111111] border border-white/10 rounded-md p-1.5 flex gap-1 items-center">
                <button
                  onClick={() => handleSectionChange('cn')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded transition-colors relative z-10 ${
                    section === 'cn' ? 'text-bg-dark font-black' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {section === 'cn' && (
                    <motion.div
                      layoutId="activeChannelBg"
                      className="absolute inset-0 bg-accent rounded"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-20">国内大模型 / DOMESTIC</span>
                </button>
                <button
                  onClick={() => handleSectionChange('global')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded transition-colors relative z-10 ${
                    section === 'global' ? 'text-bg-dark font-black' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {section === 'global' && (
                    <motion.div
                      layoutId="activeChannelBg"
                      className="absolute inset-0 bg-accent rounded"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-20">全球大模型 / GLOBAL</span>
                </button>
              </div>
            </div>

            {/* 2. SEARCH BOX */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-mono tracking-widest text-text-muted font-bold flex justify-between items-center">
                <span>检索过滤 / SEARCH FILTER</span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] text-accent hover:underline flex items-center gap-1 cursor-pointer font-bold font-mono"
                  >
                    <X className="w-2.5 h-2.5" />
                    清除 / CLEAR
                  </button>
                )}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="搜索模型、厂商 / Search models, orgs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded-md py-3.5 pl-11 pr-4 text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-semibold"
                />
              </div>
            </div>

            {/* 3. QUICK CATEGORY TAGS */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-mono tracking-widest text-text-muted font-bold flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                分类标签 / DISCOVER LABELS
              </label>
              <div className="flex flex-wrap xl:flex-col gap-2">
                {availableTags.map((tag) => {
                  const isActive = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`text-left text-xs uppercase font-mono px-3 py-2.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isActive 
                          ? 'bg-white text-bg-dark border-white font-extrabold shadow-[0_0_12px_rgba(255,255,255,0.1)]' 
                          : 'bg-transparent text-text-muted border-white/10 hover:border-white/35 hover:text-white'
                      }`}
                    >
                      <span>
                        {tag === 'ALL' ? '全部模型 / ALL MODELS' : tag}
                      </span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* MAIN GRID: AI Models List (Right Side on XL) */}
          <div className="xl:col-span-9">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-white">
                  通道索引 / CHANNEL DIRECTORY
                </span>
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                当前显示 {filteredModels.length} 个节点，共 {TOOLS.filter(t => t.section === section).length} 个 / Showing {filteredModels.length} of {TOOLS.filter(t => t.section === section).length} units
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredModels.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#111111] border border-white/10 rounded-md p-12 text-center flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-accent text-lg">
                    ⚠️
                  </div>
                  <h3 className="text-lg font-bold text-white">未找到匹配的结果 / No Results Found</h3>
                  <div className="text-text-muted text-sm max-w-sm flex flex-col gap-1">
                    <p>系统在当前频道中未能检索到与 “{searchQuery}” 匹配的节点。</p>
                    <p className="text-[11px] uppercase font-mono text-text-muted/60 leading-snug">
                      The system could not retrieve any nodes matching "{searchQuery}" in the current channel.
                    </p>
                    <p className="mt-2">请更换检索词或重置分类标签筛选器。</p>
                    <p className="text-[11px] uppercase font-mono text-text-muted/60 leading-snug">
                      Please try another query or reset the category tag filter.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTag('ALL');
                    }}
                    className="mt-4 bg-accent hover:bg-accent/80 text-bg-dark font-black px-6 py-2.5 rounded text-xs transition-all flex flex-col items-center gap-0.5 cursor-pointer font-bold"
                  >
                    <span>重置筛选条件</span>
                    <span className="text-[9px] font-mono tracking-wider">RESET FILTERS</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {(() => {
                    const gridItems: React.ReactNode[] = [];
                    
                    filteredModels.forEach((model, idx) => {
                      // Insert Ad Slot 1 at the 3rd index (0-indexed idx === 2)
                      if (idx === 2) {
                        gridItems.push(
                          <motion.div
                            layout
                            key="ad-slot-1"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#0f110a] border-2 border-dashed border-accent hover:border-solid rounded-md p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[220px] shadow-[0_0_15px_rgba(190,242,100,0.05)] hover:shadow-[0_0_20px_rgba(190,242,100,0.12)] group"
                          >
                            <div className="absolute -bottom-6 -right-3 text-8xl font-black font-mono tracking-tighter text-accent/[0.04] select-none pointer-events-none group-hover:text-accent/[0.06] transition-all duration-300">
                              ADS
                            </div>
                            <div>
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <span className="text-[10px] font-bold font-mono px-2 py-1.5 bg-accent/15 border border-accent/35 text-accent rounded uppercase">
                                  广告赞助 / SPONSOR AD
                                </span>
                                <div className="text-[10px] font-mono text-text-muted">
                                  ADSENSE COMPATIBLE
                                </div>
                              </div>
                              <div className="text-base font-black text-accent leading-snug flex items-center gap-1.5 mt-2">
                                广告展示位 / Google Ads Placeholder
                              </div>
                              <div className="flex flex-col gap-1.5 mt-3 border-t border-white/5 pt-3">
                                <p className="text-xs text-text-primary font-medium leading-relaxed">
                                  极简高点击率自适应广告单元，精准匹配开发者和 AI 探索受众。
                                </p>
                                <p className="text-[10.5px] text-text-muted leading-relaxed font-mono uppercase tracking-tight">
                                  High-CTR display unit. Fully optimized for developer and tech audiences.
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                              <span className="text-text-muted">ID: AD-SLOT-01</span>
                              <span className="text-accent group-hover:underline cursor-pointer font-bold">
                                广告招商咨询 / CONTACT →
                              </span>
                            </div>
                          </motion.div>
                        );
                      }
                      
                      // Insert Ad Slot 2 at the 7th index (0-indexed idx === 6)
                      if (idx === 6) {
                        gridItems.push(
                          <motion.div
                            layout
                            key="ad-slot-2"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#0c101b] border-2 border-dashed border-blue-400/50 hover:border-solid rounded-md p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[220px] shadow-[0_0_15px_rgba(96,165,250,0.05)] hover:shadow-[0_0_20px_rgba(96,165,250,0.12)] group"
                          >
                            <div className="absolute -bottom-6 -right-3 text-8xl font-black font-mono tracking-tighter text-blue-400/[0.04] select-none pointer-events-none group-hover:text-blue-400/[0.06] transition-all duration-300">
                              ADS
                            </div>
                            <div>
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <span className="text-[10px] font-bold font-mono px-2 py-1.5 bg-blue-400/15 border border-blue-400/35 text-blue-400 rounded uppercase">
                                  谷歌广告位 / GOOGLE ADS
                                </span>
                                <div className="text-[10px] font-mono text-text-muted">
                                  AUTO RESPONSIVE SIZE
                                </div>
                              </div>
                              <div className="text-base font-black text-blue-400 leading-snug flex items-center gap-1.5 mt-2">
                                流量变现位 / Monetization Space
                              </div>
                              <div className="flex flex-col gap-1.5 mt-3 border-t border-white/5 pt-3">
                                <p className="text-xs text-text-primary font-medium leading-relaxed">
                                  已适配谷歌广告标准组件。后续直接填入 AdSense 发布的广告代码槽即可获利。
                                </p>
                                <p className="text-[10.5px] text-text-muted leading-relaxed font-mono uppercase tracking-tight">
                                  Configured container ready for custom Google AdSense HTML snippet insertion.
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                              <span className="text-text-muted">ID: AD-SLOT-02</span>
                              <span className="text-blue-400 group-hover:underline cursor-pointer font-bold">
                                商务合作 / INQUIRE →
                              </span>
                            </div>
                          </motion.div>
                        );
                      }

                      const modelTags = getTagsForModel(model);
                      gridItems.push(
                        <motion.a
                          layout
                          key={model.name}
                          href={model.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                          className="group bg-[#111111] hover:bg-[#151515] border border-white/10 hover:border-accent rounded-md p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[220px] cursor-pointer shadow-md"
                          style={{
                            ['--card-accent' as any]: model.color,
                          }}
                        >
                          {/* Background massive monogram watermark */}
                          <div className="absolute -bottom-6 -right-3 text-8xl font-black font-mono tracking-tighter text-white/[0.02] group-hover:text-accent/[0.03] select-none pointer-events-none transition-all duration-300">
                            {model.mono}
                          </div>

                          {/* Card Top Block */}
                          <div>
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <span 
                                className="text-[11px] font-bold font-mono px-2.5 py-1.5 rounded"
                                style={{ 
                                  backgroundColor: hexToRgba(model.color, 0.12),
                                  border: `1px solid ${hexToRgba(model.color, 0.35)}`,
                                  color: model.color 
                                }}
                              >
                                {model.mono}
                              </span>
                              
                              <div className="flex items-center gap-1.5 text-text-muted group-hover:text-accent transition-colors">
                                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                                  安全直达 / REDIRECT
                                </span>
                                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </div>
                            </div>

                            <div className="text-base font-black text-white group-hover:text-accent transition-colors leading-snug flex items-center gap-2 flex-wrap">
                              {model.name}
                              <span className="text-xs font-semibold text-text-muted">（{model.org}）</span>
                            </div>

                            {/* Dual language stacked descriptions */}
                            <div className="flex flex-col gap-1.5 mt-3.5 border-t border-white/5 pt-3">
                              <p className="text-xs text-text-primary font-medium leading-relaxed">
                                {model.descCn}
                              </p>
                              <p className="text-[10.5px] text-text-muted leading-relaxed font-mono uppercase tracking-tight">
                                {model.descEn}
                              </p>
                            </div>
                          </div>

                          {/* Card Bottom Meta */}
                          <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                            {modelTags.length > 0 ? (
                              modelTags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5 hover:border-white/20 transition-all"
                                >
                                  {tag.split(' / ')[0]}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] font-mono text-text-muted uppercase">
                                默认通道 / NAV NODE
                              </span>
                            )}
                          </div>
                        </motion.a>
                      );
                    });

                    // If filteredModels is shorter than 3 items, append at least one ad card so they can always preview it
                    if (filteredModels.length > 0 && filteredModels.length < 3) {
                      gridItems.push(
                        <motion.div
                          layout
                          key="ad-slot-fallback"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#0f110a] border-2 border-dashed border-accent hover:border-solid rounded-md p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[220px] shadow-[0_0_15px_rgba(190,242,100,0.05)] hover:shadow-[0_0_20px_rgba(190,242,100,0.12)] group"
                        >
                          <div className="absolute -bottom-6 -right-3 text-8xl font-black font-mono tracking-tighter text-accent/[0.04] select-none pointer-events-none group-hover:text-accent/[0.06] transition-all duration-300">
                            ADS
                          </div>
                          <div>
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <span className="text-[10px] font-bold font-mono px-2 py-1.5 bg-accent/15 border border-accent/35 text-accent rounded uppercase">
                                广告赞助 / SPONSOR AD
                              </span>
                              <div className="text-[10px] font-mono text-text-muted">
                                ADSENSE COMPATIBLE
                              </div>
                            </div>
                            <div className="text-base font-black text-accent leading-snug flex items-center gap-1.5 mt-2">
                              广告展示位 / Google Ads Placeholder
                            </div>
                            <div className="flex flex-col gap-1.5 mt-3 border-t border-white/5 pt-3">
                              <p className="text-xs text-text-primary font-medium leading-relaxed">
                                极简高点击率自适应广告单元，精准匹配开发者和 AI 探索受众。
                              </p>
                              <p className="text-[10.5px] text-text-muted leading-relaxed font-mono uppercase tracking-tight">
                                High-CTR display unit. Fully optimized for developer and tech audiences.
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-text-muted">ID: AD-SLOT-01</span>
                            <span className="text-accent group-hover:underline cursor-pointer font-bold">
                              广告招商咨询 / CONTACT →
                            </span>
                          </div>
                        </motion.div>
                      );
                    }

                    return gridItems;
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Footer Section */}
        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted font-mono">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
              <span className="text-white/90">点击卡片将安全跳转至官方服务页面 · 整理于 2026 年 7 月</span>
            </div>
            <span className="hidden md:inline text-white/10">|</span>
            <span className="text-[11px] text-text-muted/60">Click cards to securely redirect to official services · Refreshed July 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-accent transition-colors">安全重定向 / SECURE ROUTER</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-accent transition-colors">极简排版 / BOLD MONO V1.0</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
