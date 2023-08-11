import { FormEvent, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Link, Navigate } from "react-router-dom";
import { defaultUser } from "../models/user";

export default function Registration() {
  const { user, isLoading, register } = useUserContext();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isLoading && user !== defaultUser) {
    return <Navigate to="/" />;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & {
      nameInput: { value: string };
      emailInput: { value: string };
      passwordInput: { value: string };
    };

    const status = await register(
      target.nameInput.value,
      target.emailInput.value,
      target.passwordInput.value
    );
    if (status === 201)
      setSuccess(
        `Welcome ${target.nameInput.value}! Login with your new account`
      );
    else if (status === 400)
      setError("Registration failed. Check the email/password.");
    else
      setError("Something wrong happened on our end, we are looking into it.");
  }

  return (
    <div className="w-[40%] my-16 mx-auto">
      <p className="mb-2 text-gray-500">notify.me</p>
      <h1 className="uppercase mb-4">Register</h1>

      {error && (
        <p className="p-4 bg-red-200 rounded-md border-2 border-red-400 mb-4 shadow-md">
          {error}
        </p>
      )}

      {success && (
        <p className="p-4 bg-green-200 rounded-md border-2 border-green-400 mb-4 shadow-md">
          {success}
        </p>
      )}

      <form
        action="post"
        onSubmit={onSubmit}
        className="p-4 bg-white rounded-md shadow-md flex flex-col gap-y-8"
      >
        <div className="flex flex-col">
          <label htmlFor="nameInput">Name</label>
          <input
            id="nameInput"
            type="text"
            className="border rounded-md p-2 text-gray-500"
            required
          />
        </div>

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
          Register
        </button>

        <div className="flex flex-row justify-between items-center">
          <span>Got an account?</span>
          <Link to="/login" className="p-2 px-4 bg-blue-100 rounded-md">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
