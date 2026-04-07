# 🎯 Kairos - Sistema de Gestão de Eventos

Sistema completo **SaaS** para controle de eventos, participantes e pagamentos parcelados com controle dinâmico de lotes.

## 🚀 Features

### ✨ Principais Funcionalidades

- **📅 Gestão de Eventos**: Criar e gerenciar eventos com datas e detalhes
- **👥 Controle de Participantes**: Cadastro completo com email e telefone
- **💰 Pagamentos Parcelados**: Sistema flexível de parcelas com datas de vencimento
- **📊 Lotes Dinâmicos**: Preços variáveis por data automaticamente
- **⚠️ Controle de Inadimplência**: Status automático (pago, pendente, atrasado, inadimplente)
- **📈 Relatórios e Gráficos**: Visualizar receita, inadimplência e status
- **📄 Comprovantes em PDF**: Gerar recibos de pagamento
- **🔔 Lembretes**: Preparado para envio de notificações

### 🎨 Interface

- **Dark Mode**: Interface moderna em tema escuro
- **Responsiva**: Funciona perfeitamente em mobile e desktop
- **Dashboard Intuitivo**: Visão completa dos seus eventos
- **Componentes UI Premium**: Construída com shadcn/ui

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Prisma ORM + SQLite (ou PostgreSQL)
- **Validação**: Zod
- **Charts**: Recharts
- **PDF**: jsPDF
- **Notificações**: Sonner
- **Autenticação**: NextAuth.js (preparado)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup

1. **Clone e instale dependências**
```bash
npm install
```

2. **Configure o banco de dados**
```bash
# O banco SQLite será criado automaticamente
npx prisma migrate dev
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Pages e layouts
│   ├── dashboard/         # Página principal
│   ├── events/           # Gestão de eventos
│   ├── participants/     # Gestão de participantes
│   ├── payments/         # Gestão de pagamentos
│   └── api/              # API routes
├── components/
│   ├── dashboard/        # Componentes de dashboard
│   ├── layout/          # Layout sidebar e header
│   └── ui/              # Componentes shadcn
├── lib/
│   ├── prisma.ts        # Cliente Prisma
│   ├── auth.ts          # Autenticação
│   ├── payment-utils.ts # Lógica de pagamentos
│   ├── lot-utils.ts     # Lógica de lotes
│   ├── validators.ts    # Schemas Zod
│   └── pdf-generator.ts # Geração de PDF
├── actions/             # Server Actions
│   ├── events.ts
│   ├── lots.ts
│   ├── participants.ts
│   └── payments.ts
├── types/               # Type definitions
└── prisma/
    └── schema.prisma    # Database schema
```

## 💾 Banco de Dados

### Models Principais

**User**: Usuários do sistema (admin/organizador)
- Autenticação com email/senha
- Roles de permissão

**Event**: Eventos
- Nome e data
- Associado a um usuário

**Lot**: Lotes de preço
- Preço variável
- Data início/fim
- Automaticamente detecta lote ativo

**Participant**: Participante do evento
- Dados pessoais
- Preço travado (agreedPrice)
- Status de pagamento

**Installment**: Parcelas individuais
- Número, valor, data vencimento
- Status (pago, pendente, atrasado)

**Payment**: Registro de pagamentos
- Método (PIX, cartão, dinheiro)
- Data de pagamento
- Associado à parcela

## 📊 Fluxo Principal

1. **Criar Evento** → Define nome e data
2. **Criar Lotes** → Defina preços e datas (ex: Lote 1: até dia 10)
3. **Adicionar Participantes** → Sistema automaticamente:
   - Detecta o lote ativo
   - Trava o preço (agreedPrice)
   - Cria parcelas automaticamente
4. **Registrar Pagamentos** → Cada parcela paga atualiza status
5. **Monitorar** → Dashboard mostra inadimplência e receita

## 🔑 Funcionalidades Técnicas

### Lotes Dinâmicos

```typescript
// Automaticamente detecta lote baseado na data atual
const currentLot = await getCurrentLot(eventId);
// Se dentro do intervalo, esse é o preço do novo participante
```

### Status Automático

- ✅ **PAID**: Todas as parcelas pagas
- ⏳ **PENDING**: Aguardando pagamento
- ⚠️ **LATE**: Algumas parcelas vencidas
- 🔴 **DEFAULTING**: >50% das parcelas em atraso

### Parcelas Automáticas

```typescript
// Gera parcelas automaticamente ao adicionar participante
createInstallments(participantId, totalAmount, installmentCount);
// Ex: R$ 1200 em 12 parcelas = R$ 100/mês
```

## 🔌 APIs e Server Actions

### Events
- `createEvent(name, eventDate)` → Cria novo evento
- `getEvents(userId)` → Lista eventos do usuário
- `getEventById(id)` → Detalhes completo do evento
- `deleteEvent(id)` → Remove evento

### Participants
- `createParticipant(data)` → Adiciona participante
- `getEventParticipants(eventId)` → Lista de participantes
- `getParticipantById(id)` → Detalhes do participante
- `deleteParticipant(id)` → Remove participante

### Payments
- `createPayment(data)` → Registra pagamento
- `getPayments(participantId)` → Histórico de pagamentos
- `getPaymentsByEvent(eventId)` → Pagamentos do evento

## 📈 Extensões Futuras

- [ ] WhatsApp/Email Reminders automatizados
- [ ] PostgreSQL integration
- [ ] Relatórios avançados (Excel, CSV)
- [ ] Busca e filtros avançados
- [ ] Multi-tenancy real
- [ ] Webhooks para integrações
- [ ] Mobile app (React Native)

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel
```

### Docker

```bash
docker build -t kairos .
docker run -p 3000:3000 kairos
```

## 📝 Variáveis de Ambiente

`.env.local`:
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e PRs.

## 📄 Licença

MIT

## 📞 Suporte

Para suporte, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Next.js, Prisma e shadcn/ui**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
