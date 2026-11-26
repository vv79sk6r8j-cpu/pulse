import assert from "node:assert/strict";
import {test} from "node:test";
import {build} from "esbuild";
async function load(name){const b=await build({entryPoints:["src/scales/"+name],bundle:true,platform:"node",format:"esm",write:false});return import("data:text/javascript;base64,"+Buffer.from(b.outputFiles[0].text).toString("base64"));}
const {calculateGcs}=await load("gcs.tsx");
const {calculateFour}=await load("four.tsx");
const {formatAsa}=await load("asa.tsx");
const {rass}=await load("rass.ts");
const {calculateQsofa}=await load("qsofa.ts");
test("GCS endpoints and mixed response",()=>{assert.equal(calculateGcs(["1","1","1"]),3);assert.equal(calculateGcs(["4","5","6"]),15);assert.equal(calculateGcs(["2","3","4"]),9);});
test("GCS missing, NT and invalid domains",()=>{for(const s of [["4","NT","6"],["","5","6"],["5","5","6"],["4","6","6"],["4","5","7"],[]])assert.equal(calculateGcs(s),null);});
test("FOUR endpoints and mixed response",()=>{assert.equal(calculateFour({E:0,M:0,B:0,R:0}),0);assert.equal(calculateFour({E:4,M:4,B:4,R:4}),16);assert.equal(calculateFour({E:1,M:2,B:3,R:4}),10);});
test("FOUR incomplete and invalid",()=>{assert.equal(calculateFour({E:0,M:0,B:0}),null);assert.equal(calculateFour({E:5,M:0,B:0,R:0}),null);});
test("ASA classes and emergency suffix",()=>{for(const c of ["I","II","III","IV","V"]){assert.ok(formatAsa(c,false).startsWith("ASA PS "+c+" —"));assert.ok(formatAsa(c,true).startsWith("ASA PS "+c+"E —"));}assert.ok(formatAsa("VI",true).startsWith("ASA PS VI —"));assert.equal(formatAsa(null,true),"");assert.equal(formatAsa("VII",false),"");});
test("RASS complete unique ordered score catalog",()=>{assert.deepEqual(rass.map(x=>x.score),[4,3,2,1,0,-1,-2,-3,-4,-5]);assert.ok(rass.every(x=>x.name&&x.detail));});
test("qSOFA all combinations at thresholds",()=>{for(const rr of [21,22])for(const bp of [100,101])for(const mental of [false,true])assert.equal(calculateQsofa(rr,bp,mental),Number(rr===22)+Number(bp===100)+Number(mental));});
