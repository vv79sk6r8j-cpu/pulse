import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const asaMeta={
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
export default function AsaTool({onBack}:{onBack:()=>void}){
 const [value,setValue]=useState<string|null>(null),[emergency,setEmergency]=useState(false),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const selected=classes.find(x=>x.value===value);
 const result=selected?`ASA PS ${value}${emergency?"E":""} — ${selected.title.toLowerCase()}.`:"";
 const copy=async()=>{try{await navigator.clipboard.writeText(result);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button>
 <div className="page-heading"><span className="overline">{asaMeta.category}</span><h1>{asaMeta.title}</h1><p className="muted">{asaMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{asaMeta.shortTitle}</span><h2>{asaMeta.cardTitle}</h2></div><div className="score">{value??"—"}{emergency&&value?"E":""}</div></div>
 <p className="disclaimer">{asaMeta.instruction}</p>
 <div className="scale-options">{classes.map(item=><button key={item.value} className={"scale-option "+(value===item.value?"active":"")} aria-pressed={value===item.value} onClick={()=>{setValue(item.value);if(item.value==="VI")setEmergency(false);setCopied(false);}}><strong>{item.value}</strong><span><b>{item.title}</b><small>{item.detail}</small></span></button>)}</div>
 <label className="tool-check"><input type="checkbox" checked={emergency} disabled={value==="VI"} onChange={e=>{setEmergency(value==="VI"?false:e.target.checked);setCopied(false);}}/> <span><b>Экстренность (E)</b> — задержка лечения существенно увеличивает угрозу жизни или части тела. Для ASA VI суффикс E не применяется.</span></label>
 {result&&<><div className="result"><span>Результат</span><strong>{result}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button className="back" onClick={()=>{setValue(null);setEmergency(false);setCopied(false);setError(false);}}>Сбросить поля</button>{error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{asaMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={asaMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{asaMeta.sourceLabel}</a>.</p>
 </section></>;
}
