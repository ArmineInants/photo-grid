export const measurePerformance = (metric: string, value: number) => {
  if (window.performance && window.performance.mark) {
    window.performance.mark(`${metric}-start`);
    window.performance.mark(`${metric}-end`);
    window.performance.measure(metric, `${metric}-start`, `${metric}-end`);
  }
}; 