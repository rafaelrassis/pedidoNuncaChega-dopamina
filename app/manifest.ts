import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PedidoNuncaChega",
    short_name: "PedidoNuncaChega",
    description:
      "Delivery fake de comida brasileira. Peça sem culpa: a comida nunca chega, a dopamina sim.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF6F0",
    theme_color: "#E2574C",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
