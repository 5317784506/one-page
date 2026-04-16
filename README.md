# Vite starter for test task

Минимальная стартовая сборка для тестового задания по верстке.

## Команды

```bash
npm run dev
npm run build
npm run preview
```

Если стандартный `npm` в PowerShell упрется в ограничение окружения, можно вызывать CLI напрямую:

```powershell
$env:HOME='d:\job-projects\page'
$env:USERPROFILE='d:\job-projects\page'
& 'C:\Program Files\nodejs\node.exe' 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run dev
```

## Структура

- `index.html` — основная HTML-точка входа
- `src/main.js` — главный JS-модуль
- `src/styles/main.scss` — главные стили
- `dist/` — собранная production-версия

## Установленные зависимости

- `vite`
- `sass`


## Дома
git clone https://github.com/5317784506/one-page.git
cd one-page
npm install
npm run dev
