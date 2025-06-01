// app/dashboard/layout.tsx
// import Sidebar from "@/components/Sidebar";

import Sidebar from "@/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 ">{children}</main>
    </div>
  );
}
