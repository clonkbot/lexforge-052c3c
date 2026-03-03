import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Contract status types
type ContractStatus = 'drafting' | 'negotiating' | 'signing' | 'active' | 'monitoring';

interface Contract {
  id: string;
  title: string;
  counterparty: string;
  value: string;
  status: ContractStatus;
  progress: number;
  riskLevel: 'low' | 'medium' | 'high';
  daysActive: number;
}

// Sample contracts data
const sampleContracts: Contract[] = [
  { id: '001', title: 'Enterprise SaaS Agreement', counterparty: 'TechCorp Inc.', value: '$2.4M', status: 'negotiating', progress: 67, riskLevel: 'low', daysActive: 12 },
  { id: '002', title: 'Data Processing Addendum', counterparty: 'DataFlow Systems', value: '$890K', status: 'drafting', progress: 34, riskLevel: 'medium', daysActive: 3 },
  { id: '003', title: 'Master Service Agreement', counterparty: 'Global Solutions Ltd', value: '$5.1M', status: 'signing', progress: 89, riskLevel: 'low', daysActive: 28 },
  { id: '004', title: 'NDA - Partnership', counterparty: 'Venture Partners', value: '-', status: 'active', progress: 100, riskLevel: 'low', daysActive: 45 },
  { id: '005', title: 'Licensing Agreement', counterparty: 'MediaMax Corp', value: '$1.2M', status: 'monitoring', progress: 100, riskLevel: 'high', daysActive: 180 },
  { id: '006', title: 'Vendor Agreement', counterparty: 'SupplyChain Pro', value: '$670K', status: 'negotiating', progress: 52, riskLevel: 'medium', daysActive: 8 },
];

const statusColors: Record<ContractStatus, string> = {
  drafting: '#FFB800',
  negotiating: '#00E5FF',
  signing: '#00FF88',
  active: '#8B5CF6',
  monitoring: '#FF6B6B',
};

const statusLabels: Record<ContractStatus, string> = {
  drafting: 'AI Drafting',
  negotiating: 'Negotiating',
  signing: 'E-Signature',
  active: 'Active',
  monitoring: 'Monitoring',
};

// Animated grid background
function GridBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0D0D14] to-[#0A0A0F]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
    </div>
  );
}

// Floating contract node for hero visualization
function ContractNode({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: 'backOut' }}
      className="absolute w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay * 0.5 }}
        className="absolute inset-0 bg-cyan-400 rounded-full"
      />
    </motion.div>
  );
}

// Stats card component
function StatCard({ label, value, suffix, delay }: { label: string; value: string; suffix?: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-xl p-4 md:p-6">
        <p className="text-gray-500 text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">{label}</p>
        <p className="text-2xl md:text-4xl font-semibold text-white">
          {value}
          {suffix && <span className="text-cyan-400 text-lg md:text-2xl ml-1">{suffix}</span>}
        </p>
      </div>
    </motion.div>
  );
}

// Contract row component
function ContractRow({ contract, index }: { contract: Contract; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 md:p-4 hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-3 md:w-36 flex-shrink-0">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusColors[contract.status] }}
            />
            <span className="text-xs uppercase tracking-wider" style={{ color: statusColors[contract.status] }}>
              {statusLabels[contract.status]}
            </span>
          </div>

          {/* Contract info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate text-sm md:text-base">{contract.title}</h4>
            <p className="text-gray-500 text-xs md:text-sm truncate">{contract.counterparty}</p>
          </div>

          {/* Value */}
          <div className="hidden md:block text-right w-24">
            <p className="text-white font-medium">{contract.value}</p>
          </div>

          {/* Progress bar */}
          <div className="md:w-32 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${contract.progress}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: statusColors[contract.status] }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{contract.progress}%</span>
            </div>
          </div>

          {/* Risk badge */}
          <div className="hidden lg:flex items-center justify-end w-20">
            <span
              className={`px-2 py-0.5 rounded text-xs uppercase tracking-wider ${
                contract.riskLevel === 'low'
                  ? 'bg-green-500/10 text-green-400'
                  : contract.riskLevel === 'medium'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {contract.riskLevel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Feature card component
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-5 md:p-8 h-full hover:border-cyan-500/20 transition-all duration-500">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">{title}</h3>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Navigation component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">LexForge</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">Sign In</button>
            <button className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-all duration-300 text-sm">
              Request Demo
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0F] border-t border-white/[0.05]"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-400">Features</a>
              <a href="#dashboard" className="block py-2 text-gray-400">Dashboard</a>
              <a href="#" className="block py-2 text-gray-400">Pricing</a>
              <a href="#" className="block py-2 text-gray-400">Documentation</a>
              <div className="pt-4 border-t border-white/[0.05] space-y-3">
                <button className="w-full py-3 text-gray-400">Sign In</button>
                <button className="w-full py-3 bg-cyan-500 text-black font-medium rounded-lg">Request Demo</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Hero section
function HeroSection() {
  const nodePositions = [
    { x: 10, y: 20 }, { x: 25, y: 40 }, { x: 40, y: 15 }, { x: 55, y: 55 },
    { x: 70, y: 25 }, { x: 85, y: 45 }, { x: 15, y: 70 }, { x: 45, y: 80 },
    { x: 75, y: 75 }, { x: 90, y: 60 }, { x: 30, y: 60 }, { x: 60, y: 35 },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 md:pt-0">
      {/* Contract matrix visualization */}
      <div className="absolute inset-0 overflow-hidden">
        {nodePositions.map((pos, i) => (
          <ContractNode key={i} delay={0.5 + i * 0.1} x={pos.x} y={pos.y} />
        ))}
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.line
            x1="10%" y1="20%" x2="25%" y2="40%"
            stroke="#00E5FF" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          <motion.line
            x1="25%" y1="40%" x2="40%" y2="15%"
            stroke="#00E5FF" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.7, duration: 1 }}
          />
          <motion.line
            x1="40%" y1="15%" x2="70%" y2="25%"
            stroke="#00E5FF" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.9, duration: 1 }}
          />
          <motion.line
            x1="55%" y1="55%" x2="85%" y2="45%"
            stroke="#00E5FF" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 2.1, duration: 1 }}
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 md:mb-8"
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 text-xs md:text-sm font-medium">AI-Native Contract Intelligence</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6 md:mb-8"
          >
            Autonomous
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
              Contract Agents
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mb-8 md:mb-12 leading-relaxed"
          >
            Draft, negotiate, and manage enterprise contracts 10x faster.
            AI agents that learn from your historical deals and execute with precision.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="px-6 py-3 md:px-8 md:py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-all duration-300 text-base md:text-lg hover:shadow-lg hover:shadow-cyan-500/25">
              Deploy Your First Agent
            </button>
            <button className="px-6 py-3 md:px-8 md:py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all duration-300 text-base md:text-lg">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-16 md:mt-24">
          <StatCard label="Faster Execution" value="10" suffix="x" delay={0.8} />
          <StatCard label="Data Points Extracted" value="200" suffix="+" delay={0.9} />
          <StatCard label="Enterprise Contracts" value="50K" suffix="+" delay={1.0} />
          <StatCard label="Time Saved Monthly" value="340" suffix="hrs" delay={1.1} />
        </div>
      </div>
    </section>
  );
}

// Features section
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Context-Aware Drafting',
      description: 'AI generates contracts from business objectives, learning from your historical deals and market benchmarks—not generic templates.',
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Autonomous Negotiation',
      description: 'Negotiates directly with counterparty AI or humans via email and DocuSign, proposing redlines based on your risk tolerance.',
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'E-Signature Workflows',
      description: 'Executes complete signature workflows and extracts 200+ data points per contract for operational intelligence.',
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Compliance Monitoring',
      description: 'Monitors all active agreements for compliance, renewal dates, and renegotiation triggers with auto-escalation.',
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Business Intelligence',
      description: 'Capture critical insights from every agreement. Understand patterns, benchmark terms, and optimize negotiation strategies.',
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Risk Calibration',
      description: 'Define your risk tolerance and fallback positions. AI agents negotiate within your parameters, escalating when needed.',
    },
  ];

  return (
    <section id="features" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Intelligent Contract
            <br />
            <span className="text-gray-500">Lifecycle Automation</span>
          </h2>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto">
            From first draft to final signature, our AI agents handle the entire contract lifecycle with precision.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Dashboard preview section
function DashboardSection() {
  const [activeTab, setActiveTab] = useState<'all' | ContractStatus>('all');

  const filteredContracts = activeTab === 'all'
    ? sampleContracts
    : sampleContracts.filter(c => c.status === activeTab);

  const tabs: { key: 'all' | ContractStatus; label: string }[] = [
    { key: 'all', label: 'All Contracts' },
    { key: 'drafting', label: 'Drafting' },
    { key: 'negotiating', label: 'Negotiating' },
    { key: 'signing', label: 'Signing' },
    { key: 'monitoring', label: 'Monitoring' },
  ];

  return (
    <section id="dashboard" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">Contract Command Center</h2>
              <p className="text-gray-400 text-base md:text-lg">Real-time visibility into every agreement's status and progress.</p>
            </div>
            <button className="self-start md:self-auto px-4 py-2 md:px-5 md:py-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-all text-sm font-medium whitespace-nowrap">
              + New Contract
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contract list */}
        <div className="space-y-2 md:space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredContracts.map((contract, index) => (
              <ContractRow key={contract.id} contract={contract} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl p-4 md:p-6"
          >
            <p className="text-cyan-400 text-xs md:text-sm mb-1">Active Negotiations</p>
            <p className="text-2xl md:text-3xl font-bold text-white">12</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-4 md:p-6"
          >
            <p className="text-amber-400 text-xs md:text-sm mb-1">Pending Signatures</p>
            <p className="text-2xl md:text-3xl font-bold text-white">8</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4 md:p-6"
          >
            <p className="text-green-400 text-xs md:text-sm mb-1">Completed This Month</p>
            <p className="text-2xl md:text-3xl font-bold text-white">47</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-xl p-4 md:p-6"
          >
            <p className="text-red-400 text-xs md:text-sm mb-1">Risk Alerts</p>
            <p className="text-2xl md:text-3xl font-bold text-white">3</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// CTA section
function CTASection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />

          <div className="relative bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-3xl p-8 md:p-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
              Ready to transform
              <br />
              your legal operations?
            </h2>
            <p className="text-gray-400 text-base md:text-xl mb-8 md:mb-10 max-w-xl mx-auto">
              Deploy autonomous contract agents that work 24/7.
              No more bottlenecks. No more delays.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-all duration-300 text-base md:text-lg hover:shadow-lg hover:shadow-cyan-500/25">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 text-white font-medium hover:text-cyan-400 transition-all duration-300 text-base md:text-lg">
                Schedule a Demo →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-white font-semibold">LexForge</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-gray-600 text-sm">© 2024 LexForge. All rights reserved.</p>
        </div>

        {/* Attribution footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.03] text-center">
          <p className="text-gray-600 text-xs">
            Requested by <span className="text-gray-500">@ahmadekoekkoek</span> · Built by <span className="text-gray-500">@clonkbot</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main App component
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-[#0A0A0F] text-white font-sans transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GridBackground />
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DashboardSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
