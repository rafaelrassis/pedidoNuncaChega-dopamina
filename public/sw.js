const CACHE_ESTATICO = "pnc-estatico-v1";
const ARQUIVOS_APP_SHELL = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_ESTATICO).then((cache) => cache.addAll(ARQUIVOS_APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => chave !== CACHE_ESTATICO)
            .map((chave) => caches.delete(chave))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const ehEstatico =
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/manifest.webmanifest";

  if (!ehEstatico) return;

  evento.respondWith(
    caches.match(request).then((resposta) => {
      if (resposta) return resposta;
      return fetch(request).then((respostaRede) => {
        const clone = respostaRede.clone();
        caches.open(CACHE_ESTATICO).then((cache) => cache.put(request, clone));
        return respostaRede;
      });
    })
  );
});
