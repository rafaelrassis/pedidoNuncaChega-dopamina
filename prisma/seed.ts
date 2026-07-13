import { PrismaClient, Regiao, Estado, Raridade } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const opcoesPadrao = (adicionalNome: string, adicionalPreco: number) => [
  {
    grupo: "Porção",
    tipo: "radio",
    opcoes: [
      { nome: "Normal", acrescimo: 0 },
      { nome: "Grande", acrescimo: 10 },
    ],
  },
  {
    grupo: "Adicional",
    tipo: "radio",
    opcoes: [
      { nome: "Sem adicional", acrescimo: 0 },
      { nome: adicionalNome, acrescimo: adicionalPreco },
    ],
  },
];

const comidas = [
  {
    nome: "Feijoada",
    slug: "feijoada",
    regiao: Regiao.SUDESTE,
    estado: Estado.RJ,
    descricao:
      "O clássico prato brasileiro de sábado: feijão preto cozido devagar com carnes defumadas e curadas, servido com arroz, couve e farofa.",
    precoFake: 42.9,
    descontoPct: 20,
    vegetariano: false,
    trending: true,
    best: true,
    opcoesJson: opcoesPadrao("Torresmo extra", 8),
    receitaMd: `# Feijoada

## Ingredientes
- 500g de feijão preto
- 200g de costelinha defumada
- 200g de linguiça calabresa
- 150g de carne-seca dessalgada
- 100g de bacon em cubos
- 2 folhas de louro
- 1 cebola picada
- 4 dentes de alho picados
- Sal e pimenta-do-reino a gosto

## Modo de preparo
1. Deixe o feijão de molho na véspera.
2. Cozinhe o feijão com o louro até ficar macio.
3. Em outra panela, refogue alho e cebola no bacon.
4. Adicione as carnes e doure bem.
5. Junte tudo ao feijão e cozinhe por 40 minutos em fogo baixo.
6. Ajuste o sal e sirva com arroz branco, couve refogada e farofa.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Feijoada_à_brasileira_1.jpg",
  },
  {
    nome: "Coxinha",
    slug: "coxinha",
    regiao: Regiao.SUDESTE,
    estado: Estado.SP,
    descricao:
      "Massa cremosa de frango desfiado, moldada em formato de gota, empanada e frita até dourar.",
    precoFake: 18.5,
    descontoPct: 15,
    vegetariano: false,
    trending: true,
    best: false,
    opcoesJson: opcoesPadrao("Catupiry extra", 6),
    receitaMd: `# Coxinha

## Ingredientes
- 300g de peito de frango cozido e desfiado
- 500ml de caldo do cozimento do frango
- 2 xícaras de farinha de trigo
- 1 colher de sopa de manteiga
- Cebola e alho picados
- Sal e cheiro-verde a gosto
- Farinha panko e ovo para empanar

## Modo de preparo
1. Refogue o frango desfiado com alho, cebola e cheiro-verde.
2. Leve o caldo ao fogo com a manteiga e o sal.
3. Adicione a farinha de uma vez, mexendo até desgrudar da panela.
4. Deixe esfriar e modele bolinhas recheadas em formato de gota.
5. Passe no ovo e na farinha panko.
6. Frite em óleo quente até dourar.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Coxinha_-_iguaria_brasileira_02.jpg",
  },
  {
    nome: "Acarajé",
    slug: "acaraje",
    regiao: Regiao.NORDESTE,
    estado: Estado.BA,
    descricao:
      "Bolinho de feijão-fradinho frito no azeite de dendê, recheado com vatapá, camarão e caruru.",
    precoFake: 24.9,
    descontoPct: 25,
    vegetariano: false,
    trending: true,
    best: true,
    opcoesJson: opcoesPadrao("Camarão extra", 9),
    receitaMd: `# Acarajé

## Ingredientes
- 500g de feijão-fradinho descascado
- 1 cebola picada
- Sal a gosto
- Azeite de dendê para fritar
- Vatapá, caruru e camarão seco para o recheio

## Modo de preparo
1. Deixe o feijão de molho e descasque-o.
2. Bata o feijão com a cebola até formar uma pasta lisa.
3. Bata a massa com uma colher até incorporar ar e ficar leve.
4. Tempere com sal.
5. Frite porções da massa em azeite de dendê bem quente.
6. Abra o acarajé e recheie com vatapá, caruru e camarão.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Acarajé_store_-_Porto_Seguro-_Bahia_(50903485997).jpg",
  },
  {
    nome: "Baião de Dois",
    slug: "baiao-de-dois",
    regiao: Regiao.NORDESTE,
    estado: Estado.CE,
    descricao:
      "Arroz e feijão-de-corda cozidos juntos com carne-seca, queijo coalho e temperos nordestinos.",
    precoFake: 32.0,
    descontoPct: 18,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Queijo coalho extra", 7),
    receitaMd: `# Baião de Dois

## Ingredientes
- 200g de feijão-de-corda cozido
- 1 xícara de arroz
- 200g de carne-seca dessalgada e desfiada
- 100g de queijo coalho em cubos
- Coentro, cebola e alho a gosto
- Manteiga de garrafa

## Modo de preparo
1. Refogue a carne-seca na manteiga de garrafa.
2. Adicione cebola e alho e refogue até dourar.
3. Junte o feijão-de-corda com um pouco do caldo do cozimento.
4. Acrescente o arroz cru e misture bem.
5. Cozinhe em fogo baixo até o arroz secar.
6. Finalize com queijo coalho e coentro picado por cima.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Baião_de_dois.jpg",
  },
  {
    nome: "Churrasco",
    slug: "churrasco",
    regiao: Regiao.SUL,
    estado: Estado.RS,
    descricao:
      "Picanha, costela e linguiça grelhadas na brasa, no ponto, acompanhadas de farofa e vinagrete.",
    precoFake: 45.0,
    descontoPct: 20,
    vegetariano: false,
    trending: true,
    best: true,
    opcoesJson: opcoesPadrao("Espeto de picanha extra", 15),
    receitaMd: `# Churrasco

## Ingredientes
- 1kg de picanha
- 500g de costela bovina
- 4 linguiças toscanas
- Sal grosso
- Farofa e vinagrete para acompanhar

## Modo de preparo
1. Tempere as carnes só com sal grosso, sem pressa.
2. Acenda a brasa e espere formar um bom labareda de calor uniforme.
3. Coloque a costela primeiro, pois leva mais tempo.
4. Grelhe a picanha com a gordura virada para baixo primeiro.
5. Vire as carnes poucas vezes para selar bem.
6. Retire no ponto desejado e deixe descansar antes de fatiar.
7. Sirva com farofa e vinagrete.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Churrasco_brasileiro.jpg",
  },
  {
    nome: "Chimarrão com Pão de Queijo",
    slug: "chimarrao-pao-de-queijo",
    regiao: Regiao.SUL,
    estado: Estado.RS,
    descricao:
      "A dupla perfeita de fim de tarde: erva-mate quente na cuia acompanhada de pão de queijo quentinho.",
    precoFake: 19.9,
    descontoPct: 15,
    vegetariano: true,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Porção extra de pão de queijo", 8),
    receitaMd: `# Chimarrão com Pão de Queijo

## Ingredientes do chimarrão
- Erva-mate para chimarrão
- Água quente (não fervente, ~80°C)
- Cuia e bomba

## Ingredientes do pão de queijo
- 500g de polvilho azedo
- 1 xícara de leite
- 1/2 xícara de óleo
- 2 ovos
- 200g de queijo minas ralado
- Sal a gosto

## Modo de preparo
1. Encha a cuia até 2/3 com erva-mate.
2. Incline a cuia e adicione água morna aos poucos para hidratar a erva.
3. Insira a bomba e complete com água quente.
4. Para o pão de queijo, ferva leite, óleo e sal e escalde o polvilho.
5. Deixe esfriar, adicione os ovos e o queijo e sove até homogêneo.
6. Modele bolinhas e asse a 180°C por 25 minutos.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pão_de_queijo.jpg",
  },
  {
    nome: "Açaí Raiz",
    slug: "acai-raiz",
    regiao: Regiao.NORTE,
    estado: Estado.PA,
    descricao:
      "Açaí batido na hora, servido puro e grosso como no Pará, acompanhado de farinha de tapioca e camarão seco.",
    precoFake: 22.0,
    descontoPct: 22,
    vegetariano: true,
    trending: true,
    best: false,
    opcoesJson: opcoesPadrao("Camarão seco extra", 6),
    receitaMd: `# Açaí Raiz

## Ingredientes
- 1kg de polpa de açaí pura, sem xarope de guaraná
- Farinha de tapioca (goma seca)
- Camarão seco torrado
- Açúcar (opcional, no Pará quase ninguém usa)

## Modo de preparo
1. Bata a polpa de açaí no liquidificador só para soltar, sem adicionar água.
2. Sirva o açaí bem grosso, em tigela ou copo.
3. Polvilhe farinha de tapioca por cima.
4. Acrescente camarão seco torrado a gosto.
5. Se quiser mais doce, adicione um fio de açúcar ou xarope de guaraná.
6. Sirva imediatamente, bem gelado.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Açaí_do_Pará.jpg",
  },
  {
    nome: "Tacacá",
    slug: "tacaca",
    regiao: Regiao.NORTE,
    estado: Estado.AM,
    descricao:
      "Caldo quente de tucupi com goma de tapioca, jambu e camarão seco, servido tradicionalmente em cuia.",
    precoFake: 21.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Camarão extra", 7),
    receitaMd: `# Tacacá

## Ingredientes
- 1 litro de tucupi
- 2 colheres de goma de tapioca (tapioca hidratada)
- 1 maço de jambu
- 200g de camarão seco
- Alho e sal a gosto
- Pimenta-de-cheiro a gosto

## Modo de preparo
1. Ferva o tucupi com alho e sal por cerca de 20 minutos.
2. Em outra panela, cozinhe o jambu até amolecer e perder o formigamento.
3. Dissolva a goma de tapioca em um pouco de água fria.
4. Adicione a goma ao tucupi fervendo, mexendo até engrossar levemente.
5. Distribua a goma nas cuias, cubra com o caldo quente.
6. Finalize com jambu, camarão seco e pimenta a gosto.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tacacá_de_Imperatriz_-_MA.jpg",
  },
  {
    nome: "Pequi com Frango",
    slug: "pequi-com-frango",
    regiao: Regiao.CENTRO_OESTE,
    estado: Estado.GO,
    descricao:
      "Frango caipira cozido com pequi, arroz soltinho e um tempero marcante típico de Goiás e Tocantins.",
    precoFake: 34.5,
    descontoPct: 20,
    vegetariano: false,
    trending: false,
    best: true,
    opcoesJson: opcoesPadrao("Pequi extra", 9),
    receitaMd: `# Pequi com Frango

## Ingredientes
- 1 frango caipira em pedaços
- 8 unidades de pequi
- 1 cebola picada
- 3 dentes de alho picados
- Pimenta e sal a gosto
- Arroz branco para acompanhar

## Modo de preparo
1. Tempere o frango com sal, alho e pimenta e deixe descansar.
2. Refogue a cebola e o alho até dourar.
3. Adicione o frango e doure bem de todos os lados.
4. Junte os pequis inteiros e água até cobrir.
5. Cozinhe em fogo baixo por cerca de 40 minutos, até o frango ficar macio.
6. Sirva com arroz branco soltinho.

**Atenção:** o pequi tem espinhos internos — nunca morda direto, apenas
chupe a polpa ao redor do caroço.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Galinhada_com_pequi.jpg",
  },
  {
    nome: "Pamonha",
    slug: "pamonha",
    regiao: Regiao.CENTRO_OESTE,
    estado: Estado.MS,
    descricao:
      "Massa de milho verde cozida na palha, na versão doce ou salgada com queijo, um clássico de festa junina.",
    precoFake: 15.0,
    descontoPct: 30,
    vegetariano: true,
    trending: true,
    best: false,
    opcoesJson: opcoesPadrao("Queijo extra", 5),
    receitaMd: `# Pamonha

## Ingredientes
- 10 espigas de milho verde com palha
- 1 xícara de leite
- 3 colheres de sopa de açúcar (para versão doce)
- 1 colher de sopa de manteiga
- Sal a gosto
- Queijo em tiras (para versão salgada)

## Modo de preparo
1. Descasque o milho reservando as palhas mais bonitas para embrulhar.
2. Rale ou bata os grãos de milho com o leite até formar um creme.
3. Tempere com açúcar e um pouco de sal, ou apenas sal para a versão salgada.
4. Monte trouxinhas com duas palhas cruzadas, recheie com o creme.
5. Se for salgada, adicione uma tira de queijo antes de fechar.
6. Amarre bem as pontas com tiras de palha.
7. Cozinhe em água fervente por cerca de 40 minutos.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pamonha_Voadora.png",
  },
  {
    nome: "Baixaria",
    slug: "baixaria",
    regiao: Regiao.NORTE,
    estado: Estado.AC,
    descricao:
      "Prato completo dos mercados de Rio Branco: cuscuz de milho desmanchado, carne moída bem temperada e ovo frito com a gema mole por cima.",
    precoFake: 19.9,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Ovo extra", 4),
    receitaMd: `# Baixaria

## Ingredientes
- 4 xícaras de cuscuz de milho pronto, desmanchado
- 300g de carne moída
- 1 cebola picada
- 2 dentes de alho picados
- 2 tomates picados
- Cheiro-verde a gosto
- 2 ovos
- Sal e pimenta-do-reino a gosto

## Modo de preparo
1. Refogue alho e cebola até dourar.
2. Adicione a carne moída, tomate e tempere bem.
3. Cozinhe até a carne soltar o óleo e ficar bem temperada.
4. Frite os ovos com a gema mole.
5. Monte o prato com o cuscuz desmanchado, a carne por cima e o ovo frito.
6. Finalize com cheiro-verde picado.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tapioca_de_carne_seca_com_brócolis_02.jpg",
  },
  {
    nome: "Sururu ao Coco",
    slug: "sururu-ao-coco",
    regiao: Regiao.NORDESTE,
    estado: Estado.AL,
    descricao:
      "Molusco típico das lagoas alagoanas, cozido em creme grosso de leite de coco com pimentão, alho e cebola.",
    precoFake: 28.0,
    descontoPct: 20,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Porção extra de sururu", 10),
    receitaMd: `# Sururu ao Coco

## Ingredientes
- 500g de sururu limpo
- 200ml de leite de coco
- 1 pimentão picado
- 1 cebola picada
- 3 dentes de alho picados
- 2 tomates picados
- Coentro e pimenta a gosto

## Modo de preparo
1. Refogue alho, cebola, pimentão e tomate.
2. Adicione o sururu já limpo e refogue por alguns minutos.
3. Acrescente o leite de coco e deixe engrossar em fogo baixo.
4. Tempere com sal, pimenta e coentro picado.
5. Sirva bem quente, com farofa e arroz branco.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Caldo_de_Sururu,_Salvador,_BA,_14-02-2023.jpg",
  },
  {
    nome: "Camarão no Bafo",
    slug: "camarao-no-bafo",
    regiao: Regiao.NORTE,
    estado: Estado.AP,
    descricao:
      "Camarão fresco cozido no próprio vapor com temperos regionais, prato disputado em concursos gastronômicos de Macapá.",
    precoFake: 36.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Camarão extra", 12),
    receitaMd: `# Camarão no Bafo

## Ingredientes
- 1kg de camarão médio com casca
- 2 limões
- 1 cebola fatiada
- 3 dentes de alho picados
- Coentro e cheiro-verde a gosto
- Sal e pimenta a gosto

## Modo de preparo
1. Tempere o camarão com limão, alho, sal e pimenta.
2. Arrume numa panela com a cebola fatiada por cima.
3. Tampe bem e cozinhe no próprio vapor, sem adicionar água, por 8-10 minutos.
4. Finalize com coentro e cheiro-verde picados.
5. Sirva imediatamente, ainda fumegando.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Moqueca_de_peixe_e_camarao_(7519822014).jpg",
  },
  {
    nome: "Galinhada com Pequi",
    slug: "galinhada-com-pequi",
    regiao: Regiao.CENTRO_OESTE,
    estado: Estado.DF,
    descricao:
      "Arroz soltinho cozido com frango caipira e pequi, prato que representa a conexão de Brasília com o Cerrado.",
    precoFake: 33.0,
    descontoPct: 18,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Pequi extra", 8),
    receitaMd: `# Galinhada com Pequi

## Ingredientes
- 1 frango caipira em pedaços
- 2 xícaras de arroz
- 6 unidades de pequi
- 1 cebola picada
- 3 dentes de alho picados
- Açafrão-da-terra, sal e pimenta a gosto

## Modo de preparo
1. Tempere o frango com sal, alho e pimenta.
2. Refogue cebola e alho, doure o frango.
3. Junte os pequis e água quente até cobrir, cozinhe por 20 minutos.
4. Acrescente o arroz e o açafrão-da-terra.
5. Cozinhe em fogo baixo até o arroz secar.
6. Sirva quente, avisando sobre os espinhos do pequi.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Galinhada_com_pequi.jpg",
  },
  {
    nome: "Moqueca Capixaba",
    slug: "moqueca-capixaba",
    regiao: Regiao.SUDESTE,
    estado: Estado.ES,
    descricao:
      "Peixe cozido lentamente em panela de barro com urucum, coentro e limão — sem leite de coco e sem dendê.",
    precoFake: 48.0,
    descontoPct: 15,
    vegetariano: false,
    trending: true,
    best: true,
    opcoesJson: opcoesPadrao("Posta extra de peixe", 14),
    receitaMd: `# Moqueca Capixaba

## Ingredientes
- 800g de peixe em postas (badejo ou robalo)
- 2 tomates fatiados
- 1 cebola fatiada
- Coentro e cebolinha a gosto
- Urucum (colorau) a gosto
- Suco de 1 limão
- Azeite a gosto

## Modo de preparo
1. Marine o peixe com limão, sal e urucum.
2. Em panela de barro, monte camadas de peixe, tomate e cebola.
3. Regue com azeite, sem adicionar água.
4. Cozinhe em fogo baixo, sem mexer, até o peixe ficar macio.
5. Finalize com coentro e cebolinha picados.
6. Sirva com arroz branco e pirão.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Moqueca_capixaba_18_de_janeiro_de_2014_(2).JPG",
  },
  {
    nome: "Arroz de Cuxá",
    slug: "arroz-de-cuxa",
    regiao: Regiao.NORDESTE,
    estado: Estado.MA,
    descricao:
      "Arroz branco misturado ao molho de vinagreira, camarão seco e gergelim torrado — símbolo da culinária maranhense.",
    precoFake: 27.0,
    descontoPct: 18,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Camarão seco extra", 7),
    receitaMd: `# Arroz de Cuxá

## Ingredientes
- 2 xícaras de arroz branco cozido
- 1 maço de vinagreira picada
- 100g de camarão seco
- 2 colheres de sopa de gergelim torrado e moído
- 2 colheres de sopa de farinha de mandioca
- Alho e cebola a gosto

## Modo de preparo
1. Cozinhe a vinagreira até ficar macia.
2. Refogue alho e cebola com o camarão seco.
3. Bata a vinagreira com o gergelim moído até formar um molho grosso.
4. Misture o refogado de camarão ao molho.
5. Junte a farinha de mandioca aos poucos até engrossar.
6. Sirva o molho de cuxá sobre o arroz branco.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cuxá_(tentativa).jpg",
  },
  {
    nome: "Maria Isabel",
    slug: "maria-isabel",
    regiao: Regiao.CENTRO_OESTE,
    estado: Estado.MT,
    descricao:
      "Arroz de pinicado com carne-seca bem temperada, prato mais pedido de Cuiabá, nascido durante a Guerra do Paraguai.",
    precoFake: 30.0,
    descontoPct: 20,
    vegetariano: false,
    trending: false,
    best: true,
    opcoesJson: opcoesPadrao("Carne-seca extra", 9),
    receitaMd: `# Maria Isabel

## Ingredientes
- 300g de carne-seca dessalgada e desfiada
- 2 xícaras de arroz
- 1 cebola picada
- 3 dentes de alho picados
- Cheiro-verde e pimenta a gosto
- Farofa de banana para acompanhar

## Modo de preparo
1. Refogue a carne-seca desfiada com alho e cebola até dourar.
2. Adicione o arroz cru e misture bem com a carne.
3. Cubra com água quente e cozinhe em fogo baixo.
4. Finalize com cheiro-verde picado.
5. Sirva com farofa de banana.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Arroz_Carreteiro_2.jpg",
  },
  {
    nome: "Feijão Tropeiro",
    slug: "feijao-tropeiro",
    regiao: Regiao.SUDESTE,
    estado: Estado.MG,
    descricao:
      "Feijão cozido quase sem caldo com farinha de mandioca, linguiça, ovo e couve — prato símbolo de Minas Gerais.",
    precoFake: 29.9,
    descontoPct: 18,
    vegetariano: false,
    trending: true,
    best: false,
    opcoesJson: opcoesPadrao("Torresmo extra", 7),
    receitaMd: `# Feijão Tropeiro

## Ingredientes
- 500g de feijão carioca cozido, quase sem caldo
- 200g de linguiça calabresa em rodelas
- 100g de bacon em cubos
- 2 ovos
- 1 xícara de couve picada fininho
- 1 xícara de farinha de mandioca
- Alho e cebola a gosto

## Modo de preparo
1. Frite o bacon até dourar, retire e reserve.
2. Na mesma gordura, frite a linguiça.
3. Refogue alho e cebola, adicione o feijão escorrido.
4. Mexa os ovos na panela até cozinhar.
5. Junte a farinha de mandioca aos poucos, mexendo sempre.
6. Finalize com a couve picada e o bacon reservado.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Feijão_tropeiro.jpg",
  },
  {
    nome: "Cuscuz com Carne de Sol",
    slug: "cuscuz-com-carne-de-sol",
    regiao: Regiao.NORDESTE,
    estado: Estado.PB,
    descricao:
      "Cuscuz de farinha de milho cozido no vapor, servido com manteiga de garrafa, carne de sol desfiada e queijo coalho.",
    precoFake: 26.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Queijo coalho extra", 6),
    receitaMd: `# Cuscuz com Carne de Sol

## Ingredientes
- 300g de carne de sol dessalgada e desfiada
- 2 xícaras de farinha de milho para cuscuz
- Manteiga de garrafa a gosto
- 100g de queijo coalho em fatias
- Cebola a gosto
- Banana-da-terra frita (opcional)

## Modo de preparo
1. Hidrate a farinha de milho com água e sal e cozinhe no vapor.
2. Doure a carne de sol desfiada com cebola na manteiga de garrafa.
3. Desenforme o cuscuz e sirva com a carne de sol por cima.
4. Grelhe o queijo coalho e adicione ao prato.
5. Acompanhe com banana-da-terra frita, se quiser.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Carne_de_sol.jpg",
  },
  {
    nome: "Barreado",
    slug: "barreado",
    regiao: Regiao.SUL,
    estado: Estado.PR,
    descricao:
      "Carne bovina cozida por horas em panela de barro selada, até desmanchar, servida com farinha de mandioca e banana.",
    precoFake: 39.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Porção extra de carne", 10),
    receitaMd: `# Barreado

## Ingredientes
- 1kg de carne bovina de segunda (paleta ou músculo)
- 100g de toucinho em cubos
- 1 cebola picada
- 3 dentes de alho picados
- Louro, cominho e pimenta-do-reino a gosto
- Farinha de mandioca e banana-da-terra para acompanhar

## Modo de preparo
1. Tempere a carne com alho, cebola, louro, cominho e pimenta.
2. Intercale camadas de carne e toucinho numa panela funda.
3. Tampe bem e cozinhe em fogo baixo por várias horas, até desmanchar.
4. Desfie a carne dentro do próprio caldo.
5. Sirva com farinha de mandioca polvilhada e banana fatiada.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Barreado.jpg",
  },
  {
    nome: "Arrumadinho Pernambucano",
    slug: "arrumadinho-pernambucano",
    regiao: Regiao.NORDESTE,
    estado: Estado.PE,
    descricao:
      "Feijão-verde, macaxeira cozida e charque desfiado, arrumados em camadas com queijo coalho por cima.",
    precoFake: 28.5,
    descontoPct: 18,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Queijo coalho extra", 6),
    receitaMd: `# Arrumadinho Pernambucano

## Ingredientes
- 300g de charque dessalgado e desfiado
- 2 xícaras de feijão-verde cozido
- 500g de macaxeira cozida e amassada
- 100g de queijo coalho em cubos
- Cebola e cheiro-verde a gosto

## Modo de preparo
1. Refogue o charque desfiado com cebola até dourar.
2. Cozinhe o feijão-verde e a macaxeira separadamente.
3. Amasse a macaxeira até virar um purê grosso.
4. Grelhe o queijo coalho em cubos.
5. Arrume em camadas: feijão-verde, macaxeira e charque.
6. Finalize com o queijo coalho grelhado e cheiro-verde.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/BRUNO_LIMA_GASTRONOMIA_CARNE_DE_SOL_GRAVATÁ_PE_(40198041084).jpg",
  },
  {
    nome: "Paçoca de Carne de Sol",
    slug: "pacoca-de-carne-de-sol",
    regiao: Regiao.NORDESTE,
    estado: Estado.PI,
    descricao:
      "Carne de sol desfiada e socada no pilão com farinha de mandioca e cebola — versão salgada e robusta da paçoca piauiense.",
    precoFake: 25.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Carne extra", 8),
    receitaMd: `# Paçoca de Carne de Sol

## Ingredientes
- 400g de carne de sol dessalgada
- 1 xícara de farinha de mandioca
- 1 cebola picada
- 2 dentes de alho picados
- Manteiga de garrafa a gosto

## Modo de preparo
1. Cozinhe a carne de sol até ficar bem macia e desfie.
2. Refogue cebola e alho na manteiga de garrafa.
3. Socar a carne desfiada com a farinha de mandioca no pilão (ou pulsar no processador).
4. Misture o refogado à mistura socada até ficar homogêneo.
5. Sirva com arroz branco e feijão.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Carne_de_sol_maturada.jpg",
  },
  {
    nome: "Camarão na Moranga",
    slug: "camarao-na-moranga",
    regiao: Regiao.NORDESTE,
    estado: Estado.RN,
    descricao:
      "Creme de camarão temperado servido dentro de uma moranga assada, combinando a suculência do camarão com a doçura da abóbora.",
    precoFake: 38.0,
    descontoPct: 15,
    vegetariano: false,
    trending: true,
    best: false,
    opcoesJson: opcoesPadrao("Camarão extra", 11),
    receitaMd: `# Camarão na Moranga

## Ingredientes
- 1 moranga média
- 500g de camarão limpo
- 200ml de creme de leite
- 1 cebola picada
- 3 dentes de alho picados
- Queijo ralado para gratinar

## Modo de preparo
1. Corte a tampa da moranga, retire as sementes e asse até ficar macia por dentro.
2. Refogue alho e cebola, adicione o camarão e tempere.
3. Junte o creme de leite e deixe engrossar.
4. Recheie a moranga assada com o creme de camarão.
5. Cubra com queijo ralado e leve ao forno para gratinar.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Camarão_na_moranga.JPG",
  },
  {
    nome: "Pirarucu à Casaca",
    slug: "pirarucu-a-casaca",
    regiao: Regiao.NORTE,
    estado: Estado.RO,
    descricao:
      "Pirarucu cozido, desfiado e refogado com tomate e pimentão, coberto com farinha de mandioca e gratinado no forno.",
    precoFake: 42.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Posta extra de pirarucu", 13),
    receitaMd: `# Pirarucu à Casaca

## Ingredientes
- 600g de pirarucu em postas
- 2 tomates picados
- 1 pimentão picado
- 1 cebola picada
- Azeite e cheiro-verde a gosto
- Farinha de mandioca para cobrir

## Modo de preparo
1. Cozinhe o pirarucu até ficar macio e desfie.
2. Refogue cebola, tomate e pimentão em azeite.
3. Junte o pirarucu desfiado e misture bem.
4. Coloque numa travessa e cubra com farinha de mandioca.
5. Leve ao forno até gratinar levemente.
6. Finalize com cheiro-verde picado.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pirarucu.JPG",
  },
  {
    nome: "Damurida",
    slug: "damurida",
    regiao: Regiao.NORTE,
    estado: Estado.RR,
    descricao:
      "Caldo indígena de origem Wapichana, feito com tucupi, peixe e bastante pimenta, acompanhado de beiju de mandioca.",
    precoFake: 24.0,
    descontoPct: 12,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Pimenta extra", 3),
    receitaMd: `# Damurida

## Ingredientes
- 500g de peixe em postas
- 1 litro de tucupi
- Jambu a gosto
- Pimentas variadas (malagueta, murupi) a gosto
- Beiju de mandioca para acompanhar

## Modo de preparo
1. Ferva o tucupi com as pimentas por cerca de 15 minutos.
2. Adicione o peixe em postas e cozinhe até ficar macio.
3. Junte o jambu nos últimos minutos de cozimento.
4. Sirva bem quente, acompanhado de beiju de mandioca.

**Atenção:** prato tradicionalmente bem apimentado — vai com calma se
não estiver acostumado.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Peixe.Dourada.Fish.jpg",
  },
  {
    nome: "Sequência de Camarão",
    slug: "sequencia-de-camarao",
    regiao: Regiao.SUL,
    estado: Estado.SC,
    descricao:
      "Camarão preparado em várias etapas — ao alho e óleo, empanado e ao molho — refeição completa típica de Florianópolis.",
    precoFake: 52.0,
    descontoPct: 15,
    vegetariano: false,
    trending: true,
    best: true,
    opcoesJson: opcoesPadrao("Camarão empanado extra", 14),
    receitaMd: `# Sequência de Camarão

## Ingredientes
- 1kg de camarão limpo, dividido em porções
- Alho, azeite e limão a gosto
- Farinha de rosca e ovo para empanar
- Creme de leite, tomate e cebola para o molho
- Arroz e batata frita para acompanhar

## Modo de preparo
1. Prepare a primeira etapa: camarão ao alho e óleo, salteado rapidamente.
2. Empane outra porção no ovo e farinha de rosca e frite até dourar.
3. Refogue cebola e tomate, junte camarão e creme de leite para o molho.
4. Sirva as três preparações juntas, com arroz e batata frita.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Moqueca_de_peixe_e_camarao_(7519822014).jpg",
  },
  {
    nome: "Caranguejada",
    slug: "caranguejada",
    regiao: Regiao.NORDESTE,
    estado: Estado.SE,
    descricao:
      "Caranguejo inteiro cozido no leite de coco com alho, cebola, pimentão e bastante coentro — ícone da orla de Aracaju.",
    precoFake: 40.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Caranguejo extra", 12),
    receitaMd: `# Caranguejada

## Ingredientes
- 6 caranguejos limpos e inteiros
- 200ml de leite de coco
- 1 pimentão picado
- 1 cebola picada
- 3 dentes de alho picados
- Coentro a gosto

## Modo de preparo
1. Refogue alho, cebola e pimentão.
2. Adicione os caranguejos e refogue por alguns minutos.
3. Cubra com o leite de coco e cozinhe em fogo médio até os caranguejos ficarem prontos.
4. Finalize com bastante coentro picado.
5. Sirva com martelinho para quebrar a casca — parte da experiência.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Caranguejo_na_raiz_do_mangue.jpg",
  },
  {
    nome: "Peixe na Telha",
    slug: "peixe-na-telha",
    regiao: Regiao.NORTE,
    estado: Estado.TO,
    descricao:
      "Peixe de água doce (tucunaré ou tambaqui) preparado e servido sobre telha de barro, típico das margens do Rio Tocantins.",
    precoFake: 37.0,
    descontoPct: 15,
    vegetariano: false,
    trending: false,
    best: false,
    opcoesJson: opcoesPadrao("Posta extra de peixe", 10),
    receitaMd: `# Peixe na Telha

## Ingredientes
- 700g de filé de tucunaré ou tambaqui
- 2 tomates picados
- 1 cebola fatiada
- Azeite e cheiro-verde a gosto
- Limão e sal a gosto

## Modo de preparo
1. Tempere o peixe com limão, sal e alho.
2. Arrume o peixe sobre a telha de barro (ou travessa refratária).
3. Cubra com tomate e cebola fatiados e regue com azeite.
4. Leve ao forno até o peixe ficar macio e levemente dourado.
5. Finalize com cheiro-verde picado.`,
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Peixe_pedra.jpg",
  },
];

const motoboys = [
  {
    nome: "Jailson da Biz",
    avatarEmoji: "🏍️",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Jaguatirica_ou_Gato_do_mato.jpg",
    frase: "Tô chegando, confia",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Marquinhos da Fan",
    avatarEmoji: "🛵",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Toco_toucan_(Ramphastos_toco).jpg",
    frase: "Já tô virando a esquina",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Zé do Capacete Torto",
    avatarEmoji: "🪖",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/A_capivara_-_Parque_Barigui_-_Curitiba_(PR).jpg",
    frase: "Calma que eu chego",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Rogério Entregas Relâmpago",
    avatarEmoji: "⚡",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Gavião-real_(Harpia_harpyja).jpg",
    frase: "Rápido é o meu nome do meio",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Wanderson da CG",
    avatarEmoji: "🏍️",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Quati_na_Serra_do_Rio_do_Rastro,_RS,_Brasil.jpg",
    frase: "Só um cafezinho e já vou",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Deivid do Grupo do Zap",
    avatarEmoji: "📱",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Papagaio_falante.jpg",
    frase: "Te mandei a localização, olha lá",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Fabinho Sem Pressa",
    avatarEmoji: "🐌",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bicho-preguiça_(Folivora).jpg",
    frase: "Devagar se chega longe",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Anderson da Chuva",
    avatarEmoji: "🌧️",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Jacaré_na_APA_do_Miriti_Manacapuru_AM.jpg",
    frase: "Segurando o capacete e a fé",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Dona Cida da Kombi",
    avatarEmoji: "🚐",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tamanduá-bandeira_com_filhote_em_pastagem.jpg",
    frase: "Levo até fogão se precisar",
    raridade: Raridade.RARO,
    pesoSorteio: 3,
  },
  {
    nome: "Sargento Empanado",
    avatarEmoji: "🎖️",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Tatu_Mulita.jpg",
    frase: "Missão dada é missão cumprida",
    raridade: Raridade.RARO,
    pesoSorteio: 3,
  },
  {
    nome: "Neon do Rolê Noturno",
    avatarEmoji: "🌃",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Coruja_Buraqueira_(Athene_cunicularia).jpg",
    frase: "Entrego até de madrugada, sem medo",
    raridade: Raridade.RARO,
    pesoSorteio: 3,
  },
  {
    nome: "Barão do Grau",
    avatarEmoji: "🤙",
    fotoUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Arara_Azul_no_Pantanal.jpg",
    frase: "Cheguei de empinada",
    raridade: Raridade.LENDARIO,
    pesoSorteio: 1,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("trocar123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@pnc.dev" },
    update: {},
    create: {
      email: "admin@pnc.dev",
      passwordHash,
    },
  });

  for (const comida of comidas) {
    await prisma.comida.upsert({
      where: { slug: comida.slug },
      update: { estado: comida.estado },
      create: comida,
    });
  }

  for (const motoboy of motoboys) {
    const existente = await prisma.motoboy.findFirst({
      where: { nome: motoboy.nome },
    });
    if (existente) {
      await prisma.motoboy.update({
        where: { id: existente.id },
        data: { fotoUrl: motoboy.fotoUrl },
      });
    } else {
      await prisma.motoboy.create({ data: motoboy });
    }
  }

  await prisma.configuracao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      chavePix: "SUA_CHAVE_AQUI",
      nomeRecebedor: "PedidoNuncaChega",
      cidadeRecebedor: "SAO PAULO",
      tiersDoacaoJson: [
        { valor: 2, rotulo: "um café pro motoboy ☕" },
        { valor: 5, rotulo: "uma coxinha virtual 🍗" },
        { valor: 10, rotulo: "gasolina da moto fantasma ⛽" },
      ],
      textosJson: {},
    },
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
