import { Suspense, lazy } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ScrollProgress = lazy(() => import("./ScrollProgress"));

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}