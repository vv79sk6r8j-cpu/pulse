import {FieldFeedback} from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const asaMeta={
 validation:{physicalStatus:{required:true},emergency:{excludedClasses:["VI"] as readonly string[]}},
 category:"КЛИНИЧЕСКАЯ КЛАССИФИКАЦИЯ",
 title:"ASA Physical Status — классификация физического состояния",
 subtitle:"American Society of Anesthesiologists Physical Status Classification System",
 shortTitle:"ASA PS",
 cardTitle:"Выберите класс физического состояния",
 instruction:"Оцените состояние пациента до анестезии. Суффикс E обозначает экстренное вмешательство, при котором задержка лечения существенно увеличивает угрозу жизни или части тела.",
 catalogDescription:"Классы ASA I–VI; E применяется только к ASA I–V",
 disclaimer:"ASA PS описывает физическое состояние пациента до анестезии, но сама по себе не является расчётом индивидуального периоперационного риска. Класс определяется клинически; приведённые формулировки не заменяют официальные примеры ASA.",
 sourceLabel:"ASA — Statement on ASA Physical Status Classification System",
 sourceUrl:"https://www.asahq.org/standards-and-practice-parameters/statement-on-asa-physical-status-classification-system"
} as const;

const classes=[
 {value:"I",title:"Здоровый пациент",detail:"Пациент без системных заболеваний."},
 {value:"II",title:"Лёгкое системное заболевание",detail:"Системное заболевание лёгкой степени, без существенных функциональных ограничений."},
 {value:"III",title:"Тяжёлое системное заболевание",detail:"Системное заболевание тяжёлой степени."},
 {value:"IV",title:"Тяжёлое системное заболевание с постоянной угрозой жизни",detail:"Системное заболевание тяжёлой степени, представляющее постоянную угрозу жизни."},
 {value:"V",title:"Умирающий пациент",detail:"Пациент, который, как ожидается, не выживет без операции."},
 {value:"VI",title:"Констатированная смерть мозга",detail:"Пациент с констатированной смертью мозга, органы которого изымаются для донорства."}
] as const;
export function formatAsa(value:string|null,emergency:boolean){const selected=classes.find(x=>x.value===value);return selected?`ASA PS ${value}${emergency&&!asaMeta.validation.emergency.excludedClasses.includes(value??'')?'E':''} — ${selected.title.toLowerCase()}.`:'';}
export default function AsaTool({onBack}:{onBack:()=>void}){
 const [attempted,setAttempted]=useState(false);
 const [value,setValue]=useState<string|null>(null),[emergency,setEmergency]=useState(false),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const result=formatAsa(value,emergency);
 const copy=async()=>{try{await navigator.clipboard.writeText(result);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button>
 <div className="page-heading"><span className="overline">{asaMeta.category}</span><h1>{asaMeta.title}</h1><p className="muted">{asaMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{asaMeta.shortTitle}</span><h2>{asaMeta.cardTitle}</h2></div><div className="score">{value??"—"}{emergency&&value?"E":""}</div></div>
 <p className="disclaimer">{asaMeta.instruction}</p>
 <div className="scale-options" style={attempted&&asaMeta.validation.physicalStatus.required&&!value?{outline:"1px solid #dc2626",borderRadius:8}:undefined}>{classes.map(item=><button key={item.value} className={"scale-option "+(value===item.value?"active":"")} aria-pressed={value===item.value} onClick={()=>{setValue(item.value);if(asaMeta.validation.emergency.excludedClasses.includes(item.value))setEmergency(false);setCopied(false);}}><strong>{item.value}</strong><span><b>{item.title}</b><small>{item.detail}</small></span></button>)}</div><FieldFeedback issue={attempted&&asaMeta.validation.physicalStatus.required&&!value?{kind:"error",message:"Выберите класс ASA."}:undefined}/>
 <label className="tool-check"><input type="checkbox" checked={emergency} disabled={asaMeta.validation.emergency.excludedClasses.includes(value??"")} onChange={e=>{setEmergency(asaMeta.validation.emergency.excludedClasses.includes(value??"")?false:e.target.checked);setCopied(false);}}/> <span><b>Экстренность (E)</b> — задержка лечения существенно увеличивает угрозу жизни или части тела. Для ASA VI суффикс E не применяется.</span></label>
 {result&&<><div className="result"><span>Результат</span><strong>{result}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button>
 <button className="back" onClick={()=>{setAttempted(false);setValue(null);setEmergency(false);setCopied(false);setError(false);}}>Сбросить поля</button>{error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{asaMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={asaMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{asaMeta.sourceLabel}</a>.</p>
 </section></>;
}
