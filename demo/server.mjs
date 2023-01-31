import polka from 'polka'
import chalk from 'chalk'
import sirv from 'sirv'
import fs from 'fs/promises'
import path from 'path'

export default function serve(options) {
    console.log(options)
    const app = polka()
        .use(sirv(options.serverOutputDir))
        .get("/", async (req, res) => {
            const module = await import(`file://${options.serverOutput}`)
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
    <link rel="stylesheet" href="/public/style.css">
    <meta name="referrer" content="no-referrer" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
            <script>
            window.__state = ${JSON.stringify(state)}
            </script>
            <script type="module" src="/public/client.mjs"></script></script><body>${html}</body>
</html>`
            res.end(str)
        }).get('/data', async (req, res) => {
            const json = await fs.readFile(path.join(options.serverOutputDir, 'public/data.json'))
            res.end(json)
        })
        .listen(1234, (err) => {
            if (err) throw err
            console.log(chalk.green(`serve on localhost:1234`))
        })
    return app.server
}
