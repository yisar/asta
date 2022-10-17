import polka from 'polka'
import chalk from 'chalk'
import sirv from 'sirv'

function serve(options) {
    const app = polka()
        .use(sirv(options.o))
        .get("/", async (req, res) => {
            const module = await import('../src/app.mjs')
            const state = await module.loader(req)
            const html = module.default(state)
            const str = `
            
          
          <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Asta</title>
    <link rel="icon" href="data:" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

            <script>
            window.__state = ${JSON.stringify(state)}
            </script>
          <script type="module" src="./asta.js"></script></script><body>${html}</body>
</html>`
            res.end(str)
        })
        .listen(1234, (err) => {
            if (err) throw err
            console.log(chalk.green(`serve on localhost:1234`))
        })
    return app.server
}
serve({ o: './src' })