import type { Metadata } from "next";
import { AuthPage } from "../components/AuthPage";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
