import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, getCategoryInfo } from '../store/AppContext';
import { useState } from 'react';
import QuickActions from './QuickActions';
import { AnimatePresence } from 'framer-motion';

// Simple SVG icons — no dependency bloat
const HomeIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {filled
      ? <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill="currentColor"/>
      : <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>}
  </svg>
);

const SearchIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={filled ? 0 : 1.7}
      fill={filled ? "currentColor" : "none"} opacity={filled ? 0.15 : 1}/>
    {filled && <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7"/>}
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1c0 6-9 12.5-9 12.5z"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
  </svg>
);

const TicketIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"/>
    <path d="M9 6v12M15 6v12" stroke={filled ? "white" : "currentColor"} strokeWidth="1.7" strokeDasharray="2 2"/>
  </svg>
);

const PersonIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3.5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"/>
    <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M16 6c1.7 0 3 1.3 3 3s-1.3 3-3 3M22 20c0-3-2-5-4.5-5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const ChartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="13" width="4" height="8" rx="1"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"/>
    <rect x="10" y="8" width="4" height="13" rx="1"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"/>
    <rect x="17" y="3" width="4" height="18" rx="1"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export default function BottomNav() {
  const { role, unreadCount, t, businessProfile } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (role === 'customer') {
    const tabs = [
      { path: '/customer/home',       label: 'Home',      icon: HomeIcon },
      { path: '/customer/search',     label: 'Explore',   icon: SearchIcon },
      { path: '/customer/favourites', label: 'Saved',     icon: HeartIcon },
      { path: '/customer/tokens',     label: 'Tokens',    icon: TicketIcon },
      { path: '/customer/profile',    label: 'Profile',   icon: PersonIcon },
    ];

    return (
      <div
        style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(60,60,67,0.12)',
        }}
      >
        <div style={{ display: 'flex', height: 56 }}>
          {tabs.map(tab => {
            const active = loc.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => nav(tab.path)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  background: 'none',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-dim)',
                  padding: '6px 0',
                }}
              >
                <Icon filled={active} />
                <span style={{
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: 0,
                  color: 'inherit',
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (role === 'business') {
    const catType = businessProfile?.businessType || 'men_salon';
    const catInfo = getCategoryInfo(catType);
    const noun = catInfo.terminology.noun;

    const tabs = [
      { path: '/barber/home',      label: 'Home',      icon: HomeIcon },
      { path: '/barber/customers', label: noun,         icon: UsersIcon },
      { path: 'FAB',               label: 'Actions',   icon: null },
      { path: '/barber/analytics', label: 'Analytics', icon: ChartIcon },
      { path: '/barber/profile',   label: 'Profile',   icon: PersonIcon },
    ];

    return (
      <>
        <div
          style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(60,60,67,0.12)',
          }}
        >
          <div style={{ display: 'flex', height: 56, alignItems: 'center' }}>
            {tabs.map(tab => {
              if (tab.path === 'FAB') {
                return (
                  <button
                    key="fab"
                    onClick={() => setShowQuickActions(true)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                    }}
                  >
                    <div style={{
                      width: 44, height: 44,
                      background: 'var(--color-primary)',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,122,255,0.35)',
                      marginBottom: 4,
                    }}>
                      <PlusIcon />
                    </div>
                  </button>
                );
              }

              const active = loc.pathname === tab.path;
              const Icon = tab.icon!;
              return (
                <button
                  key={tab.path}
                  onClick={() => nav(tab.path)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    background: 'none',
                    color: active ? 'var(--color-primary)' : 'var(--color-text-dim)',
                    padding: '6px 0',
                  }}
                >
                  <Icon filled={active} />
                  <span style={{
                    fontSize: 10,
                    fontWeight: active ? 600 : 400,
                    color: 'inherit',
                  }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {showQuickActions && (
            <QuickActions onClose={() => setShowQuickActions(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
}
