/**
 * Performance Monitor
 * 
 * Tracks and monitors animation performance metrics (FPS, frame time)
 * and provides automatic performance level detection for adaptive animations.
 */

export type PerformanceLevel = 'high' | 'medium' | 'low';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  level: PerformanceLevel;
  shouldReduceAnimations: boolean;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTime = 16.67; // milliseconds
  private isMonitoring = false;
  private animationFrameId: number | null = null;
  private fpsHistory: number[] = [];
  private readonly historySize = 60; // Keep last 60 frames
  
  // Performance thresholds
  private readonly HIGH_FPS_THRESHOLD = 55;
  private readonly MEDIUM_FPS_THRESHOLD = 30;
  private readonly LOW_FPS_THRESHOLD = 20;

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.measureFrame();
  }

  /**
   * Stop monitoring performance
   */
  stop(): void {
    this.isMonitoring = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Measure frame performance
   */
  private measureFrame = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;
    
    // Calculate FPS
    this.fps = 1000 / delta;
    this.frameTime = delta;
    
    // Update FPS history
    this.fpsHistory.push(this.fps);
    if (this.fpsHistory.length > this.historySize) {
      this.fpsHistory.shift();
    }
    
    this.lastTime = currentTime;
    this.frameCount++;

    // Continue monitoring
    this.animationFrameId = requestAnimationFrame(this.measureFrame);
  };

  /**
   * Get current FPS
   */
  getFPS(): number {
    return Math.round(this.fps);
  }

  /**
   * Get average FPS over recent history
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    
    const sum = this.fpsHistory.reduce((acc, fps) => acc + fps, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  /**
   * Get current frame time in milliseconds
   */
  getFrameTime(): number {
    return Math.round(this.frameTime * 100) / 100;
  }

  /**
   * Check if animations should be reduced based on performance
   */
  shouldReduceAnimations(): boolean {
    const avgFPS = this.getAverageFPS();
    return avgFPS < this.MEDIUM_FPS_THRESHOLD;
  }

  /**
   * Get current performance level
   */
  getPerformanceLevel(): PerformanceLevel {
    const avgFPS = this.getAverageFPS();
    
    if (avgFPS >= this.HIGH_FPS_THRESHOLD) {
      return 'high';
    } else if (avgFPS >= this.MEDIUM_FPS_THRESHOLD) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get comprehensive performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      fps: this.getFPS(),
      frameTime: this.getFrameTime(),
      level: this.getPerformanceLevel(),
      shouldReduceAnimations: this.shouldReduceAnimations(),
    };
  }

  /**
   * Check if device is likely mobile based on performance and screen size
   */
  isMobileDevice(): boolean {
    // Check screen size
    const isMobileScreen = window.innerWidth < 768;
    
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check user agent (fallback)
    const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    return isMobileScreen || (hasTouch && mobileUserAgent);
  }

  /**
   * Get recommended animation complexity based on device and performance
   */
  getRecommendedComplexity(): 'full' | 'reduced' | 'minimal' {
    const level = this.getPerformanceLevel();
    const isMobile = this.isMobileDevice();
    
    if (level === 'low' || (isMobile && level === 'medium')) {
      return 'minimal';
    } else if (level === 'medium' || isMobile) {
      return 'reduced';
    } else {
      return 'full';
    }
  }

  /**
   * Reset performance history
   */
  reset(): void {
    this.fpsHistory = [];
    this.frameCount = 0;
    this.lastTime = performance.now();
  }

  /**
   * Log performance metrics to console (development only)
   */
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      const metrics = this.getMetrics();
      console.log('Performance Metrics:', {
        fps: `${metrics.fps} FPS`,
        avgFPS: `${this.getAverageFPS()} FPS (avg)`,
        frameTime: `${metrics.frameTime}ms`,
        level: metrics.level,
        shouldReduce: metrics.shouldReduceAnimations,
        complexity: this.getRecommendedComplexity(),
        isMobile: this.isMobileDevice(),
      });
    }
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in browser environment
if (typeof window !== 'undefined') {
  // Start monitoring after a short delay to avoid affecting initial load
  setTimeout(() => {
    performanceMonitor.start();
  }, 1000);
}

export default performanceMonitor;

// Export convenience functions
export const getFPS = () => performanceMonitor.getFPS();
export const getAverageFPS = () => performanceMonitor.getAverageFPS();
export const getPerformanceLevel = () => performanceMonitor.getPerformanceLevel();
export const shouldReduceAnimations = () => performanceMonitor.shouldReduceAnimations();
export const getRecommendedComplexity = () => performanceMonitor.getRecommendedComplexity();
export const isMobileDevice = () => performanceMonitor.isMobileDevice();
export const logPerformanceMetrics = () => performanceMonitor.logMetrics();
