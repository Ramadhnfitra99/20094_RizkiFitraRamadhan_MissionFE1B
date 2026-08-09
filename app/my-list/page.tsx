import type { Metadata } from "next";
import { MyListPage } from "../components/MyListPage";

export const metadata: Metadata = { title: "Daftar Saya" };

export default function MyListRoute() {
  return <MyListPage />;
}
