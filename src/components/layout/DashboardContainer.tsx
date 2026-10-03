interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardContainer({
  children,
  className = "",
}: DashboardContainerProps) {
  return (
    <div
      className={`w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 py-4 sm:py-5 ${className}`}
    >
      {children}
    </div>
  );
}
