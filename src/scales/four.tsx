import {FieldFeedback} from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const fourMeta={
 validation:{components:{required:true,allowNotTestable:true}},
 category:"КЛИНИЧЕСКАЯ ШКАЛА",
 title:"FOUR — оценка уровня сознания",
 subtitle:"Full Outline of UnResponsiveness",
 shortTitle:"FOUR",
 cardTitle:"Оцените четыре компонента",
 instruction:"Для каждого компонента выберите один вариант, соответствующий наблюдаемому ответу. Если компонент невозможно оценить, выберите NT; общая сумма в таком случае не рассчитывается. NT — отметка приложения, а не балл оригинальной шкалы.",
 catalogDescription:"Глаза, двигательная реакция, стволовые рефлексы и дыхание; 0–16 баллов",
 disclaimer:"FOUR не заменяет неврологическое обследование или формальную диагностику смерти мозга. Стволовые рефлексы и дыхательный паттерн оцениваются с учётом седации, интубации и иных клинических ограничений.",
 sourceLabel:"Wijdicks et al. Validation of a new coma scale: The FOUR score. Ann Neurol. 2005.",
 sourceUrl:"https://pubmed.ncbi.nlm.nih.gov/16178024/"
} as const;

const domains=[
 {id:"E",title:"Глаза (E)",options:[
  [4,"Глаза открыты; следит за объектом или моргает по команде"],
  [3,"Глаза открыты, но не следит"],
  [2,"Глаза закрыты; открывает на громкий голос"],
  [1,"Глаза закрыты; открывает на болевой стимул"],
  [0,"Глаза остаются закрытыми при болевом стимуле"]
 ]},
 {id:"M",title:"Двигательная реакция (M)",options:[
  [4,"Выполняет команды (показывает большой палец, кулак или знак V)"],
  [3,"Локализует болевой стимул"],
  [2,"Сгибательный ответ на боль"],
  [1,"Разгибательный ответ на боль"],
  [0,"Нет ответа на боль или генерализованный миоклонический статус"]
 ]},
 {id:"B",title:"Стволовые рефлексы (B)",options:[
  [4,"Зрачковые и корнеальные рефлексы сохранены"],
  [3,"Один зрачок широкий и не реагирует на свет"],
  [2,"Зрачковые ИЛИ корнеальные рефлексы отсутствуют"],
  [1,"Зрачковые И корнеальные рефлексы отсутствуют"],
  [0,"Зрачковые, корнеальные и кашлевой рефлексы отсутствуют"]
 ]},
 {id:"R",title:"Дыхание (R)",options:[
  [4,"Не интубирован, регулярное дыхание"],
  [3,"Не интубирован, дыхание Чейна–Стокса"],
  [2,"Не интубирован, нерегулярное дыхание"],
  [1,"Интубирован, дышит чаще установленной частоты аппарата ИВЛ"],
  [0,"Интубирован, дыхание в ритме аппарата ИВЛ или апноэ"]
 ]}
] as const;
export function calculateFour(scores:Record<string,number|"NT">){return domains.every(d=>d.options.some(([score])=>score===scores[d.id]))?domains.reduce((n,d)=>n+Number(scores[d.id]),0):null;}
export default function FourTool({onBack}:{onBack:()=>void}){
 const [attempted,setAttempted]=useState(false);
 const [scores,setScores]=useState<Record<string,number|"NT">>({}),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const total=calculateFour(scores);
 const result=domains.every(d=>scores[d.id]!==undefined)?`FOUR: E${scores.E} M${scores.M} B${scores.B} R${scores.R}${total===null?"; сумма не определяется.":` = ${total}/16 баллов.`}`:"";
 const copy=async()=>{try{await navigator.clipboard.writeText(result);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button>
 <div className="page-heading"><span className="overline">{fourMeta.category}</span><h1>{fourMeta.title}</h1><p className="muted">{fourMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{fourMeta.shortTitle}</span><h2>{fourMeta.cardTitle}</h2></div><div className="score">{total??"—"}<small>/16</small></div></div>
 <p className="disclaimer">{fourMeta.instruction}</p>
 {domains.map(d=><div key={d.id} className="scale-domain"><h3>{d.title}</h3><div className="scale-options" style={attempted&&fourMeta.validation.components.required&&scores[d.id]===undefined?{outline:"1px solid #dc2626",borderRadius:8}:undefined}>{d.options.map(([score,label])=><button key={score} className={"scale-option "+(scores[d.id]===score?"active":"")} aria-pressed={scores[d.id]===score} onClick={()=>{setScores(prev=>({...prev,[d.id]:score}));setCopied(false);}}><strong>{score}</strong><span><b>{label}</b></span></button>)}{fourMeta.validation.components.allowNotTestable&&<button type="button" className={"scale-option "+(scores[d.id]==="NT"?"active":"")} aria-pressed={scores[d.id]==="NT"} onClick={()=>{setScores(prev=>({...prev,[d.id]:"NT"}));setCopied(false);setError(false);}}><strong>NT</strong><span>Не оценивается</span></button>}</div><FieldFeedback issue={attempted&&fourMeta.validation.components.required&&scores[d.id]===undefined?{kind:"error",message:"Выберите ответ."}:undefined}/></div>)}
 {result&&<><div className="result"><span>Результат</span><strong>{result}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button>
 <button className="back" onClick={()=>{setAttempted(false);setScores({});setCopied(false);setError(false);}}>Сбросить поля</button>{error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{fourMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={fourMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{fourMeta.sourceLabel}</a>.</p>
 </section></>;
}
