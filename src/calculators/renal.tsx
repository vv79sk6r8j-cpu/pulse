import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const renalMeta={
 category:"КЛИНИЧЕСКИЙ КАЛЬКУЛЯТОР",
 title:"Оценка функции почек",
 subtitle:"CKD-EPI 2021 · Cockcroft–Gault",
 shortTitle:"ПОЧКИ",
 cardTitle:"Креатинин, возраст и масса тела",
 instruction:"Введите возраст, сывороточный креатинин, пол в формуле и массу тела. CKD-EPI 2021 рассчитывает eGFR, индексированную на 1,73 м²; Cockcroft–Gault оценивает клиренс креатинина в мл/мин.",
 catalogDescription:"eGFR CKD-EPI 2021 и клиренс креатинина Cockcroft–Gault",
 disclaimer:"Формулы предполагают относительно стабильный креатинин; при остром повреждении почек и быстро меняющемся креатинине оценки ненадёжны. CKD-EPI выражается в мл/мин/1,73 м², Cockcroft–Gault — в мл/мин; показатели не взаимозаменяемы. Для назначения лекарств учитывайте инструкцию, массу тела, площадь поверхности тела и клиническую ситуацию.",
 sourceLabel:"NKF CKD-EPI 2021 creatinine equation; Cockcroft DW, Gault MH. Nephron. 1976.",
 sourceUrl:"https://www.kidney.org/ckd-epi-creatinine-equation-2021"
} as const;
export function egfr2021(age:number,creatinineMgDl:number,sex:"male"|"female"):number{
 const k=sex==="female"?0.7:0.9,a=sex==="female"?-0.241:-0.302,x=creatinineMgDl/k;
 return 142*Math.pow(Math.min(x,1),a)*Math.pow(Math.max(x,1),-1.2)*Math.pow(0.9938,age)*(sex==="female"?1.012:1);
}
export function cockcroftGault(age:number,creatinineMgDl:number,weightKg:number,sex:"male"|"female"):number{
 return (140-age)*weightKg/(72*creatinineMgDl)*(sex==="female"?0.85:1);
}
export default function RenalTool({onBack}:{onBack:()=>void}){
 const [age,setAge]=useState(""),[creatinine,setCreatinine]=useState(""),[unit,setUnit]=useState<"umol"|"mgdl">("umol"),[weight,setWeight]=useState(""),[sex,setSex]=useState<"male"|"female"|"">(""),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const a=Number(age.replace(",",".")),c=Number(creatinine.replace(",",".")),w=Number(weight.replace(",",".")),scr=unit==="umol"?c/88.4:c;
 const base=age!==""&&creatinine!==""&&sex!==""&&Number.isFinite(a)&&a>=18&&a<=120&&Number.isFinite(scr)&&scr>=0.1&&scr<=30;
 const validWeight=weight!==""&&Number.isFinite(w)&&w>0&&w<=500;
 const egfr=base?egfr2021(a,scr,sex as "male"|"female"):null;
 const crcl=base&&validWeight?cockcroftGault(a,scr,w,sex as "male"|"female"):null;
 const note=egfr===null?"":`CKD-EPI 2021: ${egfr.toFixed(1)} мл/мин/1,73 м²${crcl===null?"":`; Cockcroft–Gault: ${crcl.toFixed(1)} мл/мин (масса ${w} кг)`}. Креатинин ${c} ${unit==="umol"?"мкмоль/л":"мг/дл"}, возраст ${a} лет.`;
 const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все инструменты</button><div className="page-heading"><span className="overline">{renalMeta.category}</span><h1>{renalMeta.title}</h1><p className="muted">{renalMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{renalMeta.shortTitle}</span><h2>{renalMeta.cardTitle}</h2></div><div className="score">{egfr===null?"—":egfr.toFixed(1)}</div></div><p className="disclaimer">{renalMeta.instruction}</p>
 <div className="gcsgrid">
 <label><span>Возраст</span><div style={{display:"flex",alignItems:"center",border:"1px solid currentColor",borderRadius:8,overflow:"hidden",minWidth:0}}><input style={{flex:1,minWidth:0,width:0,border:0,borderRadius:0}} type="text" inputMode="decimal" min="18" max="120" step="1" value={age} onChange={e=>{setAge(e.target.value);setCopied(false);}} placeholder="Например, 65"/><span style={{padding:"0 10px",whiteSpace:"nowrap"}}>лет</span></div></label>
 <label><span>Пол в формуле</span><select value={sex} onChange={e=>{setSex(e.target.value as typeof sex);setCopied(false);}}><option value="">Выберите</option><option value="male">Мужской</option><option value="female">Женский</option></select></label>
 <label><span>Креатинин</span><div style={{display:"flex",alignItems:"center",border:"1px solid currentColor",borderRadius:8,overflow:"hidden",minWidth:0}}><input style={{flex:1,minWidth:0,width:0,border:0,borderRadius:0}} type="text" inputMode="decimal" min="0" step="any" value={creatinine} onChange={e=>{setCreatinine(e.target.value);setCopied(false);}} placeholder={unit==="umol"?"Например, 100":"Например, 1.1"}/><select aria-label="Единицы креатинина" style={{width:"auto",maxWidth:"55%",border:0,borderLeft:"1px solid currentColor",borderRadius:0}} value={unit} onChange={e=>{setUnit(e.target.value as typeof unit);setCreatinine("");setCopied(false);}}><option value="umol">мкмоль/л</option><option value="mgdl">мг/дл</option></select></div></label>
 <label><span>Фактическая масса тела (для Cockcroft–Gault)</span><div style={{display:"flex",alignItems:"center",border:"1px solid currentColor",borderRadius:8,overflow:"hidden",minWidth:0}}><input style={{flex:1,minWidth:0,width:0,border:0,borderRadius:0}} type="text" inputMode="decimal" min="0" step="any" value={weight} onChange={e=>{setWeight(e.target.value);setCopied(false);}} placeholder="Например, 75"/><span style={{padding:"0 10px",whiteSpace:"nowrap"}}>кг</span></div></label>
 </div>
 {egfr!==null&&<><div className="result"><span>CKD-EPI 2021</span><strong>{egfr.toFixed(1)} мл/мин/1,73 м²</strong></div><div className="result"><span>Cockcroft–Gault</span><strong>{crcl===null?"Введите массу тела":crcl.toFixed(1)+" мл/мин"}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button type="button" className="back" onClick={()=>{setAge("");setCreatinine("");setWeight("");setSex("");setCopied(false);setError(false);}}>Сбросить поля</button>
 {error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{renalMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={renalMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{renalMeta.sourceLabel}</a>.</p></section></>;
}
