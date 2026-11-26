import { UnitFieldFrame, UnitSuffix, numericInputStyle, unitSelectStyle, parseDecimal, validateNumeric, FieldFeedback, type FieldIssue } from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const sofaMeta={
 category:"КЛИНИЧЕСКАЯ ШКАЛА",
 title:"SOFA — оценка органной дисфункции",
 subtitle:"Sequential Organ Failure Assessment · оригинальная SOFA",
 shortTitle:"SOFA",
 cardTitle:"Шесть органных систем",
 instruction:"Укажите показатели за выбранный период оценки. Для респираторного компонента используйте PaO₂/FiO₂ (мм рт. ст.) и отметьте респираторную поддержку. Для вазопрессоров учитывается максимальный уровень поддержки; дозы в мкг/кг/мин.",
 catalogDescription:"Шесть органных систем, суммарная оценка 0–24 балла",
 disclaimer:"SOFA — динамическая шкала органной дисфункции, не самостоятельный диагноз сепсиса. При отсутствии данных нельзя автоматически считать компонент нормальным. Для исходной SOFA учитывайте клинический контекст, поддержку органов и время измерений. Используется оригинальная версия SOFA, не SOFA-2.",
 sourceLabel:"Vincent JL et al. The SOFA score to describe organ dysfunction/failure. Intensive Care Med. 1996.",
 sourceUrl:"https://pubmed.ncbi.nlm.nih.gov/8844239/"
} as const;
type Values=Record<string,string>;
const inputs=[
 {id:"pf",label:"PaO₂/FiO₂, мм рт. ст.",type:"number"},
 {id:"respSupport",label:"Респираторная поддержка",type:"select",options:[["no","Нет"],["yes","Да"]]},
 {id:"platelets",label:"Тромбоциты, ×10⁹/л",type:"number"},
 {id:"bilirubin",label:"Билирубин общий, мкмоль/л",type:"number"},
 {id:"map",label:"Среднее АД, мм рт. ст.",type:"number"},
 {id:"pressor",label:"Вазоактивная поддержка",type:"select",options:[["none","Нет"],["dobutamine","Добутамин (любая доза)"],["dopamine_low","Допамин ≤5 мкг/кг/мин"],["dopamine_mid","Допамин >5–15 мкг/кг/мин"],["dopamine_high","Допамин >15 мкг/кг/мин"],["ne_low","Норадреналин или адреналин ≤0,1 мкг/кг/мин"],["ne_high","Норадреналин или адреналин >0,1 мкг/кг/мин"]]},
 {id:"gcs",label:"GCS, баллы",type:"number"},
 {id:"creatinine",label:"Креатинин, мкмоль/л",type:"number"},
 {id:"urine",label:"Диурез за 24 часа, мл",type:"number"}
] as const;
const numeric=(v:string)=>v.trim()===""?null:parseDecimal(v);
export function calculateSofa(v:Values):number[]|null{
 const pf=numeric(v.pf??""),pl=numeric(v.platelets??""),bil=numeric(v.bilirubin??""),map=numeric(v.map??""),gcs=numeric(v.gcs??""),cr=numeric(v.creatinine??""),ur=numeric(v.urine??"");
 if([pf,pl,bil,map,gcs,cr,ur].some(x=>x===null||!Number.isFinite(x)||x<0)||!v.respSupport||!v.pressor||pf!<=0||cr!<=0||gcs!<3||gcs!>15||!Number.isInteger(gcs))return null;
 const respiratory=pf!<100&&v.respSupport==="yes"?4:pf!<200&&v.respSupport==="yes"?3:pf!<300?2:pf!<400?1:0;
 const coag=pl!<20?4:pl!<50?3:pl!<100?2:pl!<150?1:0;
 const liver=bil!>=204?4:bil!>=102?3:bil!>=33?2:bil!>=20?1:0;
 const cv=v.pressor==="ne_high"||v.pressor==="dopamine_high"?4:v.pressor==="ne_low"||v.pressor==="dopamine_mid"?3:v.pressor==="dobutamine"||v.pressor==="dopamine_low"?2:map!<70?1:0;
 const neuro=gcs!<6?4:gcs!<10?3:gcs!<13?2:gcs!<15?1:0;
 const renal=ur!<200||cr!>=440?4:ur!<500||cr!>=300?3:cr!>=171?2:cr!>=110?1:0;
 return [respiratory,coag,liver,cv,neuro,renal];
}
export default function SofaTool({onBack}:{onBack:()=>void}){
 const [values,setValues]=useState<Values>({}),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const [attempted,setAttempted]=useState(false);
 const issueFor=(id:string,type:string):FieldIssue|undefined=>{const raw=values[id]??'';if(type==='select')return attempted&&!raw?{kind:'error',message:'Выберите значение.'}:undefined;const issue=validateNumeric(raw,{required:true,min:['pf','creatinine'].includes(id)?Number.MIN_VALUE:id==='gcs'?3:0,max:id==='gcs'?15:undefined},attempted);return issue??(attempted&&id==='gcs'&&raw&&!Number.isInteger(parseDecimal(raw))?{kind:'error',message:'Введите целое число баллов.'}:undefined);};
 const [units,setUnits]=useState<Values>({});
 const normalized={...values};
 for(const [id,factor] of Object.entries({pf:7.50062,map:7.50062,bilirubin:17.1,creatinine:88.4})){if(units[id]==="alt"&&values[id]?.trim())normalized[id]=String(parseDecimal(values[id])*factor);}
 const scores=calculateSofa(normalized),total=scores?.reduce((a,b)=>a+b,0)??null;
 const note=total===null?"":`SOFA: ${total}/24 (дыхание ${scores![0]}, коагуляция ${scores![1]}, печень ${scores![2]}, ССС ${scores![3]}, ЦНС ${scores![4]}, почки ${scores![5]}).`+ " Исходные данные: "+inputs.filter(f=>f.type==="number").map(f=>f.label.split(",")[0]+" "+values[f.id]+" "+(units[f.id]==="alt"?(f.id==="pf"||f.id==="map"?"кПа":"мг/дл"):f.label.split(",").slice(1).join(",").trim())).join("; ")+"; поддержка: "+(values.respSupport==="yes"?"да":"нет")+"; вазопрессоры: "+(inputs.find(f=>f.id==="pressor")?.options?.find(o=>o[0]===values.pressor)?.[1]??"—")+".";;
 const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button><div className="page-heading"><span className="overline">{sofaMeta.category}</span><h1>{sofaMeta.title}</h1><p className="muted">{sofaMeta.subtitle}</p></div><section className="calculator">
 <div className="calchead"><div><span className="overline">{sofaMeta.shortTitle}</span><h2>{sofaMeta.cardTitle}</h2></div><div className="score">{total??"—"}<small>/24</small></div></div><p className="disclaimer">{sofaMeta.instruction}</p>
 <div className="gcsgrid">{inputs.map(field=><label key={field.id}><span>{field.type==="number"?field.label.split(",")[0]:field.label}</span>{field.type==="select"?<select aria-invalid={issueFor(field.id,field.type)?.kind==="error"} style={issueFor(field.id,field.type)?{borderColor:"#dc2626"}:undefined} value={values[field.id]??""} onChange={e=>{setValues(prev=>({...prev,[field.id]:e.target.value}));setCopied(false);}}><option value="">Выберите</option>{field.options?.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select>:<UnitFieldFrame issue={issueFor(field.id,field.type)}><input aria-invalid={issueFor(field.id,field.type)?.kind==="error"} type="text" style={numericInputStyle} min="0" step="any" inputMode="decimal" value={values[field.id]??""} onChange={e=>{setValues(prev=>({...prev,[field.id]:e.target.value}));setCopied(false);}} placeholder="Введите значение"/>{["pf","map","bilirubin","creatinine"].includes(field.id)?<select aria-label={field.label+" — единицы"} style={unitSelectStyle} value={units[field.id]??"base"} onChange={e=>{setUnits(p=>({...p,[field.id]:e.target.value}));setValues(p=>({...p,[field.id]:""}));setCopied(false);}}><option value="base">{field.id==="pf"||field.id==="map"?"мм рт. ст.":"мкмоль/л"}</option><option value="alt">{field.id==="pf"||field.id==="map"?"кПа":"мг/дл"}</option></select>:<UnitSuffix>{field.id==="platelets"?"×10⁹/л":field.id==="gcs"?"баллы":"мл"}</UnitSuffix>}</UnitFieldFrame>}<FieldFeedback issue={issueFor(field.id,field.type)}/></label>)}</div>
 {scores&&<><div className="result"><span>Результат</span><strong>{note}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 <button type="button" className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button><button type="button" className="back" onClick={()=>{setAttempted(false);setValues({});setUnits({});setCopied(false);setError(false);}}>Сбросить поля</button>
 {error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{sofaMeta.disclaimer}</p><p className="disclaimer">Источник: <a href={sofaMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{sofaMeta.sourceLabel}</a>.</p></section></>;
}
