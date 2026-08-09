import { LANGS } from "@/lib/i18n";
import RawdahAdmin from "@/components/RawdahAdmin";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false },
  // Dedicated PWA manifest so "Add to Home Screen" opens the admin page
  // itself (start_url = /ar/admin), not the site homepage.
  manifest: "/admin-manifest.json",
};

export default function AdminPage() {
  return <RawdahAdmin />;
}
