import { PrismaClient, Regiao, Raridade } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const passwordHash = await bcrypt.hash("trocar123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@pnc.dev" },
    update: {},
    create: {
      email: "admin@pnc.dev",
      passwordHash,
    },
  });
}

const porcao = (grande: number) => ({
  grupo: "Porção",
  tipo: "radio",
  opcoes: [
    { nome: "Normal", acrescimo: 0 },
    { nome: "Grande", acrescimo: grande },
  ],
});

async function seedComidas() {
  const comidas = [
    {
      nome: "Feijoada",
      slug: "feijoada",
      regiao: Regiao.SUDESTE,
      descricao:
        "Feijoada completa com carnes defumadas, acompanhada de arroz, couve e farofa.",
      precoFake: 42.9,
      descontoPct: 20,
      vegetariano: false,
      trending: false,
      best: true,
      opcoesJson: [
        porcao(10),
        {
          grupo: "Acompanhamento",
          tipo: "radio",
          opcoes: [
            { nome: "Arroz branco", acrescimo: 0 },
            { nome: "Farofa extra", acrescimo: 4 },
            { nome: "Couve refogada", acrescimo: 3 },
          ],
        },
      ],
      receitaMd: `# Feijoada
1. Deixe o feijão preto de molho na véspera.
2. Cozinhe o feijão com carnes salgadas dessalgadas (costela, pé e orelha de porco).
3. Em outra panela, doure bacon, linguiça calabresa e carne seca.
4. Junte as carnes ao feijão já cozido e deixe apurar por 1h em fogo baixo.
5. Refogue alho e cebola numa frigideira à parte.
6. Adicione o refogado ao feijão para engrossar o caldo.
7. Tempere com louro, pimenta-do-reino e sal a gosto.
8. Cozinhe a couve-manteiga fatiada fininha com alho por 3 minutos.
9. Prepare a farofa dourando farinha de mandioca na gordura do bacon.
10. Corte laranjas em rodelas para acompanhar.
11. Cozinhe arroz branco soltinho.
12. Sirva o feijão bem quente em uma travessa funda.
13. Monte o prato com arroz, couve, farofa e a laranja ao lado.
14. Finalize com um fio da gordura reservada por cima do feijão.
15. Aproveite com uma boa cerveja gelada!`,
      fotoUrl: "/img/feijoada.jpg",
    },
    {
      nome: "Coxinha",
      slug: "coxinha",
      regiao: Regiao.SUDESTE,
      descricao: "Coxinha de frango cremosa, empanada e frita na hora.",
      precoFake: 18.9,
      descontoPct: 15,
      vegetariano: false,
      trending: true,
      best: false,
      opcoesJson: [
        porcao(8),
        {
          grupo: "Adicional",
          tipo: "radio",
          opcoes: [
            { nome: "Sem adicional", acrescimo: 0 },
            { nome: "Catupiry extra", acrescimo: 5 },
            { nome: "Molho apimentado", acrescimo: 0 },
          ],
        },
      ],
      receitaMd: `# Coxinha
1. Cozinhe o frango com cebola, alho e sal até desfiar fácil.
2. Reserve o caldo do cozimento para o massa.
3. Desfie o frango e refogue com catupiry até formar um recheio cremoso.
4. Leve o caldo reservado ao fogo com manteiga e farinha de trigo.
5. Mexa sem parar até formar uma massa lisa que desgruda da panela.
6. Deixe a massa esfriar coberta com filme plástico.
7. Unte as mãos com óleo e pegue porções da massa.
8. Abra a massa na palma da mão formando um disco.
9. Recheie com o frango desfiado e feche no formato de gotícula.
10. Passe cada coxinha em ovo batido.
11. Empane na farinha de rosca pressionando bem.
12. Aqueça óleo abundante em fogo médio.
13. Frite as coxinhas até dourarem por igual.
14. Escorra em papel toalha antes de servir.
15. Sirva quente, de preferência com um molho apimentado.`,
      fotoUrl: "/img/coxinha.jpg",
    },
    {
      nome: "Acarajé",
      slug: "acaraje",
      regiao: Regiao.NORDESTE,
      descricao:
        "Bolinho de feijão-fradinho frito no azeite de dendê, recheado com vatapá e camarão.",
      precoFake: 24.9,
      descontoPct: 25,
      vegetariano: false,
      trending: true,
      best: false,
      opcoesJson: [
        porcao(10),
        {
          grupo: "Recheio",
          tipo: "radio",
          opcoes: [
            { nome: "Sem pimenta", acrescimo: 0 },
            { nome: "Vatapá extra", acrescimo: 6 },
            { nome: "Camarão extra", acrescimo: 8 },
          ],
        },
      ],
      receitaMd: `# Acarajé
1. Deixe o feijão-fradinho de molho e retire as peles esfregando os grãos.
2. Bata o feijão descascado no liquidificador com cebola até virar uma pasta.
3. Bata bem a massa à mão para incorporar ar e ficar leve.
4. Tempere com sal a gosto.
5. Aqueça o azeite de dendê em fogo médio-alto numa panela funda.
6. Modele porções da massa com o formato de bolinho usando duas colheres.
7. Frite no dendê até dourar por fora, virando uma vez.
8. Escorra em papel toalha.
9. Prepare o vatapá com pão amanhecido, camarão seco, amendoim e dendê batidos.
10. Prepare a caruru refogando quiabo com camarão seco e dendê.
11. Corte o acarajé ao meio sem separar totalmente.
12. Recheie com vatapá.
13. Adicione caruru e camarões secos por cima.
14. Finalize com pimenta e vinagrete de tomate e cebola.
15. Sirva ainda quente.`,
      fotoUrl: "/img/acaraje.jpg",
    },
    {
      nome: "Baião de Dois",
      slug: "baiao-de-dois",
      regiao: Regiao.NORDESTE,
      descricao:
        "Arroz com feijão-de-corda, queijo coalho e temperos nordestinos.",
      precoFake: 29.9,
      descontoPct: 20,
      vegetariano: true,
      trending: false,
      best: false,
      opcoesJson: [
        porcao(12),
        {
          grupo: "Adicional",
          tipo: "radio",
          opcoes: [
            { nome: "Sem adicional", acrescimo: 0 },
            { nome: "Queijo coalho grelhado", acrescimo: 7 },
            { nome: "Carne de sol", acrescimo: 9 },
          ],
        },
      ],
      receitaMd: `# Baião de Dois
1. Deixe o feijão-de-corda de molho por algumas horas.
2. Cozinhe o feijão até ficar macio, reservando o caldo.
3. Refogue cebola e alho na manteiga de garrafa.
4. Adicione o feijão cozido com um pouco do caldo ao refogado.
5. Junte o arroz lavado à panela.
6. Complete com caldo do feijão até cobrir o arroz.
7. Tempere com coentro picado e cominho.
8. Cozinhe em fogo baixo até o arroz absorver o líquido.
9. Corte queijo coalho em cubos.
10. Misture o queijo coalho ao arroz ainda quente para derreter levemente.
11. Adicione manteiga de garrafa extra para dar brilho.
12. Ajuste o sal.
13. Deixe descansar tampado por 5 minutos.
14. Finalize com coentro fresco picado por cima.
15. Sirva quente, puro ou com carne de sol grelhada.`,
      fotoUrl: "/img/baiao-de-dois.jpg",
    },
    {
      nome: "Churrasco",
      slug: "churrasco",
      regiao: Regiao.SUL,
      descricao: "Espeto misto de carnes nobres grelhadas no ponto certo.",
      precoFake: 44.9,
      descontoPct: 15,
      vegetariano: false,
      trending: false,
      best: true,
      opcoesJson: [
        porcao(15),
        {
          grupo: "Corte",
          tipo: "radio",
          opcoes: [
            { nome: "Picanha", acrescimo: 10 },
            { nome: "Costela", acrescimo: 8 },
            { nome: "Linguiça", acrescimo: 5 },
          ],
        },
      ],
      receitaMd: `# Churrasco
1. Retire as carnes da geladeira com antecedência para chegarem à temperatura ambiente.
2. Tempere apenas com sal grosso pouco antes de assar.
3. Acenda o carvão e espere formar brasa uniforme, sem chamas.
4. Distribua a brasa concentrando mais calor de um lado da grelha.
5. Comece pelas carnes mais gordas, como a picanha, com a gordura para baixo.
6. Vire a picanha só quando soltar naturalmente da grelha.
7. Grelhe a costela em fogo mais brando e por mais tempo.
8. Adicione a linguiça na grelha, virando com frequência.
9. Controle o ponto com toques no dedo ou termômetro de carne.
10. Deixe a picanha no ponto mal passado a médio.
11. Retire cada carne assim que atingir o ponto desejado.
12. Deixe as carnes descansarem por 5 minutos antes de fatiar.
13. Fatie a picanha contra as fibras.
14. Prepare uma farofa e vinagrete para acompanhar.
15. Sirva tudo junto, bem quente, direto da brasa.`,
      fotoUrl: "/img/churrasco.jpg",
    },
    {
      nome: "Chimarrão com Pão de Queijo",
      slug: "chimarrao-pao-de-queijo",
      regiao: Regiao.SUL,
      descricao:
        "Chimarrão tradicional na cuia acompanhado de pão de queijo quentinho.",
      precoFake: 26.9,
      descontoPct: 30,
      vegetariano: true,
      trending: false,
      best: false,
      opcoesJson: [
        porcao(10),
        {
          grupo: "Adicional",
          tipo: "radio",
          opcoes: [
            { nome: "Sem adicional", acrescimo: 0 },
            { nome: "Pão de queijo extra", acrescimo: 4 },
            { nome: "Erva-doce no chimarrão", acrescimo: 0 },
          ],
        },
      ],
      receitaMd: `# Chimarrão com Pão de Queijo
1. Aqueça a água até quase ferver, sem deixar borbulhar.
2. Encha a cuia com erva-mate até cerca de 2/3 da capacidade.
3. Incline a cuia para acomodar a erva de um lado só.
4. Molhe a erva com um pouco de água fria primeiro para não queimar.
5. Insira a bomba encostada na parede da cuia.
6. Complete com água quente devagar, sem mexer a erva.
7. Deixe a primeira água ser absorvida antes de tomar.
8. Para o pão de queijo, misture polvilho azedo e doce com água e óleo fervendo.
9. Deixe a massa esfriar até dar para sovar com as mãos.
10. Adicione ovos e queijo minas ralado, sovando bem.
11. Modele bolinhas do tamanho de uma bola de golfe.
12. Disponha em uma assadeira untada.
13. Asse em forno pré-aquecido a 180°C por cerca de 25 minutos.
14. Retire quando dourarem por fora e ficarem macios por dentro.
15. Sirva o pão de queijo quente junto com o chimarrão recém-preparado.`,
      fotoUrl: "/img/chimarrao-pao-de-queijo.jpg",
    },
    {
      nome: "Açaí Raiz",
      slug: "acai-raiz",
      regiao: Regiao.NORTE,
      descricao:
        "Açaí batido na medida certa, sem xarope, do jeito que se come no Norte.",
      precoFake: 22.9,
      descontoPct: 25,
      vegetariano: true,
      trending: true,
      best: false,
      opcoesJson: [
        {
          grupo: "Porção",
          tipo: "radio",
          opcoes: [
            { nome: "300ml", acrescimo: 0 },
            { nome: "500ml", acrescimo: 8 },
          ],
        },
        {
          grupo: "Adicional",
          tipo: "radio",
          opcoes: [
            { nome: "Sem adicional", acrescimo: 0 },
            { nome: "Granola", acrescimo: 3 },
            { nome: "Banana", acrescimo: 2 },
          ],
        },
      ],
      receitaMd: `# Açaí Raiz
1. Colha ou compre os frutos de açaí bem maduros.
2. Lave os frutos em água corrente para retirar impurezas.
3. Amoleça os caroços deixando de molho em água morna.
4. Bata os frutos amolecidos no liquidificador com um pouco de água.
5. Passe a mistura na despolpadeira para separar caroço e casca da polpa.
6. Repita o processo até extrair o máximo de polpa possível.
7. Bata a polpa pura, sem adição de xarope de guaraná ou açúcar.
8. Sirva o açaí batido bem gelado, quase congelado.
9. Acompanhe tradicionalmente com farinha de tapioca ou de mandioca.
10. Quem preferir pode comer com peixe frito, como se faz no Pará.
11. Para versão doce, adicione banana amassada por cima.
12. Finalize com um fio de xarope de guaraná, se quiser adoçar.
13. Adicione granola para dar crocância.
14. Misture levemente só na hora de comer.
15. Aproveite puro, sem gelo de água para não aguar o sabor.`,
      fotoUrl: "/img/acai-raiz.jpg",
    },
    {
      nome: "Tacacá",
      slug: "tacaca",
      regiao: Regiao.NORTE,
      descricao:
        "Caldo quente de tucupi e goma com jambu e camarão seco, servido na cuia.",
      precoFake: 27.9,
      descontoPct: 20,
      vegetariano: false,
      trending: false,
      best: false,
      opcoesJson: [
        porcao(9),
        {
          grupo: "Adicional",
          tipo: "radio",
          opcoes: [
            { nome: "Sem adicional", acrescimo: 0 },
            { nome: "Camarão extra", acrescimo: 6 },
            { nome: "Jambu extra", acrescimo: 2 },
          ],
        },
      ],
      receitaMd: `# Tacacá
1. Ferva o tucupi por cerca de 30 minutos para cozinhar bem o líquido.
2. Tempere o tucupi com alho e sal a gosto.
3. Lave as folhas de jambu em água corrente.
4. Cozinhe o jambu no próprio tucupi por alguns minutos.
5. Retire o jambu e reserve, mantendo o tucupi fervendo.
6. Dissolva a goma de tapioca em água fria até formar uma pasta lisa.
7. Adicione a goma dissolvida ao tucupi fervente, mexendo sempre.
8. Cozinhe mexendo até engrossar e ficar translúcido.
9. Limpe e tempere os camarões secos, dessalgando se necessário.
10. Aqueça os camarões numa frigideira seca.
11. Aqueça as cuias ou tigelas para servir.
12. Coloque uma porção da goma engrossada em cada cuia.
13. Complete com o tucupi quente por cima.
14. Adicione o jambu cozido e os camarões secos.
15. Sirva imediatamente, bem quente, com pimenta a gosto.`,
      fotoUrl: "/img/tacaca.jpg",
    },
    {
      nome: "Pequi com Frango",
      slug: "pequi-com-frango",
      regiao: Regiao.CENTRO_OESTE,
      descricao:
        "Frango caipira cozido no molho de pequi, tempero típico do Centro-Oeste.",
      precoFake: 34.9,
      descontoPct: 15,
      vegetariano: false,
      trending: false,
      best: true,
      opcoesJson: [
        porcao(13),
        {
          grupo: "Acompanhamento",
          tipo: "radio",
          opcoes: [
            { nome: "Sem acompanhamento", acrescimo: 0 },
            { nome: "Arroz com pequi", acrescimo: 5 },
            { nome: "Farofa", acrescimo: 3 },
          ],
        },
      ],
      receitaMd: `# Pequi com Frango
1. Corte o frango caipira em pedaços e tempere com sal e alho.
2. Lave bem os pequis por fora, já que a casca solta resina.
3. Corte os pequis ao meio com cuidado, sem furar o caroço interno.
4. Doure o frango em óleo quente até pegar cor por fora.
5. Retire o frango e reserve.
6. Na mesma panela, refogue cebola e alho picados.
7. Volte o frango à panela com o refogado.
8. Adicione os pequis cortados por cima do frango.
9. Cubra com água e deixe cozinhar em fogo médio.
10. Tampe a panela e cozinhe por cerca de 40 minutos.
11. Verifique o tempero e ajuste o sal.
12. Deixe o molho reduzir até engrossar levemente.
13. Cozinhe arroz branco à parte para acompanhar.
14. Sirva o frango com pequi e bastante molho por cima do arroz.
15. Atenção: nunca morda o caroço do pequi, só chupe a polpa em volta.`,
      fotoUrl: "/img/pequi-com-frango.jpg",
    },
    {
      nome: "Pamonha",
      slug: "pamonha",
      regiao: Regiao.CENTRO_OESTE,
      descricao:
        "Pamonha cremosa de milho verde cozida na palha, doce ou salgada.",
      precoFake: 16.9,
      descontoPct: 30,
      vegetariano: true,
      trending: false,
      best: false,
      opcoesJson: [
        {
          grupo: "Porção",
          tipo: "radio",
          opcoes: [
            { nome: "Doce", acrescimo: 0 },
            { nome: "Salgada", acrescimo: 3 },
          ],
        },
        {
          grupo: "Adicional",
          tipo: "radio",
          opcoes: [
            { nome: "Sem adicional", acrescimo: 0 },
            { nome: "Manteiga extra", acrescimo: 2 },
            { nome: "Queijo extra", acrescimo: 4 },
          ],
        },
      ],
      receitaMd: `# Pamonha
1. Debulhe os milhos verdes reservando as palhas mais bonitas e inteiras.
2. Lave bem as palhas reservadas em água corrente.
3. Bata os grãos de milho no liquidificador ou passe na máquina de moer.
4. Peneire a massa para retirar as fibras mais grossas, se preferir textura lisa.
5. Misture a massa com um pouco de leite e sal (ou açúcar, na versão doce).
6. Adicione manteiga ou óleo para dar cremosidade.
7. Para a versão salgada, misture queijo picado à massa.
8. Monte um envelope com duas ou três palhas sobrepostas.
9. Coloque uma porção generosa da massa no centro das palhas.
10. Dobre as laterais da palha por cima da massa.
11. Amarre as pontas com tiras da própria palha.
12. Repita até usar toda a massa.
13. Cozinhe as pamonhas em água fervente por cerca de 40 minutos.
14. Vire de vez em quando para cozinhar por igual.
15. Escorra e sirva quente, ainda dentro da palha.`,
      fotoUrl: "/img/pamonha.jpg",
    },
  ];

  for (const comida of comidas) {
    await prisma.comida.upsert({
      where: { slug: comida.slug },
      update: comida,
      create: comida,
    });
  }
}

async function seedMotoboys() {
  const motoboys = [
    {
      nome: "Jailson da Biz",
      avatarEmoji: "🏍️",
      frase: "Tô chegando, confia",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Marquinhos Relâmpago",
      avatarEmoji: "⚡",
      frase: "Chega antes do delivery pensar",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Seu Toinho do Fusca",
      avatarEmoji: "🚗",
      frase: "Devagar e sempre, mas chega",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Zé do Capacete Torto",
      avatarEmoji: "🪖",
      frase: "Trânsito pra mim é atalho",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Robertinho Sem Freio",
      avatarEmoji: "🛵",
      frase: "Já passei, já voltei",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Nem da Bike Elétrica",
      avatarEmoji: "🔋",
      frase: "Silencioso e pontual",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Cabeção da 125",
      avatarEmoji: "🏁",
      frase: "Rachando o bairro inteiro",
      raridade: Raridade.COMUM,
      pesoSorteio: 10,
    },
    {
      nome: "Duda do Fone no Ouvido",
      avatarEmoji: "🎧",
      frase: "Chego cantando, chego rindo",
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
      nome: "Vandinho Sinaleira Verde",
      avatarEmoji: "🚦",
      frase: "Nunca peguei um vermelho, juro",
      raridade: Raridade.RARO,
      pesoSorteio: 3,
    },
    {
      nome: "Miojo Turbo",
      avatarEmoji: "🍜",
      frase: "Rápido que nem miojo de 3 minutos",
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

  for (const motoboy of motoboys) {
    const existente = await prisma.motoboy.findFirst({
      where: { nome: motoboy.nome },
    });
    if (existente) {
      await prisma.motoboy.update({ where: { id: existente.id }, data: motoboy });
    } else {
      await prisma.motoboy.create({ data: motoboy });
    }
  }
}

async function seedConfiguracao() {
  await prisma.configuracao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      chavePix: "SUA_CHAVE_AQUI",
      nomeRecebedor: "Pedido Nunca Chega",
      cidadeRecebedor: "SAO PAULO",
      tiersDoacaoJson: [
        { valor: 2, rotulo: "um café pro motoboy ☕" },
        { valor: 5, rotulo: "uma coxinha virtual 🍗" },
        { valor: 10, rotulo: "gasolina da moto fantasma ⛽" },
      ],
      textosJson: {
        tituloDoacao: "Apoie o projeto",
        subtituloDoacao:
          "Sua doação não desbloqueia nada no jogo, é só carinho ❤️",
      },
    },
  });
}

async function main() {
  await seedAdmin();
  await seedComidas();
  await seedMotoboys();
  await seedConfiguracao();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
