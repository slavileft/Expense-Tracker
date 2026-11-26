export const CATEGORIES = [
  { name: 'Food', icon: 'fast-food-outline' },
  { name: 'Bills', icon: 'receipt-outline' },
  { name: 'Transport', icon: 'bus-outline' },
  { name: 'Shopping', icon: 'bag-outline' },
  { name: 'Entertainment', icon: 'film-outline' },
  { name: 'Health', icon: 'medkit-outline' },
  { name: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

export function getCategoryIcon(categoryName) {
  const category = CATEGORIES.find((item) => item.name === categoryName);
  return category ? category.icon : 'ellipsis-horizontal-circle-outline';
}
