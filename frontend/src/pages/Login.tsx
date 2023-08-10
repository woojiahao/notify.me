import { FormEvent } from "react";
import api from "../api/api";
import { useUserContext } from "../contexts/UserContext";

export default function Login() {
  const { login } = useUserContext();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      emailInput: { value: string };
      passwordInput: { value: string };
    };

    login(target.emailInput.value, target.passwordInput.value);
  }

  return (
    <div className="w-[60%] my-16 mx-auto">
      <h1 className="uppercase mb-4">Login</h1>

      <form
        action="post"
        onSubmit={onSubmit}
        className="p-4 bg-white rounded-md shadow-md flex flex-col gap-y-8"
      >
        <div className="flex flex-col">
          <label htmlFor="emailInput">Email</label>
          <input
            id="emailInput"
            type="email"
            className="border rounded-md p-2 text-gray-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="passwordInput">Password</label>
          <input
            id="passwordInput"
            type="password"
            className="border rounded-md p-2 text-gray-500"
            required
          />
        </div>

        <button type="submit" className="p-2 bg-aquamarine rounded-md">
          Login
        </button>
      </form>
    </div>
  );
}
