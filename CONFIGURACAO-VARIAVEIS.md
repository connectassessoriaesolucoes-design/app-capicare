# 🔧 Configuração de Variáveis de Ambiente

## ❌ PROBLEMA IDENTIFICADO

Você está recebendo o erro **"Configuração do servidor incorreta"** porque as variáveis de ambiente não estão configuradas na plataforma de hospedagem.

O app funciona no **preview local** mas não funciona em **navegador anônimo** ou na **versão publicada** porque:
- ✅ Preview local usa o arquivo `.env.local` (funciona)
- ❌ Versão publicada não tem as variáveis configuradas (falha)

---

## ✅ SOLUÇÃO

Você precisa configurar **3 variáveis de ambiente** na plataforma onde o app está hospedado.

### **Variáveis Necessárias:**

```
NEXT_PUBLIC_SUPABASE_URL=https://tteyegcuwijabzypuxet.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZXllZ2N1d2lqYWJ6eXB1eGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzIxNTIsImV4cCI6MjA4MTgwODE1Mn0.zxtVwweIXpGf_aoi1poOleRCe3Q0UHxy2vCg1UU7c3I

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZXllZ2N1d2lqYWJ6eXB1eGV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIzMjE1MiwiZXhwIjoyMDgxODA4MTUyfQ.v_jluELm8Wqr8Gw7EMo4j_XV9Gsxf7gri2Vy1YC8oWg
```

---

## 📝 COMO CONFIGURAR (PASSO A PASSO)

### **Se você está usando VERCEL:**

1. **Acesse o Dashboard da Vercel**
   - Vá em: https://vercel.com/dashboard
   - Clique no seu projeto

2. **Acesse as configurações**
   - Clique em **Settings** (no topo)
   - No menu lateral, clique em **Environment Variables**

3. **Adicione cada variável:**
   - Clique em **Add New**
   - Cole o **nome** da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - Cole o **valor** da variável
   - Selecione: **Production**, **Preview**, **Development** (todas)
   - Clique em **Save**
   - Repita para as 3 variáveis

4. **Faça um novo deploy**
   - Vá na aba **Deployments**
   - No último deployment, clique nos 3 pontinhos
   - Clique em **Redeploy**
   - Marque a opção **Use existing Build Cache** (se disponível)
   - Clique em **Redeploy**

5. **Aguarde o deploy finalizar**
   - Aguarde 1-2 minutos
   - Teste o login novamente

---

### **Se você está usando NETLIFY:**

1. **Acesse o Dashboard da Netlify**
   - Vá em: https://app.netlify.com
   - Clique no seu site

2. **Acesse as configurações**
   - Clique em **Site settings**
   - No menu lateral, clique em **Environment variables**

3. **Adicione cada variável:**
   - Clique em **Add a variable** → **Add a single variable**
   - Cole o **Key** (nome da variável)
   - Cole o **Value** (valor da variável)
   - Clique em **Create variable**
   - Repita para as 3 variáveis

4. **Faça um novo deploy**
   - Vá em **Deploys**
   - Clique em **Trigger deploy** → **Clear cache and deploy site**

5. **Aguarde o deploy finalizar**
   - Aguarde 1-2 minutos
   - Teste o login novamente

---

### **Se você está usando RAILWAY:**

1. **Acesse o Dashboard da Railway**
   - Vá em: https://railway.app
   - Clique no seu projeto

2. **Acesse as variáveis**
   - Clique no serviço do seu app
   - Clique na aba **Variables**

3. **Adicione cada variável:**
   - Clique em **New Variable**
   - Cole o nome e valor da variável
   - Repita para as 3 variáveis

4. **Deploy automático**
   - O Railway faz deploy automaticamente após adicionar variáveis
   - Aguarde 1-2 minutos
   - Teste o login novamente

---

### **Se você está usando RENDER:**

1. **Acesse o Dashboard da Render**
   - Vá em: https://dashboard.render.com
   - Clique no seu web service

2. **Acesse as variáveis**
   - No menu lateral, clique em **Environment**

3. **Adicione cada variável:**
   - Clique em **Add Environment Variable**
   - Cole o **Key** e **Value**
   - Repita para as 3 variáveis

4. **Salve e aguarde**
   - Clique em **Save Changes**
   - O Render faz deploy automaticamente
   - Aguarde 1-2 minutos
   - Teste o login novamente

---

## 🧪 COMO TESTAR SE FUNCIONOU

Após configurar as variáveis e fazer o novo deploy:

1. **Abra o navegador anônimo/privado**
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P
   - Safari: Cmd+Shift+N

2. **Acesse seu app publicado**
   - Use a URL da plataforma (ex: `https://seu-app.vercel.app`)

3. **Tente fazer login**
   - Use um dos emails cadastrados no Supabase
   - Digite qualquer nome
   - Clique em "Acessar Quiz"

4. **Se der certo:**
   - ✅ Você vai acessar o conteúdo do quiz
   - ✅ O sistema está funcionando corretamente

5. **Se ainda der erro:**
   - ❌ Verifique se as variáveis estão escritas EXATAMENTE como mostrado acima
   - ❌ Certifique-se que fez um novo deploy após adicionar as variáveis
   - ❌ Aguarde 2-3 minutos e tente novamente (cache do CDN)

---

## 📧 EMAILS JÁ CADASTRADOS NO SUPABASE

Para testar, use um dos emails que você já cadastrou no Supabase. Para ver a lista:

1. Vá no **Supabase Dashboard**
2. Clique em **Table Editor**
3. Selecione a tabela **purchases**
4. Veja a coluna **email**

Ou acesse este endpoint (substitua pela sua URL):
```
https://seu-app.vercel.app/api/debug-users
```

---

## ⚠️ IMPORTANTE

- **NÃO** commit o arquivo `.env.local` no Git (ele já está no `.gitignore`)
- **NÃO** exponha as variáveis em repositórios públicos
- **SEMPRE** configure as variáveis na plataforma de hospedagem
- **SEMPRE** faça um novo deploy após adicionar/alterar variáveis

---

## ❓ DÚVIDAS COMUNS

**P: Por que funciona no preview mas não na versão publicada?**
R: O preview roda no seu ambiente local com o `.env.local`, mas a versão publicada precisa das variáveis configuradas na plataforma.

**P: Preciso fazer deploy toda vez que altero as variáveis?**
R: Sim! As variáveis são injetadas durante o build, então você precisa fazer um novo deploy.

**P: As variáveis com NEXT_PUBLIC_ são seguras?**
R: As com prefixo `NEXT_PUBLIC_` são expostas no frontend (navegador), por isso são seguras para URLs e chaves públicas. A `SUPABASE_SERVICE_ROLE_KEY` NÃO tem esse prefixo e fica apenas no backend.

**P: Posso usar outras variáveis de ambiente?**
R: Sim! Mas no Next.js, só variáveis com prefixo `NEXT_PUBLIC_` ficam disponíveis no frontend. Variáveis sem prefixo só funcionam em APIs (pasta `/api`).

---

## 🆘 PRECISA DE AJUDA?

Se ainda não funcionar após seguir todos os passos:

1. Abra o console do navegador (F12)
2. Vá na aba **Network**
3. Tente fazer login novamente
4. Clique na requisição `/api/verify-access`
5. Copie a resposta do servidor
6. Me envie para eu analisar

---

✅ Agora é só configurar as variáveis na sua plataforma e fazer um novo deploy!
