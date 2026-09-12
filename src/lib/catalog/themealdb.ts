const BASE = "https://www.themealdb.com/api/json/v1/1";

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea?: string | null;
  strCountry?: string | null;
};

export type MealRecord = MealSummary & {
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strTags: string | null;
} & Record<`strIngredient${number}` | `strMeasure${number}`, string | null>;

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/${path}`, { cache: "force-cache" });
  if (!response.ok) throw new Error(`TheMealDB ${path} responded ${response.status}`);
  return response.json() as Promise<T>;
}

export async function listMeals(category: string): Promise<MealSummary[]> {
  const data = await getJson<{ meals: MealSummary[] | null }>(`filter.php?c=${category}`);
  return data.meals ?? [];
}

export async function lookupMeal(id: string): Promise<MealRecord | null> {
  const data = await getJson<{ meals: MealRecord[] | null }>(`lookup.php?i=${id}`);
  return data.meals?.[0] ?? null;
}
