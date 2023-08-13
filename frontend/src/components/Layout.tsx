import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { ToastContainer } from "react-toastify";

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

export default function Layout({ children }: PropsWithChildren) {
  const { user, logout } = useUserContext();

  return (
    <div className="flex flex-col">
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
      <div>{children}</div>
      <ToastContainer />
      {/* <footer className="p-2 px-4 bg-white mt-12 text-center text-gray-400">
        <a href="https://github.com/woojiahao/notify.me" className="underline">
          notify.me
        </a>{" "}
        is built with ❤️, Go, and React by{" "}
        <a href="https://github.com/woojiahao" className="underline">
          Jiahao
        </a>
        .
      </footer> */}
    </div>
  );
}
