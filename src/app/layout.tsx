import type { Metadata } from "next";
import BotaoEquipe from "@/components/BotaoEquipe";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perguntas ao vivo",
  description:
    "Envie perguntas e vote nas perguntas dos outros em tempo real durante o evento.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <BotaoEquipe />
      </body>
    </html>
  );
}
