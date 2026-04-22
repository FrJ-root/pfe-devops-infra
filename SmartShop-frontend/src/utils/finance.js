export const roundToTwo = (num) => {
  return +(Math.round(num + "e+2") + "e-2");
};

export const calculateTVA = (amount) => {
  const rate = 0.20; // 20% standard in Morocco [cite: 75, 104]
  return roundToTwo(amount * rate);
};

export const isValidPromo = (code) => {
  const regex = /^PROMO-[A-Z0-9]{4}$/; // Strict format [cite: 102, 103]
  return regex.test(code);
};