import type { Metadata } from "next";
import { SubscriptionPage } from "../components/SubscriptionPage";

export const metadata: Metadata = {
  title: "Pilih Paket Langganan",
  description: "Pilih paket Premium Individual, Berdua, atau Keluarga di Chill.",
};

export default function SubscriptionRoute() {
  return <SubscriptionPage />;
}
