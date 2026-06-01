import { AppSidebar } from '../../components/app-sidebar';

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <div className="flex min-h-screen bg-mist">
      <AppSidebar />
      <main className="flex-1 px-10 py-9">{children}</main>
    </div>
  );
}
