"use client";


export function Avatar({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={className ? className : "inline-flex items-center justify-center rounded-full bg-muted"}>{children}</div>;
}

export function AvatarImage({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt || ""} className={className || "h-full w-full object-cover"} />;
}

export function AvatarFallback({ children, className }: { children?: React.ReactNode; className?: string }) {
  const baseClasses = "h-full w-full flex items-center justify-center bg-secondary text-white rounded-full";
  const combinedClassName = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}

