import { useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

export function LibraryTable({ data, fields, onEdit, onDelete, deletingId }) {
  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'Id' },
      ...fields.map((f) => ({
        accessorKey: f.name,
        header: f.label,
      })),
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const item = row.original;
          const isDeleting = deletingId === item.id;
          return (
            <>
              <button onClick={() => onEdit(item)} className="btn-table-edit">
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                disabled={isDeleting}
                className="btn-table-delete"
              >
                {isDeleting && <span className="btn-spinner" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          );
        },
      },
    ],
    [fields, onEdit, onDelete, deletingId]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="users-table">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
