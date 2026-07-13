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
  ["public/img/pamonha.png", "Pamonha_Voadora.png"],
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

async function baixar(destino, nomeArquivo) {
  const url = BASE + encodeURI(nomeArquivo);
  const resposta = await fetch(url, { redirect: "follow" });
  if (!resposta.ok) {
    throw new Error(`Falha ao baixar ${nomeArquivo}: HTTP ${resposta.status}`);
  }
  const buffer = Buffer.from(await resposta.arrayBuffer());
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, buffer);
  console.log(`OK  ${destino}`);
}

async function main() {
  for (const [destino, nomeArquivo] of imagens) {
    await baixar(destino, nomeArquivo);
  }
  console.log(`Baixadas ${imagens.length} imagens do Wikimedia Commons.`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
