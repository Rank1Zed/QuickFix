# Banco Supabase do Quick Fix

O Supabase usa PostgreSQL, nao SQLite. O arquivo [schema.sql](./schema.sql) converte o banco atual do Django/SQLite para tabelas PostgreSQL equivalentes.

## Como criar no Supabase

1. Abra seu projeto no Supabase.
2. Va em `SQL Editor`.
3. Cole o conteudo de `supabase/schema.sql`.
4. Clique em `Run`.

As tabelas criadas sao:

- `core_client`
- `core_professional`
- `core_serviceorder`

Esses nomes seguem o padrao do Django para os models atuais, entao fica mais facil conectar o backend Django ao Supabase depois.

## Observacao

O schema deixa o Row Level Security desativado porque o acesso atual passa pelo backend Django. Se o frontend for acessar o Supabase diretamente, sera preciso ativar RLS e criar policies com `auth.uid()`.
