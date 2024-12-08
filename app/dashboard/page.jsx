"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart, Bar } from "recharts";

export default function Dashboard() {
  const [selectedInterval, setSelectedInterval] = useState("daily");

  const intervalData = {
    daily: [
      { name: "Mon", VehicleCount: 1500 },
      { name: "Tue", VehicleCount: 1800 },
      { name: "Wed", VehicleCount: 1700 },
      { name: "Thu", VehicleCount: 1600 },
      { name: "Fri", VehicleCount: 1550 },
      { name: "Sat", VehicleCount: 1800 },
      { name: "Sun", VehicleCount: 1400 },
    ],
    weekly: [
      { name: "Week 1", VehicleCount: 5000 },
      { name: "Week 2", VehicleCount: 5400 },
      { name: "Week 3", VehicleCount: 4900 },
      { name: "Week 4", VehicleCount: 5100 },
    ],
    monthly: [
      { name: "Jan", VehicleCount: 20000 },
      { name: "Feb", VehicleCount: 23000 },
      { name: "Mar", VehicleCount: 22000 },
      { name: "Apr", VehicleCount: 21000 },
      { name: "May", VehicleCount: 24000 },
      { name: "Jun", VehicleCount: 25000 },
      { name: "Jul", VehicleCount: 26000 },
    ],
  };

  const topRegionsData = [
    { region: "Jakarta", RegionCount: 45 },
    { region: "Bandung", RegionCount: 38 },
    { region: "Surabaya", RegionCount: 32 },
    { region: "Surakarta", RegionCount: 30 },
    { region: "Medan", RegionCount: 28 },
    { region: "Yogyakarta", RegionCount: 20 },
    { region: "Bali", RegionCount: 18 },
  ];

  const colors = ["#1E90FF", "#00BFFF", "#87CEFA", "#4682B4", "#5F9EA0"];

  return (
    <div className="w-full sm:p-6">
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-1">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Total Vehicle Recognized from Images</h2>
            <p className="text-4xl font-bold">125</p>
          </div>

          <div className="bg-indigo-700 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Total Vehicle Recognized from Videos</h2>
            <p className="text-4xl font-bold">200</p>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Vehicle Detection</h2>

            <div className="flex space-x-2 mb-4">
              {["daily", "weekly", "monthly"].map((interval) => (
                <button
                  key={interval}
                  className={`px-6 py-1 rounded-3xl ${selectedInterval === interval ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                  onClick={() => setSelectedInterval(interval)}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={intervalData[selectedInterval]}>
                <CartesianGrid horizontal stroke="#ccc" strokeWidth={1} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: 'bold', fill: '#555' }} />
                <YAxis tick={{ fontSize: 14, fontWeight: 'bold', fill: '#555' }} />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333', 
                  }}
                />
                <Line type="monotone" dataKey="VehicleCount" stroke="#1E90FF" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Total Vehicle by Region</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRegionsData}>
                <CartesianGrid horizontal stroke="#ccc" strokeWidth={1} vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 14, fontWeight: 'bold', fill: '#555' }} />
                <YAxis tick={{ fontSize: 14, fontWeight: 'bold', fill: '#555' }} />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333',
                  }}
                />
                <Bar dataKey="RegionCount" fill="#4338ca" radius={[10, 10, 10, 10]}>
                  {topRegionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
