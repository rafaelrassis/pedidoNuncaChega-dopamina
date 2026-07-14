# Deploy

Guia pra colocar o pedidonuncachega no ar: **Vercel** (app) + **Neon** ou
**Supabase** (Postgres).

## 1. Banco de dados (Neon ou Supabase)

Crie um projeto Postgres gratuito em [neon.tech](https://neon.tech) ou
[supabase.com](https://supabase.com) e copie a connection string (formato
`postgresql://usuario:senha@host/banco?sslmode=require`).

## 2. Deploy na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js** (detectado automaticamente).
3. Configure as variáveis de ambiente (Project Settings → Environment
   Variables):

   | Variável                 | Valor                                                              |
   | ------------------------- | ------------------------------------------------------------------- |
   | `DATABASE_URL`            | connection string do Neon/Supabase (pooled)                         |
   | `DIRECT_URL`              | connection string direta (sem pooler), usada pelo Prisma Migrate    |
   | `JWT_SECRET`              | uma string aleatória longa (ex: `openssl rand -base64 32`)          |
   | `NEXT_PUBLIC_SITE_URL`    | URL final do site, ex: `https://pedidonuncachega.com.br`             |
   | `BLOB_READ_WRITE_TOKEN`   | criado ao conectar um Vercel Blob store ao projeto (ver passo 4)    |

4. **Storage → Create Database → Blob**, conecte o store ao projeto. A
   Vercel injeta `BLOB_READ_WRITE_TOKEN` automaticamente — é o que permite
   o upload de fotos pelo `/admin`.
5. Deploy.

## 3. Migrations + seed

Rodam sozinhos: o `build` do projeto já executa
`prisma migrate deploy && prisma db seed` antes do `next build` (ver
`package.json`). Não precisa rodar nada manualmente. O primeiro deploy
cria o schema e popula:

- 1 admin (`admin@pnc.dev` / senha `trocar123`)
- 27 comidas (uma por estado)
- 12 motoboys (8 comuns, 3 raros, 1 lendário)
- 1 registro de `Configuracao` com chave PIX placeholder

O seed é idempotente — roda de novo em todo deploy sem sobrescrever
edições feitas no `/admin`.

## 4. Depois do primeiro deploy

- **Troque a senha do admin.** Acesse `/admin/login` com as credenciais do
  seed e depois vá em `/admin/senha` pra trocar a senha padrão pela sua.
- **Configure a chave PIX real** em `/admin/config` antes de divulgar o
  site — enquanto `chavePix` for `SUA_CHAVE_AQUI`, o card de doação (`/doar`
  e o modal de entrega) fica escondido.
- **Fotos dos pratos e motoboys**: o seed já vem com fotos reais
  (baixadas do Wikimedia Commons durante o build, via
  `scripts/baixar-imagens.mjs`). Pra trocar qualquer uma, vá em
  `/admin/comidas` ou `/admin/motoboys` e faça upload de uma nova foto —
  fica salva no Vercel Blob e não depende mais do Wikimedia.

## Notas

- O `docker-compose.yml` do repo é só pra desenvolvimento local — em
  produção o Postgres é o Neon/Supabase.
- Progresso do jogador (pedidos, álbum, passaporte, streak) nunca passa
  pelo banco — fica só no `localStorage` de cada navegador, então não há
  nada pra migrar/exportar nesse sentido.
