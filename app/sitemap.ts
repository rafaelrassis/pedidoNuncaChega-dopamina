import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { URL_SITE } from "@/lib/site";

const ROTAS_ESTATICAS = [
  "",
  "/receitas",
  "/sobre",
  "/doar",
  "/privacidade",
  "/termos",
  "/contato",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const comidas = await prisma.comida.findMany({
    where: { ativo: true },
    select: { slug: true, updatedAt: true },
  });

  const paginasEstaticas: MetadataRoute.Sitemap = ROTAS_ESTATICAS.map((rota) => ({
    url: `${URL_SITE}${rota}`,
    lastModified: new Date(),
  }));

  const paginasReceitas: MetadataRoute.Sitemap = comidas.map((c) => ({
    url: `${URL_SITE}/receitas/${c.slug}`,
    lastModified: c.updatedAt,
  }));

  return [...paginasEstaticas, ...paginasReceitas];
}
