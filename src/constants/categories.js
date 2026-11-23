export const CATEGORIES = {
  food: { label: 'Food', icon: 'cart-outline', color: '#166534', bg: '#DCF3E3' },
  bills: { label: 'Bills', icon: 'flash-outline', color: '#92400E', bg: '#FCEBC8' },
  transport: { label: 'Transport', icon: 'bus-outline', color: '#1E40AF', bg: '#DEE8FB' },
  fun: { label: 'Fun', icon: 'film-outline', color: '#86198F', bg: '#F6E0F8' },
  health: { label: 'Health', icon: 'medkit-outline', color: '#9F1239', bg: '#FCE1E7' },
  other: { label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#475467', bg: '#E8ECF0' },
};

export const getCategory = (key) => CATEGORIES[key] || CATEGORIES.other;
