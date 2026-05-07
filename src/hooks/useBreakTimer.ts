import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';

export function useBreakTimer() {
  const { businessProfile, toggleSalonBreak } = useApp();
  const [breakTimeRemaining, setBreakTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!businessProfile?.isBreak || !businessProfile?.breakEndTime) {
      setBreakTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, businessProfile.breakEndTime! - Date.now());
      setBreakTimeRemaining(remaining);
      
      // Auto-end break when timer reaches 0
      if (remaining === 0 && businessProfile.isBreak) {
        toggleSalonBreak();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [businessProfile?.isBreak, businessProfile?.breakEndTime, toggleSalonBreak]);

  const formatBreakTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartBreak = async (minutes: number) => {
    await toggleSalonBreak(minutes);
  };

  const handleEndBreak = async () => {
    await toggleSalonBreak();
  };

  return {
    breakTimeRemaining,
    formatBreakTime,
    handleStartBreak,
    handleEndBreak,
    isOnBreak: businessProfile?.isBreak || false
  };
}
