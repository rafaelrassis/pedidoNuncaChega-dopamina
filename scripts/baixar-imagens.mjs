#!/usr/bin/env node
// Baixa as fotos de comidas e motoboys do Wikimedia Commons pra public/img/
// antes do `next build`. Roda no build da Vercel (que tem rede real) — o
// sandbox do Claude Code não consegue baixar essas imagens diretamente.
// Os arquivos não ficam commitados no git (ver .gitignore), são baixados
// de novo a cada deploy.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";

const imagens = [
  ["public/img/feijoada.jpg", "Feijoada_à_brasileira_1.jpg"],
  ["public/img/coxinha.jpg", "Coxinha_-_iguaria_brasileira_02.jpg"],
  ["public/img/acaraje.jpg", "Acarajé_store_-_Porto_Seguro-_Bahia_(50903485997).jpg"],
  ["public/img/baiao-de-dois.jpg", "Baião_de_dois.jpg"],
  ["public/img/churrasco.jpg", "Churrasco_brasileiro.jpg"],
  ["public/img/chimarrao-pao-de-queijo.jpg", "Pão_de_queijo.jpg"],
  ["public/img/acai-raiz.jpg", "Açaí_do_Pará.jpg"],
  ["public/img/tacaca.jpg", "Tacacá_de_Imperatriz_-_MA.jpg"],
  ["public/img/pequi-com-frango.jpg", "Galinhada_com_pequi.jpg"],
  ["public/img/pamonha.jpg", "Pamonha.jpg"],
  ["public/img/baixaria.jpg", "Tapioca_de_carne_seca_com_brócolis_02.jpg"],
  ["public/img/sururu-ao-coco.jpg", "Caldo_de_Sururu,_Salvador,_BA,_14-02-2023.jpg"],
  ["public/img/camarao-no-bafo.jpg", "Moqueca_de_peixe_e_camarao_(7519822014).jpg"],
  ["public/img/galinhada-com-pequi.jpg", "Galinhada_com_pequi.jpg"],
  ["public/img/moqueca-capixaba.jpg", "Moqueca_capixaba_18_de_janeiro_de_2014_(2).JPG"],
  ["public/img/arroz-de-cuxa.jpg", "Cuxá_(tentativa).jpg"],
  ["public/img/maria-isabel.jpg", "Arroz_Carreteiro_2.jpg"],
  ["public/img/feijao-tropeiro.jpg", "Feijão_tropeiro.jpg"],
  ["public/img/cuscuz-com-carne-de-sol.jpg", "Carne_de_sol.jpg"],
  ["public/img/barreado.jpg", "Barreado.jpg"],
  [
    "public/img/arrumadinho-pernambucano.jpg",
    "BRUNO_LIMA_GASTRONOMIA_CARNE_DE_SOL_GRAVATÁ_PE_(40198041084).jpg",
  ],
  ["public/img/pacoca-de-carne-de-sol.jpg", "Carne_de_sol_maturada.jpg"],
  ["public/img/camarao-na-moranga.jpg", "Camarão_na_moranga.JPG"],
  ["public/img/pirarucu-a-casaca.jpg", "Pirarucu.JPG"],
  ["public/img/damurida.jpg", "Peixe.Dourada.Fish.jpg"],
  ["public/img/sequencia-de-camarao.jpg", "Moqueca_de_peixe_e_camarao_(7519822014).jpg"],
  ["public/img/caranguejada.jpg", "Caranguejo_na_raiz_do_mangue.jpg"],
  ["public/img/peixe-na-telha.jpg", "Peixe_pedra.jpg"],
  ["public/img/motoboys/jaguatirica.jpg", "Jaguatirica_ou_Gato_do_mato.jpg"],
  ["public/img/motoboys/tucano.jpg", "Toco_toucan_(Ramphastos_toco).jpg"],
  ["public/img/motoboys/capivara.jpg", "A_capivara_-_Parque_Barigui_-_Curitiba_(PR).jpg"],
  ["public/img/motoboys/gaviao-real.jpg", "Gavião-real_(Harpia_harpyja).jpg"],
  ["public/img/motoboys/quati.jpg", "Quati_na_Serra_do_Rio_do_Rastro,_RS,_Brasil.jpg"],
  ["public/img/motoboys/papagaio.jpg", "Papagaio_falante.jpg"],
  ["public/img/motoboys/bicho-preguica.jpg", "Bicho-preguiça_(Folivora).jpg"],
  ["public/img/motoboys/jacare.jpg", "Jacaré_na_APA_do_Miriti_Manacapuru_AM.jpg"],
  [
    "public/img/motoboys/tamandua-bandeira.jpg",
    "Tamanduá-bandeira_com_filhote_em_pastagem.jpg",
  ],
  ["public/img/motoboys/tatu.jpg", "Tatu_Mulita.jpg"],
  ["public/img/motoboys/coruja.jpg", "Coruja_Buraqueira_(Athene_cunicularia).jpg"],
  ["public/img/motoboys/arara-azul.jpg", "Arara_Azul_no_Pantanal.jpg"],
];

// Wikimedia pede um User-Agent identificado e não gosta de rajadas de
// requisição sem pausa — sem isso, o Special:FilePath começa a devolver
// 429 depois de poucos arquivos (https://meta.wikimedia.org/wiki/User-Agent_policy).
const USER_AGENT =
  "PedidoNuncaChega/1.0 (https://github.com/rafaelrassis/pedidoNuncaChega-dopamina; build script)";
const PAUSA_ENTRE_DOWNLOADS_MS = 300;
const MAX_TENTATIVAS = 4;

const espera = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function baixar(destino, nomeArquivo) {
  const url = BASE + encodeURI(nomeArquivo);

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    const resposta = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT },
    });

    if (resposta.ok) {
      const buffer = Buffer.from(await resposta.arrayBuffer());
      await mkdir(path.dirname(destino), { recursive: true });
      await writeFile(destino, buffer);
      console.log(`OK  ${destino}`);
      return;
    }

    if (resposta.status === 429 && tentativa < MAX_TENTATIVAS) {
      const retryAfter = Number(resposta.headers.get("retry-after"));
      const esperaMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 1000 * 2 ** tentativa;
      console.warn(
        `429 em ${nomeArquivo}, tentativa ${tentativa}/${MAX_TENTATIVAS} — esperando ${esperaMs}ms`
      );
      await espera(esperaMs);
      continue;
    }

    throw new Error(`Falha ao baixar ${nomeArquivo}: HTTP ${resposta.status}`);
  }
}

async function main() {
  const falhas = [];
  for (const [destino, nomeArquivo] of imagens) {
    try {
      await baixar(destino, nomeArquivo);
    } catch (erro) {
      console.warn(`AVISO: ${erro.message}`);
      falhas.push({ destino, nomeArquivo });
    }
    await espera(PAUSA_ENTRE_DOWNLOADS_MS);
  }

  const sucesso = imagens.length - falhas.length;
  console.log(`Baixadas ${sucesso}/${imagens.length} imagens do Wikimedia Commons.`);

  if (falhas.length > 0) {
    console.warn(
      `${falhas.length} imagem(ns) não baixaram (arquivo renomeado/removido no Commons?) — ` +
        `o build continua, mas essas fotos vão quebrar no site até alguém trocar o link em ` +
        `scripts/baixar-imagens.mjs:`
    );
    for (const { destino, nomeArquivo } of falhas) {
      console.warn(`  - ${destino} <- ${nomeArquivo}`);
    }
  }

  // Não falha o build por causa de fotos individuais indisponíveis — a
  // migração e o seed são mais importantes que uma imagem quebrada. Só
  // falha se TODAS as imagens falharem, o que indica um problema maior
  // (ex: Wikimedia fora do ar, ou rede bloqueada no ambiente de build).
  if (sucesso === 0) {
    throw new Error("Nenhuma imagem foi baixada — abortando o build.");
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
