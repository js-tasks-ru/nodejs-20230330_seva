const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const arr = []

router.get('/subscribe', async (ctx, next) => {
    const res = await new Promise((res, rej) => {
        arr.push(res)
    })

    ctx.body = res
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message

    if (!message) {
        return
    }

    arr.forEach((it) => {
        it(message)
    })
    arr = []

     ctx.res.statusCode = 201;
});

app.use(router.routes());

module.exports = app;
