"use client";
import { useState, useEffect, useMemo } from "react";
import { useTable } from "react-table";
import { FaEye, FaFilter } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { UserAuth } from "@/context/authContext";
import { BACKEND_URL } from "@/constant/configuration";
import Link from "next/link";

export default function VehicleList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = UserAuth()

  // State Filters
  const [filters, setFilters] = useState({
    region: searchParams.get("region") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  // State Halaman
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page"), 10) || 1
  );

  const itemsPerPage = 50;

  // Data Dummy
  // const data = useMemo(
  //   () =>
  //     Array.from({ length: 200 }, (_, i) => ({
  //       plateNumber: `B${1000 + i}XYZ`,
  //       region: ["Jakarta", "Bandung", "Surabaya", "Medan"][i % 4],
  //       date: 1635769200000 + i * 86400000,
  //       vehicleType: ["Car", "Motorcycle", "Truck"][i % 3],
  //       detailUrl: "/detail",
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

  // Filtered & Paginated Data
  const filteredData = useMemo(() => {
    const filtered = plateData.filter((item) => {
      const matchRegion = filters.region
        ? item.region.toLowerCase().includes(filters.region.toLowerCase())
        : true;
      const matchStartDate = filters.startDate
        ? item.date >= new Date(filters.startDate).getTime()
        : true;
      const matchEndDate = filters.endDate
        ? item.date <= new Date(filters.endDate).getTime()
        : true;
      return matchRegion && matchStartDate && matchEndDate;
    });

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filters, plateData, currentPage]);

  const totalPages = Math.ceil(
    plateData.filter((item) => {
      const matchRegion = filters.region
        ? item.region.toLowerCase().includes(filters.region.toLowerCase())
        : true;
      const matchStartDate = filters.startDate
        ? item.date >= new Date(filters.startDate).getTime()
        : true;
      const matchEndDate = filters.endDate
        ? item.date <= new Date(filters.endDate).getTime()
        : true;
      return matchRegion && matchStartDate && matchEndDate;
    }).length / itemsPerPage
  );

  // Update URL with Filters and Pagination
  const updateURL = (newFilters, page) => {
    const params = new URLSearchParams();
    if (newFilters.region) params.set("region", newFilters.region);
    if (newFilters.startDate) params.set("startDate", newFilters.startDate);
    if (newFilters.endDate) params.set("endDate", newFilters.endDate);
    params.set("page", page || 1);

    router.push(`?${params.toString()}`);
  };

  // Update Filters
  const updateFilters = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1);
  };

  // Reset Filters
  const resetFilters = () => {
    const defaultFilters = { region: "", startDate: "", endDate: "" };
    setFilters(defaultFilters);
    setCurrentPage(1);
    updateURL(defaultFilters, 1);
  };

  // Pagination Handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(filters, page);
  };

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredData });

  // Pagination Controls
  const getPagination = () => {
    const pagination = [];
    if (currentPage > 1) {
      pagination.push({ label: "<<", page: 1 });
      pagination.push({ label: "<", page: currentPage - 1 });
    }
    if (currentPage > 4) pagination.push({ label: "...", page: null });

    for (let i = Math.max(1, currentPage - 3); i <= Math.min(totalPages, currentPage + 3); i++) {
      pagination.push({ label: i, page: i });
    }

    if (currentPage < totalPages - 3) pagination.push({ label: "...", page: null });
    if (currentPage < totalPages) {
      pagination.push({ label: ">", page: currentPage + 1 });
      pagination.push({ label: ">>", page: totalPages });
    }
    return pagination;
  };

  const [isFilterShow, setIsFilterShow] = useState(false);

  const isFilterSet = !!filters.region || !!filters.startDate || !!filters.endDate;

  return (
    <div className="relative w-full p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-800">Vehicle List</h1>

      <div className="w-full my-2">
        <button 
          className={`sm:hidden text-white p-4 flex justify-center items-center gap-2 bg-indigo-700 rounded-lg`}
          onClick={() => {
            setIsFilterShow(!isFilterShow);
          }}
        >
          <FaFilter color="white"/> Filter
        </button>
      </div>
      {/* Filter Section */}
      <div className={`absolute shadow-xl py-10 rounded-lg bg-gray-50 px-20 top-36 ${isFilterShow ? "flex" : "hidden"} sm:p-0 sm:shadow-none sm:top-0 sm:bg-white sm:relative sm:flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-6`}>
        <input
          type="text"
          placeholder="Filter by Region"
          value={filters.region}
          onChange={(e) => updateFilters("region", e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => updateFilters("startDate", e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilters("endDate", e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={resetFilters}
          className={`${isFilterSet ? "block" : "hidden"} px-4 py-2 bg-red-500 text-white rounded`}
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
        </div>
      ) : (
        // Table
        <div className="overflow-auto bg-white shadow-lg rounded-lg w-full max-w-5xl">
          <table
            {...getTableProps()}
            className="min-w-full border-collapse border border-gray-200"
          >
            <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              {headerGroups.map((headerGroup, groupIndex) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={groupIndex}>
                  {headerGroup.headers.map((column, colIndex) => (
                    <th
                      {...column.getHeaderProps()}
                      className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide"
                      key={colIndex}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="py-4 px-6 text-sm text-gray-800"
                        key={`${cell.row.id}-${cell.column.id}`}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex space-x-2 mt-4">
        {getPagination().map((item, index) => (
          <button
            key={index}
            onClick={() => item.page && handlePageChange(item.page)}
            className={`px-3 py-1 border rounded ${
              item.page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
            disabled={!item.page}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
