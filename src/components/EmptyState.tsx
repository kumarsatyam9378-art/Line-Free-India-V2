import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'zen' | 'fun';
}

export default function EmptyState({ icon, title, subtitle, actionLabel, onAction, variant = 'default' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-12 px-6"
    >
      <motion.div
        animate={variant === 'fun' ? { y: [0, -10, 0], rotate: [0, 10, -10, 0] } : { y: [0, -6, 0] }}
        transition={{ duration: variant === 'fun' ? 2 : 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 text-5xl mb-4 flex items-center justify-center"
      >
        {icon}
      </motion.div>
      <h3 className={`font-black text-lg md:text-xl lg:text-2xl mb-2 text-text ${variant === 'zen' ? 'zen-text' : ''}`}>{title}</h3>
      <p className="text-text-dim text-sm md:text-base max-w-[250px] leading-relaxed">{subtitle}</p>
      {actionLabel && onAction && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="mt-6 px-6 py-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary font-bold text-sm hover-lift"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
