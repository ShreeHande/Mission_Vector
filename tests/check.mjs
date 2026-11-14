import {catalogue,missions,starter,evaluate,simulate,seededRandom,scoreMission} from '../engine.js';
import fs from 'node:fs';
const vectors=JSON.parse(fs.readFileSync(new URL('./vectors.json',import.meta.url)));
let checks=0;
function approx(actual,expected,label){if(!Number.isFinite(actual)&&!Number.isFinite(expected))return;if(Math.abs(actual-expected)>1e-8*Math.max(1,Math.abs(expected)))throw Error(`${label}: ${actual} != ${expected}`);checks++}
for(const v of vectors){const a=evaluate(missions[v.mission],v.design);for(const [k,n] of Object.entries(v.numbers))approx(a[k],n,`${v.name}.${k}`);if(a.feasible!==v.feasible)throw Error('feasibility mismatch '+v.name);checks++;if(a.objectives_achievable.length!==v.objectives)throw Error('objectives mismatch '+v.name);checks++;const r=simulate(missions[v.mission],v.design,seededRandom(11));if(!['SUCCESS','PARTIAL SUCCESS','FAILURE'].includes(r.outcome))throw Error('invalid outcome');checks++;}
console.log(`PASS: ${checks} static parity / structural flight checks across ${vectors.length} designs.`);
