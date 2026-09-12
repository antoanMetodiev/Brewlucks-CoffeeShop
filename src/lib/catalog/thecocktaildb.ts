const BASE = "https://www.thecocktaildb.com/api/json/v1/1";

export type DrinkSummary = { idDrink: string; strDrink: string; strDrinkThumb: string };

export type DrinkRecord = DrinkSummary & {
  strCategory: string | null;
  strAlcoholic: string | null;
  strGlass: string | null;
  strInstructions: string | null;
  strTags: string | null;
} & Record<`strIngredient${number}` | `strMeasure${number}`, string | null>;

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/${path}`, { cache: "force-cache" });
  if (!response.ok) throw new Error(`TheCocktailDB ${path} responded ${response.status}`);
  return response.json() as Promise<T>;
}

export async function listDrinks(category: string): Promise<DrinkSummary[]> {
  const data = await getJson<{ drinks: DrinkSummary[] | null }>(
    `filter.php?c=${encodeURIComponent(category)}`,
  );
  return data.drinks ?? [];
}

export async function listNonAlcoholic(): Promise<DrinkSummary[]> {
  const data = await getJson<{ drinks: DrinkSummary[] | null }>("filter.php?a=Non_Alcoholic");
  return data.drinks ?? [];
}

export async function lookupDrink(id: string): Promise<DrinkRecord | null> {
  const data = await getJson<{ drinks: DrinkRecord[] | null }>(`lookup.php?i=${id}`);
  return data.drinks?.[0] ?? null;
}
