import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Pumkin", description: "local AI agents over your own Ollama" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-neutral-800 px-6 py-3 flex gap-6 items-center">
          <Link href="/" className="font-bold text-neutral-100">pumkin</Link>
          <nav className="flex gap-4 text-sm text-neutral-400">
            <Link href="/" className="hover:text-neutral-100">agents</Link>
            <Link href="/threads" className="hover:text-neutral-100">threads</Link>
            <Link href="/mcp" className="hover:text-neutral-100">mcp servers</Link>
            <Link href="/runs" className="hover:text-neutral-100">runs</Link>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
