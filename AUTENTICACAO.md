# 🔐 Sistema de Autenticação CapiCare

## Como Funciona

### 1. Fluxo de Acesso

```
Usuário preenche email → API valida no Supabase → Redireciona para /plano
```

### 2. Banco de Dados (Supabase)

A tabela `purchases` armazena todas as compras:

```sql
- id: UUID único
- email: Email do comprador (chave de busca)
- plan: Plano contratado (basic, premium, etc)
- duration: Duração em dias
- purchase_date: Data da compra
- expiration_date: Data de expiração
- active: Se o acesso está ativo
- status: Status do pagamento
```

### 3. API de Verificação

**Endpoint:** `/api/verify-access`

**Método:** POST

**Body:**
```json
{
  "email": "usuario@email.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Acesso válido",
  "data": {
    "email": "usuario@email.com",
    "plan": "premium",
    "duration": 90,
    "purchaseDate": "2026-01-02T12:00:00Z",
    "expirationDate": "2026-04-02T12:00:00Z",
    "active": true,
    "status": "approved",
    "daysRemaining": 90
  }
}
```

**Resposta de Erro (404):**
```json
{
  "success": false,
  "error": "Acesso não encontrado. Verifique se você usou o mesmo email da compra ou se o pagamento foi aprovado."
}
```

### 4. Validação

A API valida:
- ✅ Email existe na tabela purchases
- ✅ Acesso está ativo (active = true)
- ✅ Data de expiração não passou
- ✅ Status é "approved"

### 5. Configuração

**Variáveis de Ambiente (.env.local):**
```env
# Supabase (servidor)
SUPABASE_URL="sua_url_aqui"
SUPABASE_SERVICE_ROLE_KEY="sua_service_key_aqui"

# Next.js (cliente/browser)
NEXT_PUBLIC_SUPABASE_URL="sua_url_aqui"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_anon_key_aqui"
```

### 6. Criação da Tabela

Execute o arquivo SQL:
```
supabase/migrations/create_purchases_table.sql
```

Clique em "Execute" na interface ou cole no Supabase SQL Editor.

### 7. Testando

**Emails de teste criados automaticamente:**
- teste@example.com (premium, 90 dias)
- demo@example.com (basic, 30 dias)

Para testar:
1. Vá em "Já tenho conta, acessar"
2. Digite: teste@example.com
3. Digite qualquer nome
4. Clique em "Acessar"
5. Deve redirecionar para /plano

### 8. Adicionando Novos Acessos

Para adicionar um novo acesso manualmente:

```sql
INSERT INTO public.purchases (email, plan, duration, expiration_date, active, status)
VALUES (
  'novoemail@example.com',
  'premium',
  90,
  NOW() + INTERVAL '90 days',
  true,
  'approved'
);
```

### 9. Logs de Debug

A API gera logs detalhados no console:
- 🚀 Início da verificação
- 🔧 Configurações carregadas
- 🔍 Buscando no Supabase
- ✅ Acesso aprovado
- ❌ Erros (se houver)

### 10. Troubleshooting

**Erro 500:**
- Verifique se as variáveis de ambiente estão corretas
- Verifique se a tabela purchases existe
- Veja os logs no console do servidor

**Erro 404:**
- Email não está cadastrado na tabela
- Use o mesmo email da compra
- Verifique se a compra foi aprovada

**Erro 403:**
- Acesso expirado
- Entre em contato para renovar
