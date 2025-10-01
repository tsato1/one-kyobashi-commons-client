
import { DashboardAuthProvider } from "./dashboard-auth-provider";

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="w-full flex">
      <DashboardAuthProvider>
        <div className="flex-grow transition-all duration-300">
          {children}
        </div>
      </DashboardAuthProvider>
    </main>
  );
};

export default DashboardLayout;
