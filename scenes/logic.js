export const meta = { game: 'FieldReady', minPlayers: 1, maxPlayers: 1 };
const SCENES = [
 {id:'bedroom',title:'The quiet bedroom',category:'Residential · Foundation',brief:'A property manager has requested a limited-area assessment after an unattended death. The scene has been released. Protect unaffected contents and determine what needs removal or specialist review.',lesson:'Porous materials and hidden migration',objects:[
 ['mattress','Affected mattress',30,48,'Porous filling is affected. In this simulation the approved plan calls for contained removal, not surface-only cleaning. Real waste classification depends on applicable rules.',['photo','remove']],
 ['carpet','Carpet and pad',53,76,'The pad beneath this patch is affected. Surface appearance alone cannot establish that underlying layers are clean. Follow the approved removal scope.',['photo','remove']],
 ['baseboard','Wall-floor junction',75,60,'Discoloration extends behind the trim. The extent is unknown: isolate and refer to the lead rather than concealing it.',['photo','escalate']],
 ['wardrobe','Dry wardrobe',87,40,'Contents lie outside the affected zone. Document and protect them; unnecessary disposal damages the client’s property.',['photo','protect']],
 ['window','Closed window',57,28,'This is not a contaminated item. Preserve the planned boundary; ventilation changes require a site-specific assessment.',['photo','protect']]]},
 {id:'hallway',title:'Keep the corridor clear',category:'Hard surface · Field',brief:'A released corridor connects occupied rooms. Your objective is to address the affected hard surface without spreading contamination to handles, boxes, or the clean route.',lesson:'Clean first, then disinfect',objects:[
 ['tile','Affected tile',45,75,'A nonporous surface with visible soil. The simulation requires cleaning before a separate disinfection step. Real products require their labeled use and wet contact time.',['photo','clean','disinfect']],
 ['junction','Floor junction',25,54,'Residue reaches a joint whose depth is uncertain. Record and escalate the concealed condition instead of assuming a wipe resolves it.',['photo','escalate']],
 ['handle','Contact handle',78,40,'A high-touch surface identified in the approved work area. Clean it, then complete the simulated label-compliance checkpoint.',['photo','clean','disinfect']],
 ['box','Unaffected delivery box',65,64,'The sealed box is outside the affected path. Preserve it and keep it separate from work waste.',['photo','protect']],
 ['container','Unknown container',85,80,'The contents are unknown. Do not open, mix, smell, or apply another chemical. Isolate the location and notify the qualified lead.',['photo','escalate']]]},
 {id:'vehicle',title:'Inside the cabin',category:'Vehicle · Field',brief:'A parked vehicle has been released for assessment. Upholstery, hard surfaces, concealed spaces, and unfamiliar objects require different responses. Do not dismantle safety systems.',lesson:'Material-specific decisions',objects:[
 ['seat','Affected front seat',30,45,'Contamination extends into porous upholstery. The fictional approved plan allows specialist contained removal. In reality, seat wiring and restraints require qualified handling.',['photo','remove']],
 ['mat','Affected floor mat',35,78,'This removable porous item is within the approved removal scope. Keep it separated from the clean route.',['photo','remove']],
 ['console','Hard console surface',53,56,'A compatible nonporous surface in the approved work scope. Cleaning and disinfection are distinct milestones; follow material and product instructions in real work.',['photo','clean','disinfect']],
 ['rear','Unaffected rear bench',76,46,'The rear bench is outside the affected area. Record its condition and protect it rather than disturbing it.',['photo','protect']],
 ['unknown','Footwell obstruction',78,79,'An unidentified sharp-looking object is partly concealed. Do not pick it up by hand or probe blindly. Stop local work, isolate and escalate.',['photo','escalate']]]},
 {id:'clutter',title:'A path through the clutter',category:'Complex property · Lead',brief:'A cluttered unit needs a cautious assessment. Protect possessions, identify access problems, and stop where unknown hazards exceed the approved scope. More removal is not automatically a better result.',lesson:'Access, ownership, and stop-work judgment',objects:[
 ['boxes','Stacked possessions',24,48,'These are client possessions, not automatically waste. Record and protect pending an agreed inventory and sorting plan.',['photo','protect']],
 ['chair','Affected fabric chair',42,57,'The approved simulation scope identifies this porous item for contained removal. Do not generalize that decision to all items in a cluttered home.',['photo','remove']],
 ['floor','Accessible floor strip',57,80,'This accessible nonporous area is in scope. Clean before the simulated disinfection checkpoint. Keep the designated route separate.',['photo','clean','disinfect']],
 ['exit','Obstructed exit',72,38,'A blocked route can compromise safe access and evacuation. Pause work and escalate for an approved access plan; do not destabilize stacks.',['photo','escalate']],
 ['power','Electrical uncertainty',87,72,'Unknown cable and power-strip condition. Do not wet-clean, touch, or energize it. Isolate and refer to a qualified person.',['photo','escalate']]]}
];
const TOOLS=['inspect','photo','protect','remove','clean','disinfect','escalate'];
const POSITIONS={bedroom:[[30,42],[53,76],[74,50],[87,40],[57,15]],hallway:[[60,82],[25,54],[87,23],[70,61],[60,45]],vehicle:[[51,63],[30,80],[43,52],[79,55],[66,81]],clutter:[[18,58],[40,51],[55,81],[66,23],[79,81]]};
function scene(s){return SCENES.find(x=>x.id===s.mission);}
function log(s,text,tone='info'){s.notice={text,tone};s.log=[...s.log,{text,tone,step:s.moves}].slice(-50);return s;}
export function setup(players){return {version:1,players:[...players],mission:null,phase:'dispatch',ready:{release:false,kit:false,boundary:false},objects:{},score:100,moves:0,mistakes:0,log:[],notice:null,records:{}};}
export function validateAction(s,p,a){
 if(!s.players.includes(p))return {ok:false,error:'This is a spectator view. Start your own private room to play.'};
 if(!a||typeof a!=='object')return {ok:false,error:'Choose a valid action.'};
 if(a.type==='select')return SCENES.some(x=>x.id===a.id)?{ok:true}:{ok:false,error:'Choose an available mission.'};
 if(a.type==='dispatch')return {ok:true};
 if(!scene(s)||s.phase==='complete')return {ok:false,error:'Select or replay a mission first.'};
 if(a.type==='prepare')return ['release','kit','boundary'].includes(a.key)?{ok:true}:{ok:false,error:'Choose a listed preparation task.'};
 if(a.type==='tool')return scene(s).objects.some(x=>x[0]===a.target)&&TOOLS.includes(a.tool)?{ok:true}:{ok:false,error:'Select a valid object and tool.'};
 if(a.type==='finish')return {ok:true};
 return {ok:false,error:'Unknown action. Use the scene controls.'};
}
export function applyAction(state,p,a){
 if(!validateAction(state,p,a).ok)return state;
 let s=JSON.parse(JSON.stringify(state));s.moves++;
 if(a.type==='dispatch'){s.phase='dispatch';s.mission=null;return s;}
 if(a.type==='select'){s={...setup(s.players),records:s.records,mission:a.id,phase:'active'};for(const o of scene(s).objects)s.objects[o[0]]={inspected:false,done:[]};return log(s,'Mission opened. Confirm the release, then inspect the scene from the safe assessment position.');}
 const mistake=(text)=>{s.score=Math.max(10,s.score-8);s.mistakes++;return log(s,text,'warning');};
 if(a.type==='prepare'){
  if(s.ready[a.key])return log(s,'Already confirmed. No additional points or progress are awarded.');
  if(a.key==='kit'&&!s.ready.release)return mistake('Confirm scene release and authority before selecting the approved kit.');
  if(a.key==='boundary'&&!s.ready.kit)return mistake('Complete the scenario-specific protection assessment before establishing the work boundary.');
  s.ready[a.key]=true;return log(s,{release:'Release and authority confirmed for this fictional scene. Inspection is now available.',kit:'Scenario-approved protection checked. Real PPE and respiratory protection require a qualified hazard assessment and applicable training.',boundary:'Clean staging area, controlled work boundary and approved waste route established for this simulation.'}[a.key],'success');
 }
 if(a.type==='tool'){
  const o=scene(s).objects.find(x=>x[0]===a.target),v=s.objects[a.target];
  if(!s.ready.release)return mistake('Stop: confirm release and authority before entering the assessment.');
  if(a.tool==='inspect'){v.inspected=true;return log(s,o[4]);}
  if(!v.inspected)return mistake('Inspect the object before choosing a response. Its condition determines the safe next decision.');
  if(a.tool!=='photo'&&(!s.ready.kit||!s.ready.boundary))return mistake('Work cannot proceed: complete the approved protection check and clean/dirty boundary first.');
  if(v.done.includes(a.tool))return log(s,'That step is already recorded. Choose the next task or another object.');
  const next=o[5][v.done.length];
  if(a.tool!==next)return mistake(a.tool==='disinfect'?'Disinfection is not a substitute for cleaning. Check the material, documentation and required sequence.':'That response is not appropriate at this stage. Review the inspection finding and the object’s next action.');
  v.done.push(a.tool);
  const messages={photo:'Condition photo recorded in the scene log.',protect:'Object protected. Unaffected property remains separate from work waste.',remove:'Contained removal recorded within this fictional approved scope. Waste handling in real work follows local rules.',clean:'Cleaning milestone complete. This does not yet mean disinfection is complete.',disinfect:'Simulation checkpoint: compatible product, label directions and required contact time confirmed. This click is not a real-world dwell timer or clearance test.',escalate:'Local work stopped and the hazard isolated. Qualified review requested; this is not a claim that the hazard is resolved.'};
  return log(s,messages[a.tool],v.done.length===o[5].length?'success':'info');
 }
 if(a.type==='finish'){
  if(!s.ready.boundary||scene(s).objects.some(o=>s.objects[o[0]].done.length!==o[5].length))return mistake('Closeout is not ready. Complete preparation and every documented object response, including required referrals.');
  s.phase='complete';s.records[s.mission]={score:Math.max(s.score,s.records[s.mission]?.score||0),attempts:(s.records[s.mission]?.attempts||0)+1};return log(s,'Simulation complete. Referrals remain pending qualified review; the scene is not declared safe for occupancy.','success');
 }
 return s;
}
export function isGameOver(){return {over:false};}
export function viewFor(s,p){
 const current=scene(s);
 return {...s,players:undefined,youCanAct:s.players.includes(p),scenes:SCENES.map(x=>({id:x.id,title:x.title,category:x.category,brief:x.brief,lesson:x.lesson})),current:current?{id:current.id,title:current.title,category:current.category,brief:current.brief,lesson:current.lesson,objects:current.objects.map((o,i)=>({id:o[0],label:o[1],x:POSITIONS[current.id][i][0],y:POSITIONS[current.id][i][1],note:s.objects[o[0]].inspected?o[4]:null,inspected:s.objects[o[0]].inspected,done:s.objects[o[0]].done,complete:s.objects[o[0]].done.length===o[5].length,next:s.objects[o[0]].inspected?(o[5][s.objects[o[0]].done.length]||null):'inspect',steps:o[5].length}))}:null};
}
