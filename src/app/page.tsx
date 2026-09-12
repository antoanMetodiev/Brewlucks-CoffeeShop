import { HomeView } from "@/components/home/home-view";
import { getDrinkOfTheDay, getFeatured } from "@/lib/catalog/catalog";

export default async function HomePage() {
  const [featured, drink] = await Promise.all([getFeatured(), getDrinkOfTheDay()]);
  return <HomeView featured={featured} drink={drink} />;
}
