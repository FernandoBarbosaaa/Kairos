# Integração Kairos + Google Sheets

## 1. Crie uma Service Account no Google Cloud

1. Abra o Google Cloud Console.
2. Crie ou selecione um projeto.
3. Ative as APIs `Google Sheets API` e `Google Drive API`.
4. Crie uma `Service Account`.
5. Gere uma chave JSON.

## 2. Compartilhe a planilha com a Service Account

Compartilhe a planilha de participantes com o e-mail da Service Account, com permissão de edição.

## 3. Configure as variáveis de ambiente

Obrigatórias:

```bash
DATABASE_URL=postgresql://...
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@projeto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Alternativa:

```bash
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

Opcionais:

```bash
KAIROS_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/1uF0yJNVXfvUwfMBxTyFAjb1sRbw97SRq61XLSpxjXQY/edit
KAIROS_GOOGLE_WORKSHEET_TITLE=Página1
```

## 4. Como funciona

- O front-end chama a rota `POST /api/integrations/google-sheets/export`.
- A rota usa `Prisma` para buscar os participantes no banco.
- A exportação usa `googleapis` diretamente no runtime Node do Next.
- Apenas participantes ainda não presentes na planilha são adicionados.

## 5. Vercel

No Vercel, cadastre essas variáveis em `Project Settings > Environment Variables`.
Não é necessário subir `credentials.json` nem executar Python no deploy.
