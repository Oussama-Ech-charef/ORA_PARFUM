const CATEGORIES_KEY = 'ora_categories';
const GENDERS_KEY = 'ora_genders';

const defaultCategories = ['الكل', 'عطور شرقية', 'عطور زهرية', 'عطور بحرية', 'عطور فاخرة'];
const defaultGenders = ['الكل', 'للجنسين', 'رجالي', 'نسائي'];

function getStoredArray(key: string, defaults: string[]): string[] {
  if (typeof window === 'undefined') return [...defaults];
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [...defaults];
}

function saveArray(key: string, list: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(list));
  }
}

export function getCategories(): string[] {
  return getStoredArray(CATEGORIES_KEY, defaultCategories);
}

export function saveCategories(categories: string[]): void {
  const withAll = categories.includes('الكل') ? categories : ['الكل', ...categories];
  saveArray(CATEGORIES_KEY, withAll);
}

export function addCategory(name: string): void {
  const cats = getCategories();
  if (!cats.includes(name)) {
    cats.push(name);
    saveCategories(cats);
  }
}

export function deleteCategory(name: string): void {
  if (name === 'الكل') return;
  saveCategories(getCategories().filter((c) => c !== name));
}

export function getGenders(): string[] {
  return getStoredArray(GENDERS_KEY, defaultGenders);
}

export function saveGenders(genders: string[]): void {
  const withAll = genders.includes('الكل') ? genders : ['الكل', ...genders];
  saveArray(GENDERS_KEY, withAll);
}

export function addGender(name: string): void {
  const genders = getGenders();
  if (!genders.includes(name)) {
    genders.push(name);
    saveGenders(genders);
  }
}

export function deleteGender(name: string): void {
  if (name === 'الكل') return;
  saveGenders(getGenders().filter((g) => g !== name));
}
