import { TOKENS } from ".";

const Table = ({ headers, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left" style={{ color: TOKENS.muted }}>
          {headers.map((h) => (
            <th key={h} className="py-2 pr-4 font-normal">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr
            key={i}
            className="border-t"
            style={{ borderColor: TOKENS.border }}
          >
            {Object.values(row).map((v, j) => (
              <td key={j} className="py-2 pr-4">
                {typeof v === "string" ? v : v.toLocaleString()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;