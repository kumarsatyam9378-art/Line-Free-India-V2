import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  mode?: string;
  duration?: number;
}

export function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>;
}

export default PageTransition;
