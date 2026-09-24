import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export function Table<T extends { id: string }>({
  columns,
  rows,
  ariaLabel,
}: {
  columns: Column<T>[];
  rows: T[];
  ariaLabel: string;
}) {
  return (
    <div className="surface overflow-x-auto p-0">
      <table className="w-full min-w-[560px] text-left text-sm" aria-label={ariaLabel}>
        <thead className="border-b border-ink-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-mist-400 ${
                  col.hideOnMobile ? "hidden sm:table-cell" : ""
                } ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-600">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-ink-700/40">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 align-middle text-mist-200 ${col.hideOnMobile ? "hidden sm:table-cell" : ""} ${col.className ?? ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
