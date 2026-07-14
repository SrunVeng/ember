import { Outlet } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { MobileSidebar } from "../../components/layout/MobileSidebar";
import { Sidebar } from "../../components/layout/Sidebar";
import { useDisclosure } from "../../hooks/useDisclosure";

export function DashboardLayout() {
  const sidebar = useDisclosure();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <Sidebar />
      </div>
      <MobileSidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />
      <div className="lg:pl-72">
        <Header onOpenSidebar={sidebar.open} />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
