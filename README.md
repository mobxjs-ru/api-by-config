# api-by-config

## Установка

- Node.js (>= 16, 18 preferred)
- PNPM 8

```
1. pnpm run first-run
2. Configure .env
- HTTPS_BY_NODE=true means run on https://localhost (443 port) (preferred)
- HTTPS_BY_NODE=false and EXPRESS_PORT=80 means run on http://localhost:80
3. pnpm run build
```

## Локальная работа

Для удобства можно подключить в IDE автоматическое форматирование файлов через ESLint при сохранении, конфиг
должен подтянуться автоматически. Обновление зависимостей через `pnpm run upd`.

## Идея проекта

В этом репозитории я привел пример, как можно организовать API при помощи декларативных конфигов.

1. В папке src/api описываем модели запроса/ответа/предсказуемых ошибок, хедеры, путь запроса (в данном случае абсолютный
для простоты)

```typescript
type TypeRequest = {
  someParam: string;
};

type TypeResponse = {
  data: string;
};

type TypeError = {};

export const endpointName: TypeApiRoute & {
  error: TypeError;
  request: TypeRequest;
  response: TypeResponse;
} = {
  url: `https://mocki.io/v1/fb5caba1-8090-4c8b-9c79-b71f139b9821`,
  method: 'GET',
  error: {} as TypeError,
  request: {} as TypeRequest,
  response: {} as TypeResponse,
};
```

2. Собираем эти конфиги в объект типа `{ endpointName: endpointName }`
3. Преобразуем этот объект в функции

```typescript
{ 
  endpointName: (requestParams: TypeRequest): Promise<TypeResponse> => {
      return fetch(apiConfig.url, {
        method: apiConfig.method,
        headers: apiConfig.headers,
        body: JSON.stringify(requestParams),
      })
      .then((response) => response.json());
  };
}
```

4. Добавляем к этим функциям observable state

```typescript
obj.endpointName.state = observable({
  timeStart: 0,
  isExecuting: false,
  executionTime: 0,
  error: null,
  mock: null,
})
```

5. Теперь можно вызывать эти функции в любой части приложения и подписываться на изменения стейта. Для интеграции с Реактом
я в коде привел пример как пробросить через контекст.

```typescript
class MyComponent extends React.Component {
  handleGetData = () => {
    const { api } = this.context;

    // параметры запроса и параметры ответа типизированы
    void api.endpointName({ someParam: '' }).then((response) => {
      // можно записать в стор, например
      console.log(response.data);
    });
  };
}
```

Для старта работы с репо можно открыть src/client.tsx, дальше быстрыми переходами на нужные места.

## Преимущества

- Работа с апи не привязана ни к какому фреймворку - можно вызывать как внутри Реакта, так и вне или без него
- Так как модели запроса/ответа описаны в TS, то можно генерировать реалтаймовые валидаторы
- Полная типизация запроса/ответа
- Не нужно вручную хендлить параметр isExecuting - он уже есть в каждой функции запроса и реактивный, то есть
можно подписаться на него в компонентах и показывать лоадеры, когда нужно
- Легко логировать, какие запросы были вызваны и какое время заняли через autorun
- Подход отлично подходит для автофайлогенерации. В репозитории настроен автоматический сбор всех api-конфигов из 
папки src/api, то есть при добавлении/удалении файлов все подцепится автоматически
- Централизованная обработка
- Легко переиспользовать (апи можно вызывать с любой страницы) и нет дубляжа, в отличие от подхода когда запросы
описываются в сторах (видел проекты, где 1 и тот же запрос был описан 5 раз в сторах разных страниц)
- Полная поддержка быстрых переходов в IDE по одному клику
- Легкое тестирование благодаря системе моков - просто прописываем `api.endpointName.state.mock = { ...mock }` и
во всех местах, где этот запрос вызывается он будет замокирован. Соответственно, система идеально подходит для
интеграционных тестов (например, в Cypress), когда нужно полностью исключить общение с сервером

## Фичи, которые реализованы в репозитории

- Описание апи-конфигов с автогенерацией реэкспортного файла
- Оборачивание апи-конфигов в функцию с использованием fetch
- Добавление state к функциям
- Проброс готового апи через контекст
- Примеры с успешным запросом, замоканным запросом, выводом ошибки вручную или через state (src/comp/app/App.tsx)
- Отслеживание выполенных запросов и времени их выполнения через autorun (src/client.tsx)
- Поддержка в запросе пустых аргументов (getData) или типизированного объекта (getDataWithReqParams)
- Вариант отдельной типизации параметров запроса/ответа для определенной функции
(пример `const requestParams: TypeApiRequest<'getDataWithReqParams'> = { email: '' };`)

## Нереализованные фичи

В реальном проекте нужно еще:

- Разделение ошибок на сетевые и бизнесовые с соответствующей обработкой (сейчас в проекте есть только тип TypeApiError без
примеров использования)
- Механизм перезапросов при сетевых ошибках
- Кеширование/инвалидация (обычно этим занимается HTTP, но можно сделать механизм и кодом)
- Решение гонки запросов (при вызове апи-запроса дожидаться пока завершатся его предыдущие вызовы)
- Abort запросов
- Реалтаймовая валидация параметров запроса/ответа (сейчас в проекте есть генерация валидаторов, но они не подцеплены для
упрощения кодовой базы)
- Очистка респонса от параметров, которые не описаны в конфиге, и их логирование
- Асинхронная загрузка конкретных апи-вызовов для уменьшения размера бандла
- Просмотр всех вызванных запросов в реалтайме в виде стека (сейчас в коде только базовый вывод в консоль)
- Механизм для SSR, когда сервер будет дожидаться пока все запросы завершатся, и только потом рендерить финальный HTML

Так как я в этом репо показал только концепт подхода, то эти фичи я убрал (по факту я просто максимально упростил систему,
которую использую в продовых проектах), но добавить их не особо сложно.
