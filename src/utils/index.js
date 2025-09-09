// ---- Utils ----
export function csvEscape(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export function downloadCSV(data, headers, filename) {
  const lines = [headers.map(csvEscape).join(",")];
  data.forEach((row) => {
    const values = headers.map((h) =>
      row[h]
        ? typeof row[h] === "object"
          ? JSON.stringify(row[h])
          : row[h]
        : ""
    );
    lines.push(values.map(csvEscape).join(","));
  });
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
