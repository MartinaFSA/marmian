"use client";

import { useState } from "react";
export default function BajaPage() {
  const [password, setPassword] = useState("");

  const handleBaja = async () => {
    // Handle baja logic here
  };

  return (
    <div className="max-w-md mx-auto">
    {/* <h1 className="text-2xl font-bold mb-4">Darme de baja</h1>
    <label htmlFor="email" className="block mb-2">Para confirmar, ingresa tu contraseña:</label>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleBaja}
        className="bg-blue-600 text-white p-2 mt-4 w-full"
      >
        Darme de baja
      </button> */}
    </div>
  );
}