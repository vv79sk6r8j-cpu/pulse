import { UnitFieldFrame, UnitSuffix, numericInputStyle, unitSelectStyle, parseDecimal, validateNumeric, FieldFeedback, type FieldIssue } from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const renalMeta={
 category:"КЛИНИЧЕСКИЙ КАЛЬКУЛЯТОР",
 title:"Оценка функции почек",
 subtitle:"CKD-EPI 2021 · Cockcroft–Gault",
 shortTitle:"ПОЧКИ",
 cardTitle:"Креатинин, возраст и масса тела",
 instruction:"Введите возраст, сывороточный креатинин и пол в формуле; масса тела необходима только для Cockcroft–Gault. CKD-EPI 2021 рассчитывает eGFR, индексированную на 1,73 м²; Cockcroft–Gault оценивает клиренс креатинина в мл/мин.",
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
 const [attempted,setAttempted]=useState(false);
 const a=parseDecimal(age),c=parseDecimal(creatinine),w=parseDecimal(weight),scr=unit==="umol"?c/88.4:c;
 const base=age!==""&&creatinine!==""&&sex!==""&&Number.isFinite(a)&&Number.isInteger(a)&&a>=18&&Number.isFinite(scr)&&scr>0;
 const ageIssue=validateNumeric(age,{required:true,min:18},attempted)??(attempted&&age.trim()&&!Number.isInteger(a)?{kind:"error" as const,message:"Введите возраст в полных годах."}:undefined);
 const creatIssue=validateNumeric(creatinine,{required:true,min:Number.MIN_VALUE},attempted);
 const weightIssue=validateNumeric(weight,{min:Number.MIN_VALUE},attempted);
 const validWeight=weight!==""&&Number.isFinite(w)&&w>0;
 const egfr=base?egfr2021(a,scr,sex as "male"|"female"):null;
 const crcl=base&&validWeight&&a<140?cockcroftGault(a,scr,w,sex as "male"|"female"):null;
 const note=egfr===null?"":`CKD-EPI 2021: ${egfr.toFixed(1)} мл/мин/1,73 м²${crcl===null?"":`; Cockcroft–Gault: ${crcl.toFixed(1)} мл/мин (масса ${w} кг)`}. Креатинин ${c} ${unit==="umol"?"мкмоль/л":"мг/дл"}, возраст ${a} лет; пол по формуле: ${sex==="male"?"мужской":"женский"}.`;
 const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все инструменты</button><div className="page-heading"><span className="overline">{renalMeta.category}</span><h1>{renalMeta.title}</h1><p className="muted">{renalMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{renalMeta.shortTitle}</span><h2>{renalMeta.cardTitle}</h2></div><div className="score">{egfr===null?"—":egfr.toFixed(1)}</div></div><p className="disclaimer">{renalMeta.instruction}</p>
 <div className="gcsgrid">
 <label><span>Возраст</span><UnitFieldFrame issue={ageIssue}><input style={numericInputStyle} type="text" inputMode="decimal" min="18" step="1" value={age} onChange={e=>{setAge(e.target.value);setCopied(false);}} placeholder="Например, 65"/><UnitSuffix>лет</UnitSuffix></UnitFieldFrame><FieldFeedback issue={ageIssue}/></label>
 <label><span>Пол в формуле</span><select aria-invalid={attempted&&!sex} style={attempted&&!sex?{borderColor:"#dc2626"}:undefined} value={sex} onChange={e=>{setSex(e.target.value as typeof sex);setCopied(false);}}><option value="">Выберите</option><option value="male">Мужской</option><option value="female">Женский</option></select><FieldFeedback issue={attempted&&!sex?{kind:"error",message:"Выберите пол в формуле."}:undefined}/></label>
 <label><span>Креатинин</span><UnitFieldFrame issue={creatIssue}><input style={numericInputStyle} type="text" inputMode="decimal" min="0" step="any" value={creatinine} onChange={e=>{setCreatinine(e.target.value);setCopied(false);}} placeholder={unit==="umol"?"Например, 100":"Например, 1.1"}/><select aria-label="Единицы креатинина" style={unitSelectStyle} value={unit} onChange={e=>{setUnit(e.target.value as typeof unit);setCreatinine("");setCopied(false);}}><option value="umol">мкмоль/л</option><option value="mgdl">мг/дл</option></select></UnitFieldFrame><FieldFeedback issue={creatIssue}/></label>
 <label><span>Фактическая масса тела (для Cockcroft–Gault)</span><UnitFieldFrame issue={weightIssue}><input style={numericInputStyle} type="text" inputMode="decimal" min="0" step="any" value={weight} onChange={e=>{setWeight(e.target.value);setCopied(false);}} placeholder="Например, 75"/><UnitSuffix>кг</UnitSuffix></UnitFieldFrame><FieldFeedback issue={weightIssue}/></label>
 </div>
 {egfr!==null&&<><div className="result"><span>CKD-EPI 2021</span><strong>{egfr.toFixed(1)} мл/мин/1,73 м²</strong></div><div className="result"><span>Cockcroft–Gault</span><strong>{crcl===null?(a>=140?"Вне математической области Cockcroft–Gault":weight.trim()?"Проверьте массу тела":"Введите массу тела"):crcl.toFixed(1)+" мл/мин"}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button type="button" className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button>
 <button type="button" className="back" onClick={()=>{setAttempted(false);setAge("");setCreatinine("");setWeight("");setSex("");setCopied(false);setError(false);}}>Сбросить поля</button>
 {error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{renalMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={renalMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{renalMeta.sourceLabel}</a>.</p></section></>;
}
