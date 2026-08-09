import type { Metadata } from "next";
import { ProfilePage } from "../components/ProfilePage";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola profil, langganan Premium, dan Daftar Saya di Chill.",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
