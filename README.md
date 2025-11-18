# Pixel Build - Личный кабинет (Frontend)

Frontend приложение на Nuxt 3 с FSD архитектурой.

## Технологии

- Nuxt 3
- TypeScript
- Pinia
- TailwindCSS
- VueUse
- Axios

## Установка

```bash
pnpm install
```

## Разработка

```bash
pnpm dev
```

## Сборка

```bash
pnpm build
```

## Docker

### Разработка

```bash
# Сборка образа
docker build -t pixel-build-frontend .

# Запуск контейнера
docker run -p 3001:3001 --env-file .env pixel-build-frontend
```

### С Docker Compose

```bash
docker-compose up -d
```

## Структура проекта

Проект использует Feature-Sliced Design (FSD) архитектуру:

- `app/` - конфигурация приложения, layouts, providers
- `pages/` - страницы приложения
- `widgets/` - сложные UI компоненты
- `features/` - бизнес-логика (auth, orders, etc.)
- `entities/` - бизнес-сущности (user, order, etc.)
- `shared/` - переиспользуемые компоненты и утилиты
