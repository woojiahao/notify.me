import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function Layout({ children }: PropsWithChildren) {
  const { logout } = useUserContext();

  return (
    <div className="w-[50%] mx-auto my-8">
      <nav className="flex flex-row justify-between items-center mb-4">
        <p className="font-bold text-2xl">notify.me</p>
        <div className="flex flex-row gap-x-4">
          <Link to="/">Home</Link>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}
