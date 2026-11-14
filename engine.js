import {NASA_BODIES,nasaOrbit,solarFluxAtAU} from './nasa_physics.js';
import {catalogue,missions,starter} from './data.js';
export {catalogue,missions,starter};
export const CAT=Object.fromEntries(catalogue.map(c=>[c.key,c]));
const G0=9.80665,TANK=.10,INTEGRATION=.15,THRESHOLD=.5,REF=365;
export function evaluate(m,d){
 const lv=CAT[d.launch],bus=CAT[d.bus],prop=CAT[d.propulsion],pwr=CAT[d.power],com=CAT[d.comms],ins=d.instruments.map(k=>CAT[k]);
 const a={violations:[],warnings:[]};
 a.dry_mass=[bus,prop,pwr,com,...ins].reduce((s,c)=>s+c.mass_kg,0);
 const ratio=Math.exp(m.delta_v_ms/(prop.isp_s*G0)),denom=1-TANK*(ratio-1);
 if(denom<=0){a.propellant_mass=Infinity;a.violations.push(`${prop.name} cannot deliver ${m.delta_v_ms.toFixed(0)} m/s: tanks would outweigh the propellant.`)}
 else a.propellant_mass=a.dry_mass*(ratio-1)/denom;
 a.wet_mass=a.dry_mass+a.propellant_mass*(1+TANK);
 a.launch_capacity=lv.capacity_kg[m.destination];a.mass_limit=Math.min(m.max_mass_kg,a.launch_capacity);
 if(a.wet_mass>a.launch_capacity)a.violations.push(`Spacecraft (${Math.round(a.wet_mass).toLocaleString('en-US')} kg) exceeds the ${lv.name}'s capacity to the ${m.destination} (${a.launch_capacity.toLocaleString('en-US')} kg) by ${Math.round(a.wet_mass-a.launch_capacity).toLocaleString('en-US')} kg.`);
 if(a.wet_mass>m.max_mass_kg)a.violations.push(`Spacecraft exceeds the mission mass cap (${m.max_mass_kg.toLocaleString('en-US')} kg) by ${Math.round(a.wet_mass-m.max_mass_kg).toLocaleString('en-US')} kg.`);
 if(ins.length>bus.max_instruments)a.violations.push(`${bus.name} can host ${bus.max_instruments} instruments; ${ins.length} selected.`);
 if(!ins.length)a.warnings.push('No science instruments on board.');
 a.transit_days=m.transit_days+prop.extra_transit_days;a.total_days=a.transit_days+m.ops_days;
 if(a.total_days>m.max_total_days)a.violations.push(`Mission lasts ${a.total_days} days; the limit is ${m.max_total_days} (the ${prop.name.toLowerCase()} transfer adds ${prop.extra_transit_days} days).`);
 a.power_available_ops=pwr.solar?pwr.generation_w*m.solar_flux*(1-m.eclipse_fraction):pwr.generation_w;
 a.power_available_transit=pwr.solar?pwr.generation_w*m.cruise_flux:pwr.generation_w;
 a.power_core_ops=bus.power_w+prop.power_w+com.power_w;
 a.power_instruments=ins.reduce((s,c)=>s+c.power_w,0);
 a.power_need_transit=bus.power_w+com.power_w+prop.power_w+prop.transit_power_w;
 a.instrument_duty=1;
 if(a.power_available_ops<a.power_core_ops){a.violations.push(`${pwr.name} provides ${a.power_available_ops.toFixed(0)} W at the ${m.destination}, but core systems need ${a.power_core_ops.toFixed(0)} W.`);a.instrument_duty=0;}
 else if(a.power_instruments>0){const spare=a.power_available_ops-a.power_core_ops;a.instrument_duty=Math.min(1,spare/a.power_instruments);if(a.instrument_duty<1)a.warnings.push(`Power shortfall: instruments need ${a.power_instruments.toFixed(0)} W but only ${spare.toFixed(0)} W is spare, so they run ${(100*a.instrument_duty).toFixed(0)}% of the time.`)}
 if(a.power_available_transit<a.power_need_transit)a.violations.push(`Cruise power: ${a.power_need_transit.toFixed(0)} W needed, ${a.power_available_transit.toFixed(0)} W available.`);
 a.downlink_mb_day=com.rate_kbps*m.comms_factor*m.contact_hours*3600/8/1000;
 a.data_mb_day=ins.reduce((s,c)=>s+c.data_mb_day,0)*a.instrument_duty;
 a.data_fraction=a.data_mb_day===0?1:Math.min(1,a.downlink_mb_day/a.data_mb_day);
 if(a.data_fraction<1)a.warnings.push(`Downlink bottleneck: instruments generate ${Math.round(a.data_mb_day).toLocaleString('en-US')} MB/day but the ${com.name.toLowerCase()} returns ${Math.round(a.downlink_mb_day).toLocaleString('en-US')} MB/day from the ${m.destination}. Only ${(100*a.data_fraction).toFixed(0)}% of data reaches Earth.`);
 const hardware=[bus,prop,pwr,com,...ins].reduce((s,c)=>s+c.cost_musd,0);
 a.cost_breakdown={'Spacecraft hardware':hardware,'Integration & test':hardware*INTEGRATION,'Launch':lv.cost_musd,'Operations':m.ops_cost_per_day*a.total_days};
 a.total_cost=Object.values(a.cost_breakdown).reduce((s,n)=>s+n,0);
 if(a.total_cost>m.budget_musd)a.violations.push(`Mission costs $${Math.round(a.total_cost).toLocaleString('en-US')}M, $${Math.round(a.total_cost-m.budget_musd).toLocaleString('en-US')}M over the $${m.budget_musd.toLocaleString('en-US')}M budget.`);
 const per=a.instrument_duty*a.data_fraction;
 a.nominal_science=ins.reduce((s,c)=>s+c.science,0)*per;
 a.science_pct=a.nominal_science/m.science_target;
 a.objectives_achievable=m.objectives.filter(o=>per>=THRESHOLD&&ins.some(c=>c.tags.includes(o.tag))).map(o=>o.name);
 a.survival_probability=lv.reliability*bus.reliability**(a.total_days/REF)*pwr.reliability**(a.total_days/REF)*com.reliability**(a.total_days/REF)*prop.reliability**(a.transit_days/REF);
 a.feasible=a.violations.length===0;a.risk_label=a.survival_probability>=.9?'Low':a.survival_probability>=.8?'Medium':'High';
 return a;
}
const margin=(spare,total)=>total<=0?0:Math.max(0,Math.min(1,(spare/total)/.1));
export function scoreMission(m,a,science,completed){
 const ss=Math.min(1,science/m.science_target),costShare=a.total_cost/m.budget_musd;
 const parts={'Science return':ss,'Objective completion':Math.min(1,completed/m.required_objectives),'Cost efficiency':costShare>0?Math.min(1,ss/costShare):0,'Reliability':a.survival_probability,'Resource margins':(margin(a.mass_limit-a.wet_mass,a.mass_limit)+margin(a.power_available_ops-a.power_core_ops-a.power_instruments,a.power_available_ops))/2};
 const weights={'Science return':.35,'Objective completion':.25,'Cost efficiency':.15,'Reliability':.15,'Resource margins':.1};
 return {score:Math.round((100*Object.entries(parts).reduce((s,[k,v])=>s+weights[k]*v,0)+Number.EPSILON)*10)/10,breakdown:Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,Math.round(100*v)]))};
}
// Browser seeded generator: deterministic across browser sessions, not bit-identical to Python's Mersenne Twister.
export function seededRandom(seed){let t=seed>>>0;return ()=>{t+=0x6D2B79F5;let x=t;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return ((x^(x>>>14))>>>0)/4294967296}}
const failureDay=(rel,rng)=>rel>=1?Infinity:Math.max(1,Math.ceil(Math.log(1-rng())/Math.log(rel**(1/REF))));
export function simulate(m,d,rng=Math.random,a=evaluate(m,d)){
 const lv=CAT[d.launch],bus=CAT[d.bus],prop=CAT[d.propulsion],pwr=CAT[d.power],com=CAT[d.comms],ins=d.instruments.map(k=>CAT[k]);
 const events=[],explanations=[];
 const fail=reasons=>({outcome:'FAILURE',science:0,science_pct:0,objectives_completed:[],objectives_missed:m.objectives.map(o=>o.name),events,explanations:reasons,score:0,score_breakdown:{}});
 if(!a.feasible){events.push('Design review: mission NOT approved for launch.');return fail([...a.violations]);}
 if(rng()>lv.reliability){events.push('Day 0: launch vehicle anomaly. Spacecraft lost.');return fail([`The ${lv.name} failed during ascent. Try a more reliable launcher.`]);}
 events.push(`Day 0: ${lv.name} lifts off. Nominal ascent.`);
 const fd=Object.fromEntries([bus,pwr,com,prop,...ins].map(c=>[c.key,failureDay(c.reliability,rng)]));
 const first=arr=>arr.reduce((a,b)=>fd[a.key]<=fd[b.key]?a:b);
 const cruiseFail=first([bus,pwr,com,prop]);
 if(fd[cruiseFail.key]<=a.transit_days){events.push(`Day ${fd[cruiseFail.key]}: ${cruiseFail.name} failure during cruise. Spacecraft lost.`);return fail([`${cruiseFail.name} failed before arrival.`]);}
 events.push(`Day ${a.transit_days}: orbit insertion burn complete. Arrived at the ${m.destination}.`);
 const opsFail=first([bus,pwr,com]);const opsEnd=Math.min(m.ops_days,fd[opsFail.key]-a.transit_days);
 if(opsEnd<m.ops_days){events.push(`Day ${a.transit_days+opsEnd}: ${opsFail.name} failure. Contact lost.`);explanations.push(`${opsFail.name} failed after ${opsEnd} science days.`)}
 let science=0;const fractions={};
 for(const c of ins){const days=Math.min(opsEnd,fd[c.key]);if(days<opsEnd){events.push(`Day ${a.transit_days+days}: ${c.name} failed.`);explanations.push(`${c.name} failed after ${days} science days.`)}const frac=a.instrument_duty*a.data_fraction*days/m.ops_days;fractions[c.key]=frac;science+=c.science*frac;}
 if(opsEnd===m.ops_days)events.push(`Day ${a.total_days}: primary mission complete.`);
 const done=[],missed=[];
 for(const o of m.objectives){const vals=ins.filter(c=>c.tags.includes(o.tag)).map(c=>fractions[c.key]);if(vals.length&&Math.max(...vals)>=THRESHOLD)done.push(o.name);else missed.push(o.name)}
 explanations.unshift(...a.warnings);
 const outcome=done.length>=m.required_objectives?'SUCCESS':done.length?'PARTIAL SUCCESS':'FAILURE';
 if(outcome!=='SUCCESS')explanations.push(`Completed ${done.length} of ${m.required_objectives} required objectives.`);
 const scored=scoreMission(m,a,science,done.length);
 return {outcome,science,science_pct:science/m.science_target,objectives_completed:done,objectives_missed:missed,events,explanations,score:scored.score,score_breakdown:scored.breakdown};
}
export function successRate(m,d,runs=300,seed=0){const rng=seededRandom(seed),a=evaluate(m,d);if(!a.feasible)return 0;let wins=0;for(let i=0;i<runs;i++)if(simulate(m,d,rng,a).outcome==='SUCCESS')wins++;return wins/runs;}
export function optimise(m,limit=6){const keys=cat=>catalogue.filter(c=>c.category===cat).map(c=>c.key),ins=keys('instrument'),results=[];
 // Exact exhaustive search over the original component catalogue, capped to a few thousand feasible designs in memory.
 for(const launch of keys('launch'))for(const bus of keys('bus'))for(const propulsion of keys('propulsion'))for(const power of keys('power'))for(const comms of keys('comms')){
 for(let mask=1;mask<(1<<ins.length);mask++){
 const instruments=ins.filter((_,i)=>mask&(1<<i));if(instruments.length>CAT[bus].max_instruments)continue;
 const d={launch,bus,propulsion,power,comms,instruments},a=evaluate(m,d);
 if(a.feasible&&a.objectives_achievable.length>=m.required_objectives)results.push({design:d,assessment:a});
 }}
 results.sort((x,y)=>y.assessment.nominal_science-x.assessment.nominal_science||x.assessment.total_cost-y.assessment.total_cost);
 return results.slice(0,limit);
}
