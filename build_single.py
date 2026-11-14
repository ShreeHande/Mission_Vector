from pathlib import Path
p=Path(__file__).parent
css=(p/'style.css').read_text().replace('</style>','<\\/style>')
data=(p/'data.js').read_text().replace('export const ','const ')
nasa=(p/'nasa_physics.js').read_text().replace('export const ','const ').replace('export function ','function ')
engine=(p/'engine.js').read_text().replace("import {NASA_BODIES,nasaOrbit,solarFluxAtAU} from './nasa_physics.js';",'').replace("import {catalogue,missions,starter} from './data.js';",'').replace('export {catalogue,missions,starter};','').replace('export const ','const ').replace('export function ','function ')
audio=(p/'audio.js').read_text()
app=(p/'app.js').read_text().replace("import {catalogue,missions,starter,CAT,evaluate,simulate,seededRandom,successRate,optimise} from './engine.js';",'').replace("import {NASA_BODIES,nasaOrbit,solarFluxAtAU} from './nasa_physics.js';",'')
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MISSION: VECTOR</title><style>'+css+'</style></head><body><div id="app"></div><script type="module">\n'+data+'\n'+nasa+'\n'+engine+'\n'+app.replace('</script>','<\\/script>') +'\n</script><script>'+audio.replace('</script>','<\\/script>')+'</script></body></html>'
(p/'START_GAME.html').write_text(html)
