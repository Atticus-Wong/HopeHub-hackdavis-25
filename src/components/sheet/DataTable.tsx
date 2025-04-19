"use client"; // Add this directive for client-side hooks

import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { DataTable as DataTableType } from "@/types/types";
import Cell from "./Cell";
import { Input } from "../ui/input";

type DataTableProps = {
  data: DataTableType[];
};

// Define a default input renderer for EditableCell
const defaultInputRenderer = ({ value, onChange, onBlur, onKeyDown, ref }: any) => (
  <Input
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    ref={ref}
    className="w-full h-full p-0 border-none rounded-none focus:ring-1 focus:ring-blue-500" // Basic styling
  />
);

export default function DataTable({ data }: DataTableProps) {
  const columnHelper = createColumnHelper<DataTableType>();
  const [rowSelection, setRowSelection] = React.useState<DataTableType[]>();

  // Define columns using EditableCell
  const columns = React.useMemo<ColumnDef<DataTableType, any>[]>(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
      }),
      columnHelper.accessor("ethnicity", {
        header: "Ethnicity",
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
      }),
      columnHelper.accessor("ageGroup", {
        header: "Age Group",
        // Example: If ageGroup should be a select, you'd define a specific renderer
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
      }),
      columnHelper.accessor("benefits", {
        header: "Benefits",
        // Note: 'benefits' might be an array or object. Adjust EditableCell or renderer if needed.
        // This assumes benefits can be represented/edited as a simple string for now.
        cell: (info) => (
          <Cell {...info} renderInput={defaultInputRenderer} />
        ),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Add meta property if your EditableCell needs to update data via table.options.meta.updateData
    // meta: {
    //   updateData: (rowIndex, columnId, value) => {
    //     // Implement data update logic here, e.g., calling setData
    //   },
    // },
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-300" // Adjusted padding/border
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-0 border-r border-gray-200"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}