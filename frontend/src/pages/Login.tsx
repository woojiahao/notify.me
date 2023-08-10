import { FormEvent, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useUserContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      emailInput: { value: string };
      passwordInput: { value: string };
    };

    const status = await login(
      target.emailInput.value,
      target.passwordInput.value
    );
    if (status === 200) navigate("/");
    else if (status === 400)
      setError("Login failed. Check your email/password and try again.");
    else
      setError("Something wrong happened on our end, we are looking into it.");
  }

  return (
    <div className="w-[40%] my-16 mx-auto">
      <h1 className="uppercase mb-4">Login</h1>

      {error && (
        <p className="p-4 bg-red-200 rounded-md border-2 border-red-400 mb-4 shadow-md">
          {error}
        </p>
      )}

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
