export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display leading-none tracking-tight ${className}`}>
      Bistro <span className="text-accent">&</span> Jars
    </span>
  );
}
