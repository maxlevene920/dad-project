// Helper to extract brand code (first 2-3 uppercase letters)
export function extractBrandCode(description) {
  const match = description.replace(/\s/g, '').match(/^([A-Z]{2,3})/);
  if (match) return match[1];
  // fallback: first word's uppercase letters
  const firstWord = description.split(' ')[0];
  return firstWord.split('').filter(c => c === c.toUpperCase() && /[A-Z]/.test(c)).join('');
} 