import { LANGS } from "@/lib/i18n";
import RawdahAdmin from "@/components/RawdahAdmin";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <RawdahAdmin />;
}
