import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaClipboardList, FaUser } from "react-icons/fa6";

export default function App() {
  const [unit, setUnit] = useState("kph");
  const [view, setView] = useState("Analog");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#322A6A] text-white p-6 space-y-10">
        <div className="text-3xl font-light flex items-center gap-2">
          Speedster
          <span className="text-white">🏎️</span>
        </div>
        <nav className="space-y-6">
          <div className="flex items-center gap-3 text-lg cursor-pointer">
            <FaHome /> Home
          </div>
          <div className="flex items-center gap-3 text-lg cursor-pointer">
            <FaClipboardList /> Registration
          </div>
          <div className="flex items-center gap-3 text-lg cursor-pointer">
            <FaUser /> Authentification
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#050736] flex flex-col items-center justify-center text-white p-10">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full ${view === "Analog" ? "bg-[#4A368A]" : "bg-[#322A6A]"}`}
            onClick={() => setView("Analog")}
          >
            Analog
          </button>
          <button
            className={`px-4 py-2 rounded-full ${view === "Digital" ? "bg-[#4A368A]" : "bg-[#322A6A]"}`}
            onClick={() => setView("Digital")}
          >
            Digital
          </button>
        </div>

        {/* Speedometer */}
        <div className="relative">
          <img
            src="/speedometer.png"
            alt="Speedometer"
            className="w-80 h-80"
          />
          {/* Add needle rotation with CSS or inline styles if interactive */}
        </div>

        {/* Units */}
        <div className="absolute right-10 top-1/3 flex flex-col gap-4">
          {["mps", "mph", "kph"].map((u) => (
            <button
              key={u}
              className={`px-3 py-1 rounded-md ${unit === u ? "bg-[#4A368A]" : "bg-[#322A6A]"}`}
              onClick={() => setUnit(u)}
            >
              {u}
            </button>
          ))}
        </div>

        <button className="mt-10 px-8 py-3 bg-[#4A368A] rounded-full text-xl">Start</button>
      </main>
    </div>
  );
}
