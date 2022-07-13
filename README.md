# Koa Body Parser
A class for creating Koa middlewares that parse certain types of request bodies.

## Installation
Install the package with NPM:

```
npm install @donutteam/koa-body-parser
```

## Usage
To use this class, simply instantiate an instance and add it to your Koa stack:

```js
import Koa from "koa";

import { BodyParserMiddleware } from "@donutteam/koa-body-parser";

const app = new Koa();

const bodyParserMiddleware = new BodyParserMiddleware();

// Be sure to add the execute function on the instance
// and NOT the instance itself
app.use(bodyParserMiddleware.execute);
```

## License
[MIT](https://github.com/donutteam/koa-body-parser/blob/main/LICENSE.md)