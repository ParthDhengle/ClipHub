"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const JoinCreatorSection: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // TODO: send data to backend API here
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Where your photography is seen, used, and loved by the world
      </h1>
      <p className="text-gray-600 mb-2">
        Share your photos and videos in one of the largest free libraries of visual content on the Internet.
      </p>
      <p className="text-gray-600 mb-6">
        Reach a global audience of more than <strong>30 million</strong>
      </p>

      <p className="text-lg font-medium mb-2 text-gray-800">
        Help creative people all over the world bring their ideas to life
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Join more than <strong>320K</strong> incredibly talented photographers
      </p>

      <button
        type="button"
        className="flex items-center justify-center gap-3 bg-white border px-4 py-2 rounded-md shadow hover:bg-gray-50 transition mb-6 mx-auto"
      >
        <FcGoogle size={22} />
        Sign up with Google
      </button>

      <p className="text-gray-500 mb-4">Or, sign up with your email</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border rounded-md"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
        >
          Start sharing your content on ClipHub
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        By joining, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
};

export default JoinCreatorSection;
