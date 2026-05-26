# Quick Fix

Site React + aplicativo PWA + backend Django/SQLite para cadastro de clientes, profissionais e pedidos.

## Rodar o projeto em desenvolvimento

```bash
npm install
npm run dev
```

O comando acima prepara as migracoes do Django, inicia a API em `http://127.0.0.1:8000/api/` e sobe o Vite no mesmo terminal. Se uma API QuickFix ja estiver ativa na porta 8000, o script reaproveita ela; se a porta estiver ocupada por outro processo, ele mostra um erro claro.

Crie um arquivo `.env` local usando `.env.example` como modelo. Nunca envie `.env` para o Git.

## Rodar partes separadas

Frontend apenas:

```bash
npm run dev:frontend
```

Backend manual, se precisar depurar diretamente:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

O frontend usa `http://127.0.0.1:8000/api` por padrao. Para trocar:

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
