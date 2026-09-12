export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display leading-none tracking-tight ${className}`}>
      <span className="text-accent">Brew</span>lucks
    </span>
  );
}
