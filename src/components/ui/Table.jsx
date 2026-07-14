import { cn } from "../../utils/classNames";

export function Table({ columns, rows, getRowKey, renderActions, className }) {
  return (
    <div className="table-scroll">
      <table className={cn("min-w-full divide-y divide-slate-200 text-sm", className)}>
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600"
              >
                {column.label}
              </th>
            ))}
            {renderActions ? (
              <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {renderActions ? (
                <td className="whitespace-nowrap px-4 py-3 text-right">{renderActions(row)}</td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
