export function formatCO2(kgValue: number | null | undefined, decimals = 1): string {
  if (kgValue == null) return "—";
  if (kgValue >= 1_000_000) return `${(kgValue / 1_000_000).toFixed(decimals)} MtCO₂e`;
  if (kgValue >= 1_000) return `${(kgValue / 1_000).toFixed(decimals)} tCO₂e`;
  return `${kgValue.toFixed(decimals)} kgCO₂e`;
}

export function formatNumber(value: number | null | undefined, decimals = 0): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: decimals }).format(value);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
