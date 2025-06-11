export function createPageUrl(pageName: string): string {
  const pageUrls: Record<string, string> = {
    Dashboard: "/dashboard",
    Tenders: "/tenders",
    Drivers: "/drivers",
    Payments: "/payments",
    Trips: "/trips",
    Clients: "/clients",
    Pricing: "/pricing",
    Settings: "/settings",
    DriverReport: "/driver-report",
    GeneralReport: "/general-report",
    CustomReport: "/custom-report"
  };
  
  return pageUrls[pageName] || "/";
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS'
  }).format(num);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}
