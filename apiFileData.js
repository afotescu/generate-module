const toUpper = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const data = {};

data.controller = (moduleName) => {
    const name = toUpper(moduleName);
    return `import Model from './model';
import response from './../../../shared/response';

export default class ${name}Ctrl {
    constructor() {
    }
    
    static async getMany(ctx) {
        const ${moduleName} = new Model(ctx.state.user);
        const data = await ${moduleName}.getMany(ctx.query);
        this.body = response(ctx.method, data.info, data.optional);
    }
    
    static async getOne(ctx) {
        const ${moduleName} = new Model(ctx.state.user);
        const data = await ${moduleName}.getOne(ctx.query);
        this.body = response(ctx.method, data);
    }
    
    static async post(ctx) {
        const ${moduleName} = new Model(ctx.state.user);
        const data = await ${moduleName}.post(ctx.query, ctx.request.body);
        this.body = response(ctx.method, data);
    }
    
    static async put(ctx) {
        const ${moduleName} = new Model(ctx.state.user);
        const data = await ${moduleName}.put(ctx.query, ctx.request.body);
        this.body = response(ctx.method, data);
    }
    
    static async delete(ctx) {
        const ${moduleName} = new Model(ctx.state.user);
        await ${moduleName}.delete(ctx.query);
        this.body = response(ctx.method);
    }
}
`
};

data.model = (moduleName) => {
    const name = toUpper(moduleName);
    return `import path from 'path';
import { sql, qFile, qPath } from './../../../shared/database';

export default class ${name}Ctrl {
    constructor(user) {
        this.user = user;
    }
    
    async getMany(params) {
        const limit = params.limit || 20;
        const offset = params.offset || 0;
        const queryParams = [limit, offset];
        const data = { info: null, optional: { limit, offset }};
        await sql.task(async (task) => {
            const total = await task.one(qFile(qPath(sqlDirPath, 'getTotalCount')));
            data.optional.total = total.count;
            data.info = await task.any(qFile(qPath(sqlDirPath, 'getMany')));
        });
        return data;
    }
    
    async getOne(params) {
        return sql.one(qFile(qPath(sqlDirPath, 'getOne')));
    }
    
    async post(params, body) {
        return sql.one(qFile(qPath(sqlDirPath, 'post')));
    }
    
    async put(params, body) {
        return sql.one(qFile(qPath(sqlDirPath, 'put')));
    }
    
    async delete(params) {
        return sql.none(qFile(qPath(sqlDirPath, 'delete')))
    }
}
`
};

data.routes = (moduleName) => {
    const name = toUpper(moduleName);
    return `import Router from 'koa-router';
import ${name} from './controller';

const router = new Router({
    prefix: '/${moduleName}',
});

router.get('/', ${name}.getAll);
router.post('/', ${name}.post);
router.get('/:id', ${name}.getOne);
router.update('/:id', ${name}.update);
router.del('/:id', ${name}.delete);

export default router;
`;
};



module.exports = data;