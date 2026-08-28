'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  FileDown, 
  Github, 
  Linkedin, 
  Mail, 
  Layers, 
  Box, 
  Volume2, 
  Cpu, 
  ExternalLink,
  Search,
  X,
  Filter,
  CheckCircle2,
  Terminal,
  Send
} from 'lucide-react';

// Live 15 Systems Data Manifest
const PROJECTS = [
  { id: 'spatialcore', numberPrefix: '01', title: 'SpatialCore', category: 'Web3D & Web Audio', stack: ['Three.js', 'WebGL', 'GLSL', 'Next.js'], summary: 'Real-time 3D product customization studio with PBR materials, orbit physics, and spring-based exploded-view engineering animations.', metrics: '60 FPS WebGL', url: 'https://spatialcore-five.vercel.app' },
  { id: 'soundpulse', numberPrefix: '02', title: 'SoundPulse', category: 'Web3D & Web Audio', stack: ['Web Audio API', 'Wavesurfer.js', 'React', 'DSP'], summary: 'In-browser digital audio workstation featuring 3-band parametric EQ, live waveform region slicing, and zero-latency synthesis.', metrics: '<5ms DSP Latency', url: 'https://soundpulse-five.vercel.app' },
  { id: 'canvasflow', numberPrefix: '03', title: 'CanvasFlow', category: 'Web3D & Web Audio', stack: ['HTML5 Canvas', 'SVG', 'Next.js', 'Framer Motion'], summary: 'Infinite pan/zoom diagramming canvas with smart magnetic connectors, freehand smoothing brushes, and high-res vector exports.', metrics: '60 FPS Pan/Zoom', url: 'https://canvasflow-drab.vercel.app' },
  { id: 'wealthflow', numberPrefix: '04', title: 'WealthFlow', category: 'Fintech & Data Systems', stack: ['Next.js', 'Recharts', 'jsPDF', 'TypeScript'], summary: 'Fintech asset management platform featuring a 500-iteration stochastic Monte Carlo engine plotting 10/25/50-year confidence bands.', metrics: '500-Iteration Engine', url: 'https://wealthflow-zeta.vercel.app' },
  { id: 'incidentpulse', numberPrefix: '05', title: 'IncidentPulse', category: 'Fintech & Data Systems', stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'date-fns'], summary: 'DevOps telemetry deck featuring simulated live WebSocket anomaly streams, keyboard-first Command Palette, and topology maps.', metrics: 'Real-Time Telemetry', url: 'https://incidentpulse.vercel.app' },
  { id: 'codeforge', numberPrefix: '06', title: 'CodeForge', category: 'Fintech & Data Systems', stack: ['Sql.js WASM', 'Monaco Editor', 'React', 'Regex AST'], summary: 'Developer workbench combining an isolated iframe execution sandbox with real-time SQLite WASM querying and regex railroad diagrams.', metrics: '0.38ms In-Memory DB', url: 'https://codeforge-one-phi.vercel.app' },
  { id: 'nexuswiki', numberPrefix: '07', title: 'NexusWiki', category: 'Fintech & Data Systems', stack: ['React', 'D3.js', 'PrismJS', 'Tailwind CSS'], summary: 'Interconnected note-taking app featuring dynamic [[WikiLink]] parsing, real-time LaTeX math rendering, and D3 knowledge cluster graphs.', metrics: 'D3 Force Physics', url: 'https://nexuswiki-five.vercel.app' },
  { id: 'voyageplanner', numberPrefix: '08', title: 'VoyagePlanner', category: 'Fintech & Data Systems', stack: ['Next.js', 'Leaflet', 'dnd-kit', 'Open-Meteo'], summary: 'Travel itinerary architect featuring interactive waypoint routing, drag-and-drop timeline scheduling, and multi-currency bill splitting.', metrics: 'Haversine Routing', url: 'https://voyageplanner-three.vercel.app' },
  { id: 'vitalpulse', numberPrefix: '09', title: 'VitalPulse', category: 'Fintech & Data Systems', stack: ['Next.js', 'Chart.js', 'Lucide', 'Tailwind CSS'], summary: 'Clinical health analytics hub with dynamic time-series biometric charts, medication adherence tracking, and cardiovascular risk calculators.', metrics: 'AHA/ACC Risk Score', url: 'https://vitalpulse-iota.vercel.app' },
  { id: 'havenrealty', numberPrefix: '10', title: 'HavenRealty', category: 'Fintech & Data Systems', stack: ['Next.js', 'Framer Motion', 'SVG Canvas', 'Amortization Engine'], summary: 'Luxury architectural real estate platform with interactive SVG floor plan room hotspots and seasonal date booking calendars.', metrics: 'Yield & Cap Engine', url: 'https://havenrealty-omega.vercel.app' },
  { id: 'chelvie-coffee', numberPrefix: '11', title: 'Chelvie Coffee', category: 'Commercial & Platforms', stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Cart Engine'], summary: 'Artisanal specialty coffee e-commerce storefront featuring interactive brew flavor profiles, dynamic shopping cart drawer, and roast catalogs.', metrics: 'Sub-second LCP', url: 'https://chelvie-coffee.vercel.app' },
  { id: 'sukhmani-car-bazar', numberPrefix: '12', title: 'Sukhmani Car Bazar', category: 'Commercial & Platforms', stack: ['Next.js', 'Lead Engine', 'Financing Solver', 'Tailwind CSS'], summary: 'High-performance automotive inventory & dealership portal featuring real-time vehicle filtering, financing calculators, and lead forms.', metrics: '100% Core Web Vitals', url: 'https://sukhmani-car-bazar.vercel.app' },
  { id: 'theimmigrantcafe', numberPrefix: '13', title: 'The Immigrant Cafe', category: 'Commercial & Platforms', stack: ['React', 'Tailwind CSS', 'Framer Motion', 'UI/UX'], summary: 'Boutique hospitality platform with interactive digital culinary menus, smooth editorial imagery transitions, and direct reservations.', metrics: '60 FPS Micro-Interactions', url: 'https://theimmigrantcafe.vercel.app' },
  { id: 'shreepratham', numberPrefix: '14', title: 'Shree Pratham', category: 'Commercial & Platforms', stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Inquiry Engine'], summary: 'Enterprise business services hub featuring structured service catalogs, corporate inquiry routing, and mobile-optimized service showcase decks.', metrics: 'Mobile-First Audited', url: 'https://shreepratham.vercel.app' },
  { id: 'gighunter', numberPrefix: '15', title: 'GigHunter', category: 'Commercial & Platforms', stack: ['React', 'Tailwind CSS', 'LocalStorage Engine', 'Discovery Alg'], summary: 'Talent marketplace platform with multi-category gig discovery, skill-matching filter algorithms, and client proposal submission workflows.', metrics: 'Local-First Persistence', url: 'https://gighunter-zeta.vercel.app' },
];

const CATEGORIES = [
  { label: 'All Deployments (15)', value: 'All' },
  { label: 'Web3D & Web Audio', value: 'Web3D & Web Audio' },
  { label: 'Fintech & Data Systems', value: 'Fintech & Data Systems' },
  { label: 'Commercial & Platforms', value: 'Commercial & Platforms' },
];

export default function MasterHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = PROJECTS.filter((project) => {
    const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const searchMatch = !query || project.title.toLowerCase().includes(query) || project.summary.toLowerCase().includes(query) || project.stack.some(t => t.toLowerCase().includes(query));
    const tagMatch = !selectedTag || project.stack.some(t => t.toLowerCase().includes(selectedTag.toLowerCase()));
    return categoryMatch && searchMatch && tagMatch;
  });

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f9fafb] selection:bg-amber-500/20 selection:text-amber-200 font-sans overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none z-0 bg-gradient-to-tr from-amber-500/5 via-zinc-500/5 to-transparent blur-[140px]" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] pointer-events-none z-0 bg-gradient-to-tl from-amber-500/5 via-zinc-800/5 to-transparent blur-[160px]" />
      <div className="fixed inset-0 pointer-events-none z-0 noise-grain" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/[0.07] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center font-display font-bold text-amber-300 text-xs">
              AV
            </div>
            <div>
              <span className="font-display font-semibold text-[#f9fafb] text-base tracking-tight block">
                Alok Vishwakarma
              </span>
              <p className="text-[11px] text-zinc-500 font-mono tracking-wider">
                Principal Full-Stack Web Architect
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/yankun22"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/alokvishwa-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/[0.07] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:alokvishwa1998@gmail.com"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 font-medium text-xs hover:bg-white transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inquire</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.015] border border-white/[0.08] text-zinc-300 text-[11px] font-mono tracking-widest uppercase mb-8 shadow-luxury-card backdrop-blur-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
          <span>✦ PRIVATE COMMISSIONS & ARCHITECTURE</span>
        </div>

        {/* Master Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[1.08] text-[#f9fafb]">
          <span className="block font-serif font-normal italic tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-amber-200/90 text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-2">
            Alok Vishwakarma
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#f9fafb] tracking-tight">
            Principal Full-Stack Web Architect & Creative Technologist
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light">
          Engineering state-of-the-art web architectures with specialized mastery in{' '}
          <span className="text-white font-medium underline decoration-amber-400/40 underline-offset-4">Next.js (App Router)</span>,{' '}
          <span className="text-white font-medium underline decoration-amber-400/40 underline-offset-4">TypeScript</span>,{' '}
          <span className="text-white font-medium underline decoration-amber-400/40 underline-offset-4">Three.js WebGL</span>,{' '}
          <span className="text-white font-medium underline decoration-amber-400/40 underline-offset-4">Web Audio API</span>, and{' '}
          <span className="text-white font-medium underline decoration-amber-400/40 underline-offset-4">In-Browser WASM Databases</span>.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#deployments"
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-sm transition-all shadow-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
          >
            <span>Explore Deployments (15)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="mailto:alokvishwa1998@gmail.com"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 hover:border-white/25 text-zinc-200 bg-white/[0.02] hover:bg-white/[0.05] font-medium text-sm backdrop-blur-2xl transition-all"
          >
            <Mail className="w-4 h-4 text-zinc-400" />
            <span>Direct Inquiries</span>
          </a>
        </div>

        {/* Telemetry Matrix */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-white/[0.015] hover:bg-white/[0.035] border border-white/[0.07] hover:border-white/[0.18] backdrop-blur-2xl transition-all duration-500 shadow-luxury-card">
            <div className="flex justify-between items-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#f9fafb]">15 / 15</span>
              <Layers className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs font-medium text-zinc-200 mt-1">Live Systems</p>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Vercel Edge</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.015] hover:bg-white/[0.035] border border-white/[0.07] hover:border-white/[0.18] backdrop-blur-2xl transition-all duration-500 shadow-luxury-card">
            <div className="flex justify-between items-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#f9fafb]">60 FPS</span>
              <Box className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs font-medium text-zinc-200 mt-1">WebGL 3D Engine</p>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Three.js PBR</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.015] hover:bg-white/[0.035] border border-white/[0.07] hover:border-white/[0.18] backdrop-blur-2xl transition-all duration-500 shadow-luxury-card">
            <div className="flex justify-between items-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#f9fafb]">0 ms</span>
              <Cpu className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs font-medium text-zinc-200 mt-1">WASM Client DB</p>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Sql.js Engine</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.015] hover:bg-white/[0.035] border border-white/[0.07] hover:border-white/[0.18] backdrop-blur-2xl transition-all duration-500 shadow-luxury-card">
            <div className="flex justify-between items-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#f9fafb]">&lt;5 ms</span>
              <Volume2 className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs font-medium text-zinc-200 mt-1">Web Audio API</p>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Harmonic DSP</p>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section id="deployments" className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.015] border border-white/[0.08] text-zinc-400 text-[11px] font-mono mb-4 tracking-widest uppercase shadow-luxury-card">
            <Layers className="w-3.5 h-3.5 text-amber-400/80" />
            <span>ARCHITECTURAL DIRECTORY</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#f9fafb] tracking-[-0.03em]">
            Curated Exhibitions
          </h2>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.015] border border-white/[0.07] backdrop-blur-2xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 shadow-pill-active'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 15 deployments..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.015] border border-white/[0.07] text-sm text-[#f9fafb] placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/40"
            />
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-white/[0.015] hover:bg-white/[0.035] border border-white/[0.07] hover:border-white/[0.18] p-6 sm:p-7 backdrop-blur-2xl shadow-luxury-card hover:shadow-luxury-hover transition-all duration-500"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-medium text-zinc-500 tracking-widest">{project.numberPrefix} /</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-white/[0.03] text-zinc-400 border border-white/[0.06]">{project.category}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Live</span>
                  </div>
                </div>

                <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#f9fafb] group-hover:text-amber-100 transition-colors tracking-tight mb-2">
                  {project.title}
                </h3>

                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-white/[0.03] text-amber-200/90 border border-amber-500/15">
                    ✦ {project.metrics}
                  </span>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed mb-5 font-light min-h-[48px]">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.stack.map((tech) => (
                    <span key={tech} className="bg-zinc-900/90 text-zinc-300 border border-zinc-800 text-[11px] px-2 py-0.5 rounded font-mono tracking-wider uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.07] flex items-center gap-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-xs shadow-sm transition-all group-hover:text-amber-950"
                >
                  <span>Launch Live System</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.07] bg-[#050505] text-center text-xs font-mono text-zinc-500">
        <p>© {new Date().getFullYear()} Alok Vishwakarma. Built with Next.js, Three.js WebGL & Web Audio API.</p>
        <p className="mt-1 text-zinc-600">Ultra-Exclusive Obsidian, Brushed Titanium & Warm Ochre Champagne Architecture</p>
      </footer>
    </div>
  );
}
