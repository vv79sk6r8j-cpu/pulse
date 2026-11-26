import { UnitFieldFrame, UnitSuffix, numericInputStyle, parseDecimal, validateNumeric, FieldFeedback, type FieldIssue } from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const ibwMeta={
 category:"КЛИНИЧЕСКИЙ КАЛЬКУЛЯТОР",
 title:"Идеальная масса тела (IBW)",
 subtitle:"Devine formula · Ideal Body Weight",
 shortTitle:"IBW",
 cardTitle:"Рост и пол",
 instruction:"Введите рост в сантиметрах и выберите пол, используемый в формуле Devine.",
 catalogDescription:"Идеальная масса тела по формуле Devine (1974)",
 disclaimer:"IBW по Devine не равна прогнозируемой массе тела (PBW) для расчёта дыхательного объёма при ИВЛ. Формула Devine исходно предложена для взрослых; при росте ниже 152,4 см её применение ограничено. Результат не заменяет клиническую оценку.",
 sourceLabel:"Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650–655.",
 sourceUrl:"https://pubmed.ncbi.nlm.nih.gov/?term=Devine+1974+gentamicin+therapy+ideal+body+weight"
} as const;

export function devineIBW(heightCm:number,sex:"male"|"female"):number{
 return (sex==="male"?50:45.5)+2.3*((heightCm-152.4)/2.54);
}
export default function IbwTool({onBack}:{onBack:()=>void}){
 const [height,setHeight]=useState(""),[sex,setSex]=useState<"male"|"female"| "">(""),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const [attempted,setAttempted]=useState(false);
 const h=parseDecimal(height),valid=height.trim()!==""&&Number.isFinite(h)&&h>=152.4&&sex!=="";
 const result=valid?devineIBW(h,sex as "male"|"female"):null;
 const note=result===null?"":`Идеальная масса тела (Devine): ${result.toFixed(1)} кг; рост ${h} см; пол по формуле: ${sex==="male"?"мужской":"женский"}.`;
 const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все инструменты</button><div className="page-heading"><span className="overline">{ibwMeta.category}</span><h1>{ibwMeta.title}</h1><p className="muted">{ibwMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{ibwMeta.shortTitle}</span><h2>{ibwMeta.cardTitle}</h2></div><div className="score">{result===null?"—":result.toFixed(1)}<small>кг</small></div></div>
 <p className="disclaimer">{ibwMeta.instruction}</p><div className="gcsgrid"><label><span>Рост</span><UnitFieldFrame issue={validateNumeric(height,{required:true,min:152.4},attempted)}><input style={numericInputStyle} type="text" min="152.4" step="0.1" inputMode="decimal" value={height} onChange={e=>{setHeight(e.target.value);setCopied(false);}} placeholder="Например, 175"/><UnitSuffix>см</UnitSuffix></UnitFieldFrame><FieldFeedback issue={validateNumeric(height,{required:true,min:152.4},attempted)}/></label><label><span>Пол в формуле</span><select aria-invalid={attempted&&!sex} style={attempted&&!sex?{borderColor:"#dc2626"}:undefined} value={sex} onChange={e=>{setSex(e.target.value as typeof sex);setCopied(false);}}><option value="">Выберите</option><option value="male">Мужской</option><option value="female">Женский</option></select><FieldFeedback issue={attempted&&!sex?{kind:"error",message:"Выберите пол в формуле."}:undefined}/></label></div>
 {height!==""&&(!Number.isFinite(h)||h<152.4)&&<p role="alert" className="copy-error">Для этой реализации формула применяется при росте от 152,4 см.</p>}
 {note&&<><div className="result"><span>Результат</span><strong>{note}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button type="button" className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button>
 <button type="button" className="back" onClick={()=>{setAttempted(false);setHeight("");setSex("");setCopied(false);setError(false);}}>Сбросить поля</button>
 {error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{ibwMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={ibwMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{ibwMeta.sourceLabel}</a>.</p></section></>;
}
