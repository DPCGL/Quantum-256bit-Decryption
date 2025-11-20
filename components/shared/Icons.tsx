
import React from 'react';

const SVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props} />
);

export const SiriusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props} strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.71a2 2 0 0 0 1.25.13l.23-.05a2 2 0 0 1 1.98 1.55l.23.89a2 2 0 0 0 1.98 1.55l.23.05c.98.22 1.55 1.25 1.33 2.23l-.23.89a2 2 0 0 0 0 2.44l.23.89c.22.98-.35 2.01-1.33 2.23l-.23.05a2 2 0 0 1-1.98 1.55l-.23.89a2 2 0 0 0-1.98 1.55l-.23.05A2.5 2.5 0 0 1 9.5 22M14.5 2a2.5 2.5 0 0 0-2.5 2.5v1.71a2 2 0 0 1-1.25.13l-.23-.05a2 2 0 0 0-1.98 1.55l-.23.89a2 2 0 0 1-1.98 1.55l-.23.05c-.98.22-1.55 1.25-1.33 2.23l.23.89a2 2 0 0 1 0 2.44l-.23.89c-.22.98.35 2.01 1.33 2.23l.23.05a2 2 0 0 0 1.98 1.55l.23.89a2 2 0 0 1 1.98 1.55l.23.05A2.5 2.5 0 0 0 14.5 22" />
    <path d="M12 12l-2-2m4 0l-2 2m0 0l-2 2m4 0l-2-2" strokeLinecap="butt" />
  </SVG>
);

export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></SVG>
);

export const QuantumCoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}>
    <circle cx="12" cy="12" r="2"></circle>
    <circle cx="12" cy="12" r="6" opacity="0.7"></circle>
    <line x1="12" y1="2" x2="12" y2="4" opacity="0.7"></line>
    <line x1="12" y1="20" x2="12" y2="22" opacity="0.7"></line>
    <line x1="20" y1="12" x2="22" y2="12" opacity="0.7"></line>
    <line x1="2" y1="12" x2="4" y2="12" opacity="0.7"></line>
  </SVG>
);

export const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></SVG>
);

export const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><path d="M22 8l-6 4 6 4V8z"></path><rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect></SVG>
);

export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></SVG>
);

export const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></SVG>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></SVG>
);

export const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.71a2 2 0 0 0 1.25.13l.23-.05a2 2 0 0 1 1.98 1.55l.23.89a2 2 0 0 0 1.98 1.55l.23.05c.98.22 1.55 1.25 1.33 2.23l-.23.89a2 2 0 0 0 0 2.44l.23.89c.22.98-.35 2.01-1.33 2.23l-.23.05a2 2 0 0 1-1.98 1.55l-.23.89a2 2 0 0 0-1.98 1.55l-.23.05A2.5 2.5 0 0 1 9.5 22M14.5 2a2.5 2.5 0 0 0-2.5 2.5v1.71a2 2 0 0 1-1.25.13l-.23-.05a2 2 0 0 0-1.98 1.55l-.23.89a2 2 0 0 1-1.98 1.55l-.23.05c-.98.22-1.55 1.25-1.33 2.23l.23.89a2 2 0 0 1 0 2.44l-.23.89c-.22.98.35 2.01 1.33 2.23l.23.05a2 2 0 0 0 1.98 1.55l.23.89a2 2 0 0 1 1.98 1.55l.23.05A2.5 2.5 0 0 0 14.5 22"></path></SVG>
);

export const CpuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></SVG>
);

export const GpuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><path d="M12 12H4V4h8v8zM20 12h-8V4h8v8zM12 20H4v-8h8v8zM20 20h-8v-8h8v8z" /></SVG>
);

export const RamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><rect x="2" y="7" width="20" height="10" rx="2" ry="2" /><line x1="6" y1="11" x2="6" y2="13" /><line x1="10" y1="11" x2="10" y2="13" /><line x1="14" y1="11" x2="14" y2="13" /><line x1="18" y1="11" x2="18" y2="13" /></SVG>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></SVG>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></SVG>
);

export const ConsoleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></SVG>
);

export const RealUnrealGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props} stroke="#f87171">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </SVG>
);

export const GamepadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}>
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </SVG>
);

export const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SVG {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </SVG>
);