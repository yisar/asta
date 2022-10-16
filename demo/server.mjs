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
            <style>
            button{
                background-color: blueviolet;
                color: aliceblue;
                padding: 20px;
                margin: 20px;
                border: 0;
                border-radius: 10px;
            }
            </style>
            <script>
            window.__state = ${JSON.stringify(state)}
            </script>
          <script type="module" src="./asta.js"></script></script><body>${html}</body>`
            res.end(str)
        })
        .listen(1234, (err) => {
            if (err) throw err
            console.log(chalk.green(`serve on localhost:1234`))
        })
    return app.server
}
serve({ o: './src' })