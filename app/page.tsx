import { I18nProvider } from "@/components/I18n";
import TanbaApp from "@/components/TanbaApp";

export default function Home() {
  return (
    <I18nProvider>
      <TanbaApp />
    </I18nProvider>
  );
}
