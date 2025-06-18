/**
 * Format number to Indonesian Rupiah
 * @param {number} amount - The amount to format
 * @param {boolean} withSymbol - Whether to include the Rp symbol
 * @returns {string} Formatted currency string
 */
export function formatRupiah(amount, withSymbol = true) {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(amount);
  return withSymbol ? formatted : formatted.replace(/[^\d,]/g, "");
}

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @param {boolean} withTime - Whether to include time
 * @returns {string} Formatted date string
 */
export function formatDate(date, withTime = false) {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };

  return new Date(date).toLocaleDateString("id-ID", options);
}

/**
 * Calculate percentage
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage value (0-100)
 */
export function calculatePercentage(current, total) {
  return total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Get appropriate status badge class
 * @param {string} status - Project status
 * @returns {string} CSS class for the status badge
 */
export function getStatusBadgeClass(status) {
  if (!status) return "status-draf";

  switch (status.toLowerCase()) {
    case "pendanaan aktif":
      return "status-aktif";
    case "draf":
      return "status-draf";
    case "menunggu persetujuan":
      return "status-review";
    case "terdanai":
      return "status-terdanai";
    case "selesai":
      return "status-selesai";
    case "ditolak":
      return "status-ditolak";
    default:
      return "status-draf";
  }
}

export default {
  formatRupiah,
  formatDate,
  calculatePercentage,
  truncateText,
  getStatusBadgeClass,
};
