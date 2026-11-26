import assert from "node:assert/strict";
import {test} from "node:test";
import {build} from "esbuild";
async function load(name){
 const b=await build({entryPoints:["src/calculators/"+name+".tsx"],bundle:true,platform:"node",format:"esm",write:false});
 return import("data:text/javascript;base64,"+Buffer.from(b.outputFiles[0].text).toString("base64"));
}
const {egfr2021,cockcroftGault}=await load("renal");
const {devineIBW}=await load("ibw");
const {infusionRate,convertInfusion}=await load("infusion");
const near=(actual,expected,tolerance=0.01)=>assert.ok(Math.abs(actual-expected)<=tolerance,actual+" expected "+expected);
test("CKD-EPI 2021 at sex-specific creatinine knots",()=>{
 near(egfr2021(50,0.9,"male"),104.0490,0.1);
 near(egfr2021(50,0.7,"female"),105.2976,0.1);
});
test("Cockcroft-Gault male and female",()=>{near(cockcroftGault(60,1,72,"male"),80);near(cockcroftGault(60,1,72,"female"),68);});
test("Devine baseline and one inch above",()=>{near(devineIBW(152.4,"male"),50);near(devineIBW(152.4,"female"),45.5);near(devineIBW(154.94,"male"),52.3);});
test("Infusion norepinephrine 4 mg in 50 mL, 80 kg, 0.1 mcg/kg/min",()=>{near(infusionRate(0.1,80,4,50),6);near(convertInfusion(0.1,80,4800,false),6);near(convertInfusion(6,80,4800,true),0.1);});
test("Vasopressin 20 units in 50 mL, 0.03 units/min",()=>{near(convertInfusion(0.03,0.4,60,false),4.5);near(convertInfusion(4.5,0.4,60,true),0.03);});
test("Zero dose and reverse rate",()=>{near(convertInfusion(0,80,4800,false),0);near(convertInfusion(0,80,4800,true),0);});

test("All six mass dose units in both directions",()=>{
 // 4 mg / 50 mL, 80 kg; equivalent doses all deliver 6 mL/h.
 for(const [dose,factor] of [[0.1,4800],[6,80],[0.006,80000],[8,60],[480,1],[0.48,1000]]){
  near(convertInfusion(dose,80,factor,false),6,1e-9);
  near(convertInfusion(6,80,factor,true),dose,1e-9);
 }
});
test("Both activity dose units in both directions",()=>{
 for(const [dose,factor] of [[0.03,60],[1.8,1]]){
  near(convertInfusion(dose,0.4,factor,false),4.5,1e-9);
  near(convertInfusion(4.5,0.4,factor,true),dose,1e-9);
 }
});
