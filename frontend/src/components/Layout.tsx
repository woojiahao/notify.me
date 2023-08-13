import { PropsWithChildren, ReactElement } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { ToastContainer } from "react-toastify";

export function LayoutTitleWithTitleActions({
  titleActions,
  children,
}: { titleActions: ReactElement } & PropsWithChildren) {
  return (
    <div className="flex flex-row p-2 px-4 border-b-2 border-slate-200 bg-white justify-between items-center">
      <div className="flex flex-row gap-x-1 items-center">{titleActions}</div>
      <div className="flex flex-row justify-between items-center gap-x-4">
        {children}
      </div>
    </div>
  );
}

export function LayoutTitle({
  title,
  children,
}: { title: string } & PropsWithChildren) {
  return (
    <div className="flex flex-row p-2 px-4 border-b-2 border-slate-200 bg-white justify-between items-center">
      <p className="font-bold text-2xl">{title}</p>
      <div className="flex flex-row justify-between items-center gap-x-4">
        {children}
      </div>
    </div>
  );
}

export function LayoutBody({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export default function Layout({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  const { user, logout } = useUserContext();

  return (
    <div className={`flex flex-col ${className}`}>
      <nav className="p-2 px-4 sticky border-b-2 border-slate-200 bg-white flex flex-row justify-between items-center">
        <div className="flex flex-row gap-x-4 items-center">
          <Link to="/" className="font-bold text-lg">
            notify.me
          </Link>
          <Link to="/" className="hover:bg-slate-200 p-2 px-4 rounded-md">
            Projects
          </Link>
          <Link to="/" className="hover:bg-slate-200 p-2 px-4 rounded-md">
            Collections
          </Link>
          <Link to="/" className="hover:bg-slate-200 p-2 px-4 rounded-md">
            Blasts
          </Link>
        </div>
        <div className="flex flex-row gap-x-4 items-center">
          <span className="text-gray-400">Welcome back, {user.name}!</span>
          <Link to="/" className="hover:bg-slate-200 p-2 px-4 rounded-md">
            Create
          </Link>
          <Link to="/" className="hover:bg-slate-200 p-2 px-4 rounded-md">
            Settings
          </Link>
          <button
            type="button"
            className="p-2 px-4 bg-red-100 rounded-md shadow-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="flex flex-col h-full">{children}</div>
      <ToastContainer />
    </div>
  );
}
