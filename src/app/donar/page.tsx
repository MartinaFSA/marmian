"use client";

import { useState } from "react";
export default function DonatePage() {
  const [amount, setAmount] = useState("5000");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [organization_id, setOrganizationId] = useState("");
  const [interests, setInterests] = useState("");

  async function handleDonate() {
    await fetch("/api/donors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        status,
        organization_id,
        interests
      }),
    });

    // const response = await fetch(
    //   "/api/mercadopago",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name,
    //       phone,
    //       email,
    //       planId: process.env.MP_PLAN_5000,
    //       amount,
    //     }),
    //   }
    // );

    // const data = await response.json();

    // window.location.href = data.checkoutUrl;
  }

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="phone"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <select
        className="border p-2 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      >
        <option value="3000">
          $3.000
        </option>

        <option value="5000">
          $5.000
        </option>

      </select>

      <button
        onClick={handleDonate}
        className="bg-blue-600 text-white p-2 mt-4 w-full"
        style={{ cursor: "pointer" }}
      >
        Donar
      </button>
    </div>
  );
}