import assert from "node:assert/strict";
import { test } from "node:test";
import { build } from "esbuild";

const bundle = await build({entryPoints:["src/components/NumericInputWithUnit.tsx"],bundle:true,platform:"node",format:"esm",write:false});
const {parseDecimal,validateNumeric} = await import("data:text/javascript;base64,"+Buffer.from(bundle.outputFiles[0].text).toString("base64"));
const kind=(raw,rule,attempted=true)=>validateNumeric(raw,rule,attempted)?.kind;
test("decimal comma and point",()=>{assert.equal(parseDecimal("1,25"),1.25);assert.equal(parseDecimal("1.25"),1.25);});
test("reject malformed and nonfinite values",()=>{for(const s of ["","abc","1e3","1,2.3","Infinity","-1"])assert.ok(Number.isNaN(parseDecimal(s)),s);});
test("required only after attempt",()=>{assert.equal(kind("",{required:true},false),undefined);assert.equal(kind("",{required:true}),"error");assert.equal(kind("",{}),undefined);});
test("inclusive bounds and integer constraint",()=>{const r={min:3,max:15,integer:true};for(const s of ["3","15","10"])assert.equal(kind(s,r),undefined);for(const s of ["2","16","3.5"])assert.equal(kind(s,r),"error");});
test("zero and positive quantities",()=>{assert.equal(kind("0",{min:0}),undefined);assert.equal(kind("0",{min:Number.MIN_VALUE}),"error");});
test("warning is distinct from error",()=>{const r={min:0,max:100,warnMin:10,warnMax:90};assert.equal(kind("5",r),"warning");assert.equal(kind("95",r),"warning");assert.equal(kind("101",r),"error");assert.equal(kind("50",r),undefined);});
test("unit normalization",()=>{assert.equal(kind("1",{factor:88.4,min:88,max:89}),undefined);assert.equal(kind("88.4",{min:88,max:89}),undefined);});

async function loadMeta(path,name){
 const b=await build({entryPoints:[path],bundle:true,platform:"node",format:"esm",write:false});
 return (await import("data:text/javascript;base64,"+Buffer.from(b.outputFiles[0].text).toString("base64")))[name];
}
const renal=await loadMeta("src/calculators/renal.tsx","renalMeta");
const sofa=await loadMeta("src/scales/sofa.tsx","sofaMeta");
const kdigo=await loadMeta("src/scales/kdigo.tsx","kdigoMeta");
const ibw=await loadMeta("src/calculators/ibw.tsx","ibwMeta");
const infusion=await loadMeta("src/calculators/infusion.tsx","infusionMeta");
const qsofa=await loadMeta("src/scales/qsofa.ts","qsofaMeta");
test("creatinine warnings consistent across tools and units",()=>{
 for(const rule of [renal.validation.creatinine,sofa.validation.creatinine,kdigo.validation.c,kdigo.validation.b48,kdigo.validation.b7]){
  for(const [si,alt,expected] of [["4.42","0.05","warning"],["88.4","1",undefined],["1060.8","12","warning"],["0","0","error"]]){
   assert.equal(kind(si,rule),expected);assert.equal(kind(alt,{...rule,factor:88.4}),expected);
  }
  for(const v of ["8.8","999"])assert.equal(kind(v,rule),undefined);
 }
});
test("SOFA bilirubin and MAP equivalent units",()=>{
 for(const [rule,factor,cases] of [[sofa.validation.bilirubin,17.1,[["0.855","0.05","warning"],["17.1","1",undefined],["855","50","warning"]]],[sofa.validation.map,7.50062,[["7.50062","1","warning"],["75.0062","10",undefined],["225.0186","30","warning"]]]]){
  for(const [si,alt,expected] of cases){assert.equal(kind(si,rule),expected);assert.equal(kind(alt,{...rule,factor}),expected);}
 }
});
test("SOFA platelet warning boundaries",()=>{const r=sofa.validation.platelets;for(const v of ["1","999"])assert.equal(kind(v,r),undefined);for(const v of ["0","1000"])assert.equal(kind(v,r),"warning");assert.equal(kind("-1",r),"error");});
test("qSOFA vital signs warning boundaries",()=>{for(const [r,max] of [[qsofa.validation.resp,80],[qsofa.validation.sbp,400]]){assert.equal(kind("0",r),undefined);assert.equal(kind(String(max),r),undefined);assert.equal(kind(String(max+1),r),"warning");assert.equal(kind("-1",r),"error");}});
test("anthropometry warnings consistent across tools",()=>{for(const r of [renal.validation.weight,kdigo.validation.w,infusion.validation.weight]){for(const v of ["24.9","453.6"])assert.equal(kind(v,r),undefined);for(const v of ["24.8","453.7"])assert.equal(kind(v,r),"warning");assert.equal(kind("0",r),"error");}assert.equal(kind("152.3",ibw.validation.height),"error");assert.equal(kind("228.6",ibw.validation.height),undefined);assert.equal(kind("228.7",ibw.validation.height),"warning");});
test("warnings hidden until validation attempt",()=>{assert.equal(kind("1000",renal.validation.creatinine,false),undefined);assert.equal(kind("1000",renal.validation.creatinine,true),"warning");assert.equal(kind("",kdigo.validation.c),undefined);assert.equal(kind("",renal.validation.creatinine),"error");});
