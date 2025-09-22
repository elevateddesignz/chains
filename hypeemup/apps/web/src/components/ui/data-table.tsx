import { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export function DataTable<T extends { id: string }>({ columns, data }: { columns: DataTableColumn<T>[]; data: T[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm text-white/70">
        <thead className="bg-black/40 text-xs uppercase tracking-widest text-white/60">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-black/30">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3">
                  {column.render ? column.render(row[column.key], row) : (row[column.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
