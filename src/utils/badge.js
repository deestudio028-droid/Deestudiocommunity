export function generateBadge(index) {
  // Index is 0-based based on order of joining
  const position = index + 1;
  
  if (position >= 1 && position <= 10) {
    return 'Founder Member';
  }
  if (position >= 11 && position <= 50) {
    return 'Early Builder';
  }
  if (position >= 51 && position <= 100) {
    return 'Early Supporter';
  }
  return 'Community Member';
}
