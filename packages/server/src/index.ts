import * as Koa from 'koa'

const app = new Koa()

app.use(ctx => {
  ctx.body = 'Hallo Koa'
})

app.listen(3001)
