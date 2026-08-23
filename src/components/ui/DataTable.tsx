import type { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: number }>({
  columns, data, onSort, sortKey, sortDir, onRowClick, emptyMessage = 'Aucune donnée',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-ink-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-3.5 px-4 text-xs font-bold text-ink-500 uppercase tracking-wider ${col.className || ''}`}
                style={{ width: col.width }}
              >
                {col.sortable && onSort ? (
                  <button
                    onClick={() => onSort(col.key, sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc')}
                    className="inline-flex items-center gap-1 hover:text-ink-900 transition-colors"
                  >
                    {col.header}
                    {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-ink-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-ink-50 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-ink-50/50' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-4 px-4 text-sm text-ink-700 ${col.className || ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
