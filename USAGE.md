# 🚀 Instruções de Uso - Kairos

## ✅ Pré-requisitos

- Node.js 18+
- npm

## 🎯 Primeiros Passos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
npx prisma migrate dev
```

Este comando irá:
- Criar o banco de dados SQLite em `prisma/dev.db`
- Criar todas as tabelas conforme o schema

### 3. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📊 Fluxo de Funcionamento

### Cenário: Criar um Retiro com Pagamentos Parcelados

#### 1️⃣ Criar Evento
1. Clique em "Novo Evento" no Dashboard
2. Preencha:
   - **Nome**: "Retiro Espiritual 2024"
   - **Data**: 15/06/2024
3. Clique em "Criar Evento"

#### 2️⃣ Criar Lotes (Preços por Data)
1. Vá para a página de Eventos
2. Abra o evento criado
3. Adicione lotes:
   - **Lote 1** - R$ 800 (01/03 - 31/03) - Preço antecipado
   - **Lote 2** - R$ 900 (01/04 - 30/04) - Preço normal
   - **Lote 3** - R$ 1.000 (01/05 - 15/06) - Preço última hora

**⚠️ Importante**: O sistema detecta automaticamente qual lote está ativo baseado na data atual!

#### 3️⃣ Adicionar Participantes
1. Vá para "Participantes"
2. Clique em "Novo Participante"
3. Preencha:
   - **Nome**: "João Silva"
   - **Email**: joao@email.com
   - **Telefone**: (11) 98765-4321
   - **Parcelas**: 12 (irá criar 12 parcelas)
4. Clique em "Adicionar"

**✨ O sistema automaticamente**:
- Detecta o lote ativo (ex: hoje é 05/04 → Lote 2 = R$ 900)
- Trava o preço em R$ 900
- Cria 12 parcelas de R$ 75 cada
- Primeira parcela vence em 05/05

#### 4️⃣ Registrar Pagamentos
1. Clique no ícone de visualização do participante
2. Veja a tabela de parcelas
3. Clique em "Marcar como Pago" na parcela
4. Preencha:
   - **Valor**: R$ 75.00
   - **Método**: PIX / Dinheiro / Cartão
   - **Data**: Automática
5. Clique em "Registrar"

**📊 Status automaticamente atualiza**:
- ✅ Se pagar todas as parcelas → "PAGO"
- ⏳ Se faltar parcelas → "PENDENTE"
- ⚠️ Se vencer data → "ATRASADO"
- 🔴 Se >50% atrasado → "INADIMPLENTE"

#### 5️⃣ Acompanhar no Dashboard
- **Total de Participantes**: 1 (João Silva)
- **Total Arrecadado**: R$ 75.00 (1ª parcela paga)
- **Pendentes**: R$ 825.00 (restante)
- **Atrasados**: Atualiza quando vence

---

## 🔑 Recursos Principais

### Filtros e Busca
- Busque por nome do participante
- Filtre por status (pago, pendente, atrasado)
- Veja rapidamente quem está inadimplente

### Comprovantes em PDF
- Após registrar pagamento, clique em "Gerar Comprovante"
- Recibo com dados completo é baixado

### Gráficos
- Receita mensal: Qual mês arrecadou mais
- Inadimplência: Tendência de atrasos

---

## 🔧 Variáveis de Ambiente

Crie `.env.local` com:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="chave-super-secreta-mude-em-producao"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📦 Build e Deploy

### Build para Produção
```bash
npm run build
npm run start
```

### Deploy no Vercel
```bash
vercel
```

---

## ❓ Dúvidas Frequentes

### **P: Como mudar de SQLite para PostgreSQL?**
A: Edit `prisma/schema.prisma` e mude:
```prisma
datasource db {
  provider = "postgresql"  // mude aqui
  url      = env("DATABASE_URL")
}
```

### **P: Como adicionar autolink/autobusca?**
A: Componentes já estão prontos, é só para integrar com dados reais via queries ao banco.

### **P: Posso adicionar usuários?**
A: Sistema está preparado com autenticação. Configure NextAuth.js para login.

---

## 🐛 Troubleshooting

### Erro: "Database not found"
```bash
npx prisma migrate dev
```

### Erro: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### Erro ao gerar PDF
- Certifique que jsPDF está instalado: `npm install jspdf`

---

## 📚 Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

**Para mais help, abra uma issue no repositório!** 🚀
