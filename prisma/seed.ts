import { PrismaClient, Regiao, Raridade } from "@prisma/client";
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
    fotoUrl: "/img/feijoada.jpg",
  },
  {
    nome: "Coxinha",
    slug: "coxinha",
    regiao: Regiao.SUDESTE,
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
    fotoUrl: "/img/coxinha.jpg",
  },
  {
    nome: "Acarajé",
    slug: "acaraje",
    regiao: Regiao.NORDESTE,
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
    fotoUrl: "/img/acaraje.jpg",
  },
  {
    nome: "Baião de Dois",
    slug: "baiao-de-dois",
    regiao: Regiao.NORDESTE,
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
    fotoUrl: "/img/baiao-de-dois.jpg",
  },
  {
    nome: "Churrasco",
    slug: "churrasco",
    regiao: Regiao.SUL,
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
    fotoUrl: "/img/churrasco.jpg",
  },
  {
    nome: "Chimarrão com Pão de Queijo",
    slug: "chimarrao-pao-de-queijo",
    regiao: Regiao.SUL,
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
    fotoUrl: "/img/chimarrao-pao-de-queijo.jpg",
  },
  {
    nome: "Açaí Raiz",
    slug: "acai-raiz",
    regiao: Regiao.NORTE,
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
    fotoUrl: "/img/acai-raiz.jpg",
  },
  {
    nome: "Tacacá",
    slug: "tacaca",
    regiao: Regiao.NORTE,
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
    fotoUrl: "/img/tacaca.jpg",
  },
  {
    nome: "Pequi com Frango",
    slug: "pequi-com-frango",
    regiao: Regiao.CENTRO_OESTE,
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
    fotoUrl: "/img/pequi-com-frango.jpg",
  },
  {
    nome: "Pamonha",
    slug: "pamonha",
    regiao: Regiao.CENTRO_OESTE,
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
    fotoUrl: "/img/pamonha.jpg",
  },
];

const motoboys = [
  {
    nome: "Jailson da Biz",
    avatarEmoji: "🏍️",
    frase: "Tô chegando, confia",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Marquinhos da Fan",
    avatarEmoji: "🛵",
    frase: "Já tô virando a esquina",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Zé do Capacete Torto",
    avatarEmoji: "🪖",
    frase: "Calma que eu chego",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Rogério Entregas Relâmpago",
    avatarEmoji: "⚡",
    frase: "Rápido é o meu nome do meio",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Wanderson da CG",
    avatarEmoji: "🏍️",
    frase: "Só um cafezinho e já vou",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Deivid do Grupo do Zap",
    avatarEmoji: "📱",
    frase: "Te mandei a localização, olha lá",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Fabinho Sem Pressa",
    avatarEmoji: "🐌",
    frase: "Devagar se chega longe",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Anderson da Chuva",
    avatarEmoji: "🌧️",
    frase: "Segurando o capacete e a fé",
    raridade: Raridade.COMUM,
    pesoSorteio: 10,
  },
  {
    nome: "Dona Cida da Kombi",
    avatarEmoji: "🚐",
    frase: "Levo até fogão se precisar",
    raridade: Raridade.RARO,
    pesoSorteio: 3,
  },
  {
    nome: "Sargento Empanado",
    avatarEmoji: "🎖️",
    frase: "Missão dada é missão cumprida",
    raridade: Raridade.RARO,
    pesoSorteio: 3,
  },
  {
    nome: "Neon do Rolê Noturno",
    avatarEmoji: "🌃",
    frase: "Entrego até de madrugada, sem medo",
    raridade: Raridade.RARO,
    pesoSorteio: 3,
  },
  {
    nome: "Barão do Grau",
    avatarEmoji: "🤙",
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
      update: {},
      create: comida,
    });
  }

  for (const motoboy of motoboys) {
    const existente = await prisma.motoboy.findFirst({
      where: { nome: motoboy.nome },
    });
    if (!existente) {
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
