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
GOOGLE_SERVICE_ACCOUNT_EMAIL="kairos@trusty-shine-281313.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7oDoCPLQyg+jN\nls59Ac/dzu2wHsfRKyXcV0lKUXbW1wPXPj6DtYouuCBuHKC2RMzPK3tTcL7OUdUH\n6yWjHLFJ3rYIwe3jUJmBQiLQuSXVsDLX221wlZEDjcBlSK4/3NeeaXFF0GEedjum\n2/jGmJE8k2wKyTJs2S1cNAlioRSZFGV2QDOUXz2RGZMDVzysYqCVdNzqcQSMHqoW\n4L6BAsDFXP7QAMN+2LKLv1HLclq6HUF/wWxUygFnM2cMRuNBg2UBcwC0wuL+JpwQ\neQ+iDg6/hsiHJpSQc3fnzI+8diu7AzkMj4G2nHhzqTF51qk+BBBRV7Qy6qyK7XMn\nMMSZxvaLAgMBAAECggEADnzaTdbrISVvYgSdkCiGKP3z+4/85OlchI2W4q60qvUy\nXjn3sMrhTyc3ldkPDdP1LqAQZ0qC6UKHXROqtdQe2nHgg3+aA13zZHg7YPuS8NOo\nsWNHqZRa/LfC3e9FSTgfzCMfNIFZJnWBuKoupQMd39wQUSrlAmOorYB1IxEGGqXG\n9LFYTxFsYwZUvdNIsLMouL1KOqU7c7TaieS8jUQ5VkYQV+8fjwIbSZlptCdpg/KG\nYJWp9kFzpwgI11jKf9D/744jRGcdzd82XLkTj/YCqbd6zUMyQVfpWgY2OoArUTyC\n3fQA73Sj52RO/iW4t4hBBUD++6nabqbv3TbcNaJyoQKBgQD2ptC29ARC+pDJraz1\n6faiLwDrDqDMROdgvvxk5uqEoR/D6/ZTwUpDs6a6YDa25+nOZ/F1siaUEFvHXKmB\n/+uA+zA2Jj84AYFE5CytO4gIv9FrVMgACZjR7EWaxY0IUgEGVAZqCnCj1DSQdsUe\nQey8/4rTcfnw9DDebJfxp7LHIQKBgQDCvLPoJ8R09naWLq+WXD3v/OAabvM/PLQZ\nhngyJKqOHo2VPais/uhWhrceW9K2SvPEr4xzl2mIrs4epG2bgLOmlSr/pYmm8MHC\nUksBCs3ToIugy5Mw0OgE3QT72+bleFhrge60MYrXer5KbtxH3feuGV5hy5juwhja\nOp+hxkMEKwKBgQCXQNLK7rbSUA+L7ZocL35UFJjujEjlGvf8pwHl6ok0Dg6JueCT\nmfutqrR6pFfJMEx7i9hRgY8QyztM9TDpjIPh06fL/QZVlO6tzXLsRI52NxL4S8Rd\n6YSybr58W9rRmGASfmJ0krRictZNJNhaZrkDaX27jrBkJ4r0SwmeYmVKoQKBgCPz\neHc8mD1Lnvr85Xep0dlzYuAeaZPcHhe0Ro5jTIVuSI8r0e8WJEiNGFNnelAjKDvA\nePqCEn6kXvMzQfT6XrA7S7PkmLQUMIEydhxcJUGTmxN1YdgaSStUrm3c3BSzEgfO\n9gWYO9yqEWVmcA5ogShIEK+XScWSWco4Fm5kTsz/AoGBAKAqzfd7uS4ff8r9iA4U\n9A+vRakDR5dWtI1zkaDT+QaLPWT5yTt0JIxixHvcoQiMKwZHtsrHMiyqw/JS6CPW\n0aplPSvCZavlQdtu+TasWmOJg/chq0tNwr2UN/Zv0DCeiFG3BirnmU/K/hf5GgIj\n3Iw4Xc/dLBQm9et8ickciric\n-----END PRIVATE KEY-----\n"
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
