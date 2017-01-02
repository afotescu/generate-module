const toUpper = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const data = {};

data.controller = (moduleName) => {
    const name = toUpper(moduleName);
    return `import model from './model';

class ${name}Ctrl {
    constructor() {
    }
}

export default ${name}Ctrl;
`
};

data.model = (moduleName) => {
    const name = toUpper(moduleName);
    return `import model from './model';

class ${name}Ctrl {
    constructor() {
    }
}

export default ${name}Ctrl;
`
};

data.routes = (moduleName) => {
  return `import Router from 'koa-router';
import controller from './controller';

const router = new Router();
const url = '/${moduleName}';

export default router;
`;
};



module.exports = data;