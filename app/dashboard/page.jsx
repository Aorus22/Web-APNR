"use client";

import { BACKEND_URL } from "@/constant/configuration";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart, Bar } from "recharts";

export default function Dashboard() {
  const [selectedInterval, setSelectedInterval] = useState("daily");
  const [totalVehicle, setTotalVehicle] = useState(0);
  const [totalVehicleByRegion, setTotalVehicleByRegion] = useState([]);
  const [totalVehicleDaily, setTotalVehicleDaily] = useState([]);
  const [totalVehicleMonthly, setTotalVehicleMonthly] = useState([]);
  const colors = ["#1E90FF", "#00BFFF", "#87CEFA", "#4682B4", "#5F9EA0"];

  useEffect(() => {
    const fetchTotalVehicle = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-total-vehicle`,{
            method: "GET",
            credentials: "include"
          }
        );

        if (response.ok){
          const data = await response.json();
          setTotalVehicle(data.total);
        }
      } catch (error) {
        toast.error("Error fetching total vehicle:");
      }
    };

    fetchTotalVehicle();
  }, []);

  useEffect(() => {
    const fetchTotalVehicleByRegion = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-total-vehicle-per-region`, {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        if (response.ok){
          setTotalVehicleByRegion(
            Object.keys(data).map((region) => ({
              region: region,
              RegionCount: data[region],
            }))
          );
        }
      } catch (error) {
        toast.error("Error fetching total vehicle by region");
      }
    };

    fetchTotalVehicleByRegion();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-total-vehicle-daily`, {
          method: "GET",
          credentials: "include"
        });
        
        if (response.ok){
          const data = await response.json();
          setTotalVehicleDaily(
            Object.keys(data).map((day) => ({
              name: day,
              VehicleCount: data[day],
            }))
          );
        }
      } catch (error) {
        toast.error("Error fetching vehicle data");
      }
    }

    fetchData();
  }, [selectedInterval]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/get-total-vehicle-monthly`, {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setTotalVehicleMonthly(
            Object.keys(data).map((month) => ({
              name: month,
              VehicleCount: data[month],
            }))
          );
        }
      } catch (error) {
        toast.error("Error fetching vehicle data");
      }
    };

    fetchData();
  }, [selectedInterval]);

  return (
    <div className="w-full sm:p-6">
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-1">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Total Vehicle</h2>
            <p className="text-4xl font-bold">{totalVehicle}</p>
          </div>

          <div className="bg-indigo-700 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Total Vehicle Today</h2>
            <p className="text-4xl font-bold">{totalVehicleDaily[totalVehicleDaily.length - 1]?.VehicleCount || 0}</p>
          </div>

          <div className="bg-[#5F9EA0] text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Total Vehicle This Month</h2>
            <p className="text-4xl font-bold">{totalVehicleMonthly[totalVehicleMonthly.length - 1]?.VehicleCount || 0}</p>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="bg-white border p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Total by Interval</h2>

            <div className="flex space-x-2 mb-4">
              {["daily", "monthly"].map((interval) => (
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
              <LineChart data={selectedInterval === "monthly" ? totalVehicleMonthly : totalVehicleDaily}>
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

          <div className="bg-white border p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Total by Region</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalVehicleByRegion}>
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
                  {totalVehicleByRegion.map((entry, index) => (
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
