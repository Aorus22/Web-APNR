"use client";
import { useState, useEffect, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { UserAuth } from "@/context/authContext";
import { BACKEND_URL } from "@/constant/configuration";
import Link from "next/link";
import VehicleTable from "@/components/VehicleTable";
import StatusBox from "@/components/StatusBox";

export default function VehicleList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = UserAuth();

  // State Filters
  const [filters, setFilters] = useState({
    region: searchParams.get("region") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    items: searchParams.get("items") ? decodeURIComponent(searchParams.get("items")).split(",") : []
  });

  // State Halaman
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page"), 10) || 1
  );

  const itemsPerPage = 20;

  // Data Dummy
  // const plateData = useMemo(
  //   () =>
  //     Array.from({ length: 200 }, (_, i) => ({
  //       plateNumber: `B${1000 + i}XYZ`,
  //       region: ["Jakarta", "Bandung", "Surabaya", "Medan"][i % 4],
  //       date: 1635769200000 + i * 86400000,
  //       vehicleType: ["Car", "Motorcycle", "Truck"][i % 3],
  //       detailUrl: "/list/FHkrt",
  //     })),
  //   []
  // );

  const [plateData, setPlateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlateData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BACKEND_URL}/get-list`, {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch plate data");
        }
        const data = await response.json();
        setPlateData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlateData();
  }, [user?.uid]);

  // Table Columns
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_, rowIndex) => rowIndex + 1 + (currentPage - 1) * itemsPerPage,
        Cell: ({ value }) => <div className="text-center">{value}</div>,
      },
      {
        Header: "Plate Number",
        accessor: "plateNumber",
      },
      {
        Header: "Region",
        accessor: "region",
      },
      {
        Header: "Date and Time",
        accessor: "timestamp",
        Cell: ({ value }) => {
          const [formattedDate, setFormattedDate] = useState(null);
      
          useEffect(() => {
            if (value) {
              const date = new Date(parseInt(value, 10)); 
              setFormattedDate(date.toLocaleString());
            }
          }, [value]);
      
          return formattedDate ? formattedDate : "Loading...";
        },
      },
      {
        Header: "Actions",
        accessor: "id", 
        Cell: ({ value }) => (
          <Link
            href={`/list/${value}`}
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <FaEye /> <span>Detail</span>
          </Link>
        ),
      }
    ],
    [currentPage]
  );

  return (
    <div className="relative w-full p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-800">Vehicle List</h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-10">
          <StatusBox message={error} />
        </div>
      ) : (plateData.length === 0) ? (
        <div className="flex flex-col w-full justify-center items-center py-10">
          <StatusBox message={"No Items yet"}/>
          <div className="flex justify-center mt-6">
            <Link
              href={"/image"}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
            >
              Upload Image
            </Link>
          </div>
        </div>
      ) : (
        <VehicleTable 
          columns={columns} 
          plateData={plateData} 
          filters={filters} 
          setFilters={setFilters} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      )}

    </div>
  );
}
