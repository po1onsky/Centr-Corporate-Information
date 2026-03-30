# TrustProof Landing Page

Одностраничный сайт для сервиса заверения цифровых данных.

## Быстрый запуск локально

```bash
python3 -m http.server 4173
```

Откройте: `http://localhost:4173`

---

## Публикация в интернет (GitHub Pages)

Этот репозиторий уже подготовлен для автодеплоя через GitHub Actions.

### 1) Запушьте репозиторий на GitHub

```bash
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin <your-branch>
```

### 2) Включите GitHub Pages

1. Откройте `Settings` → `Pages`.
2. В `Build and deployment` выберите **GitHub Actions**.

### 3) Смёржьте изменения в default branch

После merge в `main` workflow автоматически опубликует сайт.

### 4) Получите URL

GitHub Pages выдаст адрес вида:

`https://<your-org>.github.io/<your-repo>/`

---

## Альтернатива: Netlify (2 минуты)

1. Зайдите в [https://app.netlify.com](https://app.netlify.com).
2. `Add new site` → `Import an existing project`.
3. Подключите этот репозиторий.
4. Build command: *(пусто)*, Publish directory: `.`

`netlify.toml` уже добавлен в проект.

---

## Альтернатива: Vercel

1. Зайдите в [https://vercel.com/new](https://vercel.com/new).
2. Импортируйте репозиторий.
3. Framework preset: `Other`.
4. Build command: *(пусто)*, Output directory: `.`

`vercel.json` уже добавлен.
