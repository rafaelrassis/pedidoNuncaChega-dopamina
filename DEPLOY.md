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

   | Variável              | Valor                                                              |
   | ---------------------- | ------------------------------------------------------------------- |
   | `DATABASE_URL`         | connection string do Neon/Supabase                                  |
   | `JWT_SECRET`           | uma string aleatória longa (ex: `openssl rand -base64 32`)          |
   | `NEXT_PUBLIC_SITE_URL` | URL final do site, ex: `https://pedidonuncachega.com.br`             |

4. Deploy.

## 3. Migrations + seed

O schema e os dados iniciais (catálogo de comidas, motoboys, config) não
sobem sozinhos — rode uma vez, apontando pro banco de produção:

```bash
# localmente, com DATABASE_URL apontando pro banco de produção
DATABASE_URL="<connection string de produção>" npx prisma migrate deploy
DATABASE_URL="<connection string de produção>" npx prisma db seed
```

Isso cria o schema e popula:

- 1 admin (`admin@pnc.dev` / senha `trocar123`)
- 10 comidas (2 por região)
- 12 motoboys (8 comuns, 3 raros, 1 lendário)
- 1 registro de `Configuracao` com chave PIX placeholder

## 4. Depois do primeiro deploy

- **Troque a senha do admin.** Acesse `/admin/login` com as credenciais do
  seed e crie/atualize o usuário admin (via `prisma studio` apontando pra
  produção, por enquanto — não há UI de troca de senha).
- **Configure a chave PIX real** em `/admin/config` antes de divulgar o
  site — enquanto `chavePix` for `SUA_CHAVE_AQUI`, o card de doação (`/doar`
  e o modal de entrega) fica escondido.
- **Fotos dos pratos**: os `fotoUrl` do seed apontam pra `/img/*.jpg`, que
  ainda não existem. Adicione as imagens em `public/img/` (ou troque as
  URLs em `/admin/comidas` por imagens hospedadas em outro lugar).

## Notas

- O `docker-compose.yml` do repo é só pra desenvolvimento local — em
  produção o Postgres é o Neon/Supabase.
- Progresso do jogador (pedidos, álbum, passaporte, streak) nunca passa
  pelo banco — fica só no `localStorage` de cada navegador, então não há
  nada pra migrar/exportar nesse sentido.
