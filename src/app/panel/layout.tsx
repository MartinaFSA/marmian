import PanelNav from "./_components/panel-nav";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PanelNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
