
import { MembersAuthProvider } from "./members-auth-provider";

const MembersLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="w-full flex">
      <MembersAuthProvider>
        <div className="flex-grow transition-all duration-300 mx-1 sm:mx-2">
          {children}
        </div>
      </MembersAuthProvider>
    </main>
  );
};

export default MembersLayout;
