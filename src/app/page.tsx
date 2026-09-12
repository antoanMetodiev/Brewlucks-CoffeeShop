import { HomeView } from "@/components/home/home-view";
import { getFeatured, getSignatureDrinks } from "@/lib/catalog/catalog";

export default async function HomePage() {
  const [featured, signatureDrinks] = await Promise.all([getFeatured(), getSignatureDrinks()]);
  return <HomeView featured={featured} signatureDrinks={signatureDrinks} />;
}
