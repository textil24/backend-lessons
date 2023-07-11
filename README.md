# Rick and Morty GraphQL API

Этот репозиторий содержит исходный код для Rick and Morty GraphQL API. Он предоставляет GraphQL-интерфейс для доступа к данным, связанным с телесериалом "Рик и Морти".

## Предварительные требования

Перед запуском проекта убедитесь, что у вас установлены следующие компоненты:

- Node.js (версия X.X.X)
- npm (версия X.X.X)
- PostgreSQL (версия X.X.X)

## Начало работы

Чтобы начать работу с Rick and Morty GraphQL API, выполните следующие шаги:

1. Клонируйте репозиторий:

```git clone https://github.com/textil24/backend-rickandmorty.git```

2. Установка зависимостей

```npm install```

3. Запуск проекта

```npm run start```

4. Создать свой .env файл в корне проекта

```
POSTGRES_USER=YOUR_USER
POSTGRES_PASSWORD=YOUR_PASSWORD
POSTGRES_DB=YOUR_DB

DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public&sslmode=prefer
```
