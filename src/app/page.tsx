import { HomeView } from "@/components/home/home-view";
import { getFeatured, getHeroShowcase, getSignatureDrinks } from "@/lib/catalog/catalog";

export default async function HomePage() {
  const [featured, heroShowcase, signatureDrinks] = await Promise.all([
    getFeatured(),
    getHeroShowcase(),
    getSignatureDrinks(),
  ]);
  return <HomeView featured={featured} heroShowcase={heroShowcase} signatureDrinks={signatureDrinks} />;
}
