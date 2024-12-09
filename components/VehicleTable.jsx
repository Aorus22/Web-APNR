"use client";
import { useMemo, useState } from "react";
import { useTable } from "react-table";
import { FaBackspace, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function VehicleTable({
  columns,
  plateData,
  filters,
  setFilters,
  currentPage,
  setCurrentPage,
  itemsPerPage
}) {
  const router = useRouter();

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
      const matchItems = filters.items?.length > 0
        ? filters.items.includes(item.id)
        : true;
      return matchRegion && matchStartDate && matchEndDate && matchItems;
    });

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filters, plateData, currentPage, itemsPerPage]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: filteredData });

  // Update URL with Filters and Pagination
  const updateURL = (newFilters, page) => {
    const params = new URLSearchParams();
    if (newFilters.region) params.set("region", newFilters.region);
    if (newFilters.startDate) params.set("startDate", newFilters.startDate);
    if (newFilters.endDate) params.set("endDate", newFilters.endDate);
    params.set("page", page || 1);

    router.push(`?${params.toString()}`);
  };

  const [isFilterShow, setIsFilterShow] = useState(false);
  const isFilterSet = !!filters.region || !!filters.startDate || !!filters.endDate;

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

  // Pagination Handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(filters, page);
  };

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

  return (
    <>
      <div className="w-full my-2">
        <button 
          className={`md:hidden text-white px-6 py-2 flex justify-center items-center gap-2 bg-indigo-700 rounded-3xl`}
          onClick={() => {
            setIsFilterShow(!isFilterShow);
          }}
        >
          <FaFilter color="white"/>
          Filter
        </button>
      </div>

      {/* Filter Section */}
      {!filters.items?.length &&(
        <div className={`absolute shadow-xl py-10 rounded-lg bg-white px-20 top-28 border border-indigo-700 ${isFilterShow ? "flex" : "hidden"} md:border-none md:p-0 md:shadow-none md:top-0 md:bg-white md:relative md:flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6`}>
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
            <FaBackspace />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto bg-white rounded-lg w-full max-w-5xl">
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
                      className="py-4 px-6 text-sm text-gray-800 font-medium"
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

      {/* Pagination */}
      {!filters.items?.length && (
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
      )}
    </>
  )
}
