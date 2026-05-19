# Quick Fix

Site React + aplicativo PWA + backend Django/SQLite para cadastro de clientes, profissionais e pedidos.

## Rodar o backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

API principal: `http://127.0.0.1:8000/api/`.

Crie um arquivo `.env` local usando `.env.example` como modelo. Nunca envie `.env` para o Git.

## Rodar o site

Em outro terminal:

```bash
npm install
npm run dev
```

Abra a URL do Vite. O frontend usa `http://127.0.0.1:8000/api` por padrao. Para trocar:

```bash
VITE_API_URL=http://127.0.0.1:8000/api npm run dev
```

## Banco Supabase

O Supabase usa PostgreSQL, entao o banco SQLite do Django foi convertido para um schema SQL equivalente em:

```text
supabase/schema.sql
```

Para criar as tabelas, abra o SQL Editor no Supabase, cole o conteudo do arquivo e execute. As instrucoes estao em `supabase/README.md`.

## Gerar aplicativo instalavel

```bash
npm run build
npm run dev -- --host 127.0.0.1
```

No navegador, use a opcao de instalar app/PWA. O manifest e o service worker ficam em `public/`.
