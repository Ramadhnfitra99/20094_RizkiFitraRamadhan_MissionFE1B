import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";

export const metadata: Metadata = { title: "Beranda" };

export default function HomeRoute() {
  return <HomePage />;
}
