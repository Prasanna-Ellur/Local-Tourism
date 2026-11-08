export const generateBookingReference = (type: 'HOMESTAY' | 'GUIDE' | 'EXPERIENCE'): string => {
  const prefix = type === 'HOMESTAY' ? 'H' : type === 'GUIDE' ? 'G' : 'E';
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EL-${year}-${prefix}${random}`;
};

export const generateTransactionId = (): string => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${Date.now().toString().slice(-6)}-${random}`;
};
