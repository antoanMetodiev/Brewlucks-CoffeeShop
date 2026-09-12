import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Вход",
  description: "Sign in or create a Brewlucks account.",
};

export default function LoginPage() {
  return <LoginView />;
}
