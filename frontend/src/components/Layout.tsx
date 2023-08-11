import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function Layout({ children }: PropsWithChildren) {
  const { user, logout } = useUserContext();

  return (
    <div className="w-[70%] mx-auto my-12 flex-col">
      <nav className="flex flex-row justify-between items-center mb-8">
        <Link to="/" className="font-bold text-2xl">
          notify.me
        </Link>
        <div className="flex flex-row gap-x-8 items-center">
          <span className="text-gray-600">Welcome back, {user.name}!</span>
          <button
            type="button"
            className="p-2 px-4 bg-red-100 rounded-md shadow-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
      {children}
      <footer className="mt-12 text-center text-gray-400">
        <a href="https://github.com/woojiahao/notify.me" className="underline">
          notify.me
        </a>{" "}
        is built with ❤️, Go, and React by{" "}
        <a href="https://github.com/woojiahao" className="underline">
          Jiahao
        </a>
        .
      </footer>
    </div>
  );
}
