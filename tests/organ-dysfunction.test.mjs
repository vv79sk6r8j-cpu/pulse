import assert from "node:assert/strict";
import {test} from "node:test";
import {build} from "esbuild";
async function load(name){
 const b=await build({entryPoints:["src/scales/"+name+".tsx"],bundle:true,platform:"node",format:"esm",write:false});
 return import("data:text/javascript;base64,"+Buffer.from(b.outputFiles[0].text).toString("base64"));
}
const {calculateSofa}=await load("sofa");
const {stageAKI}=await load("kdigo");
const normal={pf:"400",respSupport:"no",platelets:"150",bilirubin:"19",map:"70",pressor:"none",gcs:"15",creatinine:"100",urine:"1500"};
test("SOFA normal and maximum",()=>{assert.deepEqual(calculateSofa(normal),[0,0,0,0,0,0]);assert.deepEqual(calculateSofa({...normal,pf:"99",respSupport:"yes",platelets:"19",bilirubin:"205",pressor:"ne_high",gcs:"5",urine:"199"}),[4,4,4,4,4,4]);});
test("SOFA respiratory support and boundaries",()=>{for(const [pf,support,expected] of [["400","no",0],["399","no",1],["299","no",2],["99","no",2],["199","yes",3],["100","yes",3],["99","yes",4]])assert.equal(calculateSofa({...normal,pf,respSupport:support})[0],expected);});
test("SOFA component thresholds",()=>{for(const [field,index,cases] of [["platelets",1,[[150,0],[149,1],[99,2],[49,3],[19,4]]],["bilirubin",2,[[19,0],[20,1],[33,2],[102,3],[205,4]]],["gcs",4,[[15,0],[14,1],[12,2],[9,3],[5,4]]],["creatinine",5,[[109,0],[110,1],[171,2],[300,3],[441,4]]],["urine",5,[[500,0],[499,3],[200,3],[199,4]]]])for(const [value,expected] of cases)assert.equal(calculateSofa({...normal,[field]:String(value)})[index],expected,field+" "+value);});
test("SOFA alternative lab units",()=>{assert.deepEqual(calculateSofa({...normal,bilirubin:"2.5",creatinine:"2.5"},{bilirubin:"alt",creatinine:"alt"}),calculateSofa({...normal,bilirubin:"42.75",creatinine:"221"}));});
test("SOFA missing or invalid values",()=>{for(const patch of [{gcs:""},{gcs:"3.5"},{gcs:"16"},{pf:"0"},{pressor:""}])assert.equal(calculateSofa({...normal,...patch}),null);});
const aki=(c=NaN,b48=NaN,b7=NaN,rate=NaN,h=NaN,rrt=false)=>stageAKI(c,b48,b7,rate,h,rrt).stage;
test("KDIGO creatinine rise and ratios",()=>{assert.equal(aki(126.4,100),0);assert.equal(aki(126.5,100),1);assert.equal(aki(150,NaN,100),1);assert.equal(aki(200,100),2);assert.equal(aki(300,NaN,100),3);assert.equal(aki(354,330,330),0);assert.equal(aki(354,300),3);});
test("KDIGO urine rate and duration boundaries",()=>{for(const [rate,h,expected] of [[0.49,5.9,0],[0.5,12,0],[0.49,6,1],[0.49,12,2],[0.3,24,2],[0.29,24,3],[0,11.9,1],[0,12,3]])assert.equal(aki(NaN,NaN,NaN,rate,h),expected);});
test("KDIGO highest criterion and acute RRT",()=>{assert.equal(aki(200,100,100,0.2,24),3);assert.equal(aki(NaN,NaN,NaN,NaN,NaN,true),3);});
