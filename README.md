# WebService REST — Gestão de Eventos

API REST em NestJS com TypeORM e SQLite. Quatro entidades: **Local**, **Organizador**, **Evento** e **Inscrição**.

## Requisitos

- Node.js 18+
- npm

## Instalação e execução

```bash
npm install
npm run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/api

O arquivo `database.sqlite` é criado automaticamente na raiz do projeto.

## Recursos REST

| Recurso       | Endpoint          |
|---------------|-------------------|
| Locais        | `/locais`         |
| Organizadores | `/organizadores`  |
| Eventos       | `/eventos`        |
| Inscrições    | `/inscricoes`     |

Cada recurso suporta: `GET` (lista), `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id`.

## Fluxo de teste no Swagger

Ordem recomendada (dependências entre entidades):

1. **POST /locais** — criar um local  
   ```json
   { "nome": "Auditório Central", "endereco": "Rua A, 100", "capacidade": 200 }
   ```

2. **POST /organizadores** — criar um organizador  
   ```json
   { "nome": "Maria Silva", "email": "maria@email.com", "telefone": "11999999999" }
   ```

3. **POST /eventos** — usar os IDs retornados (`localId`, `organizadorId`)  
   ```json
   {
     "titulo": "Workshop NestJS",
     "descricao": "Introdução REST",
     "dataInicio": "2026-06-15T14:00:00.000Z",
     "localId": 1,
     "organizadorId": 1
   }
   ```

4. **POST /inscricoes** — usar o `eventoId`  
   ```json
   { "nomeParticipante": "João Souza", "email": "joao@email.com", "eventoId": 1 }
   ```

5. **GET /eventos** e **GET /inscricoes** — conferir os dados persistidos.

Referências inválidas (ex.: `localId` inexistente) retornam **404**.

## Scripts

```bash
npm run build        # compilar
npm run start:prod   # produção (após build)
npm run test         # testes unitários
npm run test:e2e     # testes e2e
```

## Estrutura

```
src/
├── local/
├── organizador/
├── evento/
├── inscricao/
├── app.module.ts
└── main.ts
```
