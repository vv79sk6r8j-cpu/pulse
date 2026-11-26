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
