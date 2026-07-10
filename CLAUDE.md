# pedidonuncachega

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (só para conteúdo estático/catálogo, ver regra abaixo)
- `docker-compose.yml` sobe o Postgres local (db/user/senha: `pnc`)

## Convenções

- Componentes React em `components/` com nomes e textos em **PT-BR**
  (ex: `Cabecalho.tsx`, `Rodape.tsx`).
- Server Components por padrão. Só usar `"use client"` quando houver
  interatividade real (estado, eventos, localStorage).
- `lib/` para helpers puros (`storage.ts`, `prisma.ts`).

## Tema visual

- Fundo: `#FFF6F0` (creme)
- Cor primária: `#E2574C` (vermelho tomate)
- Cor de destaque: `#2E9E6B` (verde)
- Fonte de display (títulos): Bricolage Grotesque
- Fonte de corpo: Inter
- Classes Tailwind: `bg-fundo`, `text-primaria`, `text-destaque`,
  `font-display`, `font-body`.

## Regras de dados (não negociáveis)

- **Todo progresso do jogador** (pedidos, álbum de figurinhas, passaporte,
  streak) fica **sempre em `localStorage`**, via `lib/storage.ts`.
  **Nunca** persistir isso no banco de dados.
- O Prisma/Postgres serve só para conteúdo estático compartilhado (ex:
  catálogo de motoboys), nunca para estado individual do jogador.
- **Doação real nunca dá vantagem no jogo.** Nenhuma feature de doação pode
  desbloquear figurinhas, acelerar streak, ou dar qualquer benefício de
  gameplay. Doação é só apoio ao projeto, sempre.
