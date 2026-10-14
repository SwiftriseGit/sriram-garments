export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col">
      {children}
    </div>
  );
}
