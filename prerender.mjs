import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const abs = (p) => path.resolve(__dirname, p)

// 1. Read the template produced by the client build (already has the hashed
//    <script> and the extracted <link rel="stylesheet"> in <head>).
const template = fs.readFileSync(abs('dist/index.html'), 'utf-8')

if (!template.includes('<!--ssg-html-->')) {
  throw new Error('Prerender placeholder <!--ssg-html--> missing from dist/index.html.')
}

// 2. Render the app to markup from the SSR bundle.
const { render } = await import(url.pathToFileURL(abs('dist-server/entry-server.mjs')).href)
const { html } = render()

// 3. Inject the markup into #root.
const out = template.replace('<!--ssg-html-->', html)

fs.writeFileSync(abs('dist/index.html'), out)
console.log('✓ Pre-rendered dist/index.html (%d bytes markup)', html.length)
