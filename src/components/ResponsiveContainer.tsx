import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  variant: 'customer' | 'business';
  className?: string;
}

export default function ResponsiveContainer({ 
  children, 
  variant, 
  className = '' 
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const baseClasses = "min-h-screen w-full bg-bg text-text";
  
  // Customer variant: mobile-first, centered layout
  // Business variant: sidebar offset on desktop
  const variantClasses = variant === 'customer'
    ? "max-w-screen-xl mx-auto px-4 md:px-8"
    : (() => {
        // Business variant with responsive padding and sidebar offset
        let classes = "";
        
        // Horizontal padding based on breakpoint
        if (isMobile) {
          classes += "px-4";
        } else if (isTablet) {
          classes += "px-6";
        } else {
          classes += "px-8";
        }
        
        // Sidebar offset on desktop (288px sidebar width)
        if (isDesktop) {
          classes += " pl-[288px]";
        }
        
        return classes;
      })();
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
}
