import type { Metadata } from "next";
import LayoutPublico from "@/components/LayoutPublico";
import AlbumConteudo from "@/components/AlbumConteudo";

export const metadata: Metadata = {
  title: "Seu álbum de motoboys",
  description:
    "Confira seu álbum de figurinhas de motoboy e seu passaporte gastronômico do Brasil no PedidoNuncaChega.",
  robots: { index: false, follow: true },
};

export default function AlbumPage() {
  return (
    <LayoutPublico>
      <AlbumConteudo />
    </LayoutPublico>
  );
}
