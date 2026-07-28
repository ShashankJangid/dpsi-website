import { Suspense, lazy } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingSocials from "./FloatingSocials";
import AIChatWidget from "./AIChatWidget";

const ScrollProgress = lazy(() => import("./ScrollProgress"));

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingSocials />
      <AIChatWidget />
    </div>
  );
}