export interface PackagingOption {
  id: string;
  label: string;
}

export const PACKAGING_OPTIONS: PackagingOption[] = [
  { id: 'standard', label: 'التغليف العادي' },
  { id: 'premium', label: 'تغليف فاخر' },
  { id: 'gift', label: 'تغليف هدية' },
];

export function getPackagingLabel(id: string): string {
  const option = PACKAGING_OPTIONS.find((o) => o.id === id);
  return option ? option.label : id;
}

export const DEFAULT_PACKAGING_ID = 'standard';