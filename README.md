# pedidonuncachega

Um delivery fake de comida brasileira. Você "pede", acompanha um motoboy que
nunca chega, ganha figurinhas de motoboy pra colecionar e um streak diário —
tudo dopamina grátis, sem comida de verdade e sem vantagem paga.

## Rodando local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Suba o Postgres:

   ```bash
   docker compose up -d
   ```

3. Copie o `.env.example` para `.env` (já vem configurado pro Postgres local):

   ```bash
   cp .env.example .env
   ```

4. Rode as migrations e o client do Prisma:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

Abra [http://localhost:3000](http://localhost:3000).

Progresso do jogador (pedidos, álbum, passaporte, streak) fica todo no
`localStorage` do navegador — nada disso vai pro banco. Veja `CLAUDE.md` para
as convenções do projeto.
