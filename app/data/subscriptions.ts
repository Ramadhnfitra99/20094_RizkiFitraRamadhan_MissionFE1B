export type PlanId = "individual" | "berdua" | "keluarga";

export type SubscriptionPlan = {
  id: PlanId;
  name: string;
  price: number;
  accounts: string;
  quality: string;
  description: string;
  features: string[];
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "individual",
    name: "Individual",
    price: 49_990,
    accounts: "1 akun",
    quality: "Kualitas 720p",
    description: "Pilihan praktis untuk menikmati Chill sendiri.",
    features: ["Tanpa iklan", "Kualitas 720p", "Download konten pilihan"],
  },
  {
    id: "berdua",
    name: "Berdua",
    price: 79_990,
    accounts: "2 akun",
    quality: "Kualitas 1080p",
    description: "Tonton bersama pasangan atau sahabat.",
    features: ["Tanpa iklan", "Kualitas 1080p", "Download konten pilihan"],
  },
  {
    id: "keluarga",
    name: "Keluarga",
    price: 159_990,
    accounts: "5–7 akun",
    quality: "Kualitas 4K",
    description: "Akses lengkap untuk seluruh anggota keluarga.",
    features: ["Tanpa iklan", "Kualitas 4K", "Download konten pilihan"],
  },
];

export function getSubscriptionPlan(id: string | null | undefined) {
  return subscriptionPlans.find((plan) => plan.id === id) ?? subscriptionPlans[0];
}

export function formatRupiah(value: number) {
  return `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}
