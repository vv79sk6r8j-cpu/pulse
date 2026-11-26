import { UnitFieldFrame, UnitSuffix, numericInputStyle, unitSelectStyle, parseDecimal, validateNumeric, FieldFeedback, type FieldIssue } from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const infusionMeta={
 category:"КЛИНИЧЕСКИЙ КАЛЬКУЛЯТОР",
 title:"Расчёт инфузии вазоактивных препаратов",
 subtitle:"Прямой и обратный расчёт",
 shortTitle:"ИНФУЗИЯ",
 cardTitle:"Расчёт скорости шприцевого дозатора",
 instruction:"Введите фактическое количество действующего вещества, конечный объём и дозу либо скорость. Калькулятор не предлагает лечебную дозу или схему разведения.",
 catalogDescription:"Перевод дозы в мл/ч и обратно",
 disclaimer:"Высокорисковые препараты: независимо проверьте назначение, массу тела, конечную концентрацию, единицы и скорость дозатора по локальному протоколу. Учитывайте различия маркировки основания и солей. Этот инструмент не рекомендует дозировки и не проверяет совместимость растворов.",
 sourceLabel:"Скорость = количество вещества в час / концентрация; обратный расчёт — умножение скорости на концентрацию",
 sourceUrl:""
} as const;

const drugs=[["norepi","Норадреналин"],["epi","Адреналин"],["dobutamine","Добутамин"],["dopamine","Допамин"],["phenylephrine","Фенилэфрин (Мезатон)"],["vasopressin","Вазопрессин"],["other","Другой препарат"]] as const;
const units=[["мкг/кг/мин",60,true],["мкг/кг/ч",1,true],["мг/кг/ч",1000,true],["мкг/мин",60,false],["мкг/ч",1,false],["мг/ч",1000,false]] as const;
const activityUnits=[["ЕД/мин",60,false],["ЕД/ч",1,false]] as const;
export function infusionRate(doseMcgKgMin:number,weightKg:number,drugMg:number,volumeMl:number):number{
 return doseMcgKgMin*weightKg*60*volumeMl/(drugMg*1000);
}
export function convertInfusion(value:number,concentration:number,factor:number,reverse:boolean):number{
 return reverse?value*concentration/factor:value*factor/concentration;
}
const numeric=parseDecimal;
function Field({label,value,onChange,unit,choices,onUnit,issue}:{label:string,value:string,onChange:(v:string)=>void,unit:string,choices?:readonly string[],onUnit?:(v:string)=>void;issue?:FieldIssue}){
 return <label><span>{label}</span><UnitFieldFrame issue={issue}><input aria-invalid={issue?.kind==='error'} aria-label={label} inputMode="decimal" value={value} onChange={e=>onChange(e.target.value)} style={numericInputStyle}/>{choices?<select aria-label={label+" — единицы"} value={unit} onChange={e=>onUnit?.(e.target.value)} style={unitSelectStyle}>{choices.map(u=><option key={u}>{u}</option>)}</select>:<UnitSuffix>{unit}</UnitSuffix>}</UnitFieldFrame><FieldFeedback issue={issue}/></label>;
}
export default function InfusionTool({onBack}:{onBack:()=>void}){
 const [drug,setDrug]=useState("norepi"),[weight,setWeight]=useState(""),[mg,setMg]=useState(""),[volume,setVolume]=useState(""),[dose,setDose]=useState(""),[copied,setCopied]=useState(false),[error,setError]=useState(false),[reverse,setReverse]=useState(false),[unit,setUnit]=useState("мкг/кг/мин"),[other,setOther]=useState("");
 const [attempted,setAttempted]=useState(false);
 const activity=drug==="vasopressin", available=activity?activityUnits:units;
 const selected=available.find(x=>x[0]===unit)??available[0];
 const w=numeric(weight),m=numeric(mg),v=numeric(volume),d=numeric(dose);
 const factor=selected[1]*(selected[2]?w:1);
 const concentration=m*(activity?1:1000)/v;
 const valid=[m,v,d,factor,concentration].every(Number.isFinite)&&m>0&&v>0&&d>=0&&factor>0&&concentration>0&&(!selected[2]||w>0);
 const computed=valid?convertInfusion(d,concentration,factor,reverse):NaN;
 const result=Number.isFinite(computed)?computed:null;
 const fmt=(n:number)=>n===0?"0":Number(n.toPrecision(6)).toString();
 const name=drug==="other"?(other.trim()||"Другой препарат"):(drugs.find(x=>x[0]===drug)?.[1]??"Препарат");
 const amountUnit=activity?"ЕД":"мг",concUnit=activity?"ЕД/мл":"мкг/мл";
 const note=result===null?"":name+": "+fmt(reverse?result:d)+" "+selected[0]+(Number.isFinite(w)&&w>0?"; масса "+w+" кг":"")+"; раствор "+m+" "+amountUnit+"/"+v+" мл ("+fmt(concentration)+" "+concUnit+"); скорость "+fmt(reverse?d:result)+" мл/ч.";
 const update=(fn:(v:string)=>void)=>(value:string)=>{fn(value);setCopied(false);setError(false);};
 const reset=()=>{setAttempted(false);setWeight("");setMg("");setVolume("");setDose("");setOther("");setCopied(false);setError(false);};
 const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все инструменты</button><div className="page-heading"><span className="overline">{infusionMeta.category}</span><h1>{infusionMeta.title}</h1><p className="muted">{infusionMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{infusionMeta.shortTitle}</span><h2>{reverse?"Расчёт дозы":"Расчёт скорости"}</h2></div><div className="score">{result===null?"—":fmt(result)}<small>{reverse?selected[0]:"мл/ч"}</small></div></div>
 <div role="group" aria-label="Режим расчёта" style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[false,true].map(mode=><button key={String(mode)} type="button" aria-pressed={reverse===mode} className={reverse===mode?"copy-button":"back"} onClick={()=>{setReverse(mode);setDose("");setCopied(false);setError(false);}}>{mode?"Расчёт дозы":"Расчёт скорости"}</button>)}</div>
 <p className="disclaimer">{infusionMeta.instruction}</p><div className="gcsgrid">
 <label><span>Препарат</span><select value={drug} onChange={e=>{setDrug(e.target.value);setUnit(e.target.value==="vasopressin"?"ЕД/мин":"мкг/кг/мин");setMg("");setDose("");setCopied(false);setError(false);}}>{drugs.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
 {drug==="other"&&<label><span>Название препарата</span><input value={other} onChange={e=>update(setOther)(e.target.value)}/></label>}
 {selected[2]&&<Field label="Масса тела" issue={validateNumeric(weight,{required:true,min:Number.MIN_VALUE},attempted)} value={weight} onChange={update(setWeight)} unit="кг"/>}
 <Field label="Количество препарата в готовом растворе" issue={validateNumeric(mg,{required:true,min:Number.MIN_VALUE},attempted)} value={mg} onChange={update(setMg)} unit={amountUnit}/>
 <Field label="Конечный объём раствора" issue={validateNumeric(volume,{required:true,min:Number.MIN_VALUE},attempted)} value={volume} onChange={update(setVolume)} unit="мл"/>
 {reverse?<><Field label="Скорость дозатора" issue={validateNumeric(dose,{required:true,min:0},attempted)} value={dose} onChange={update(setDose)} unit="мл/ч"/><label><span>Единицы результата</span><select value={selected[0]} onChange={e=>update(setUnit)(e.target.value)}>{available.map(x=><option key={x[0]}>{x[0]}</option>)}</select></label></>:<Field label="Назначенная доза" value={dose} onChange={update(setDose)} unit={selected[0]} choices={available.map(x=>x[0])} onUnit={u=>{setUnit(u);setDose("");setCopied(false);setError(false);}}/>}</div>
 {result!==null&&<><div className="result"><span>Результат</span><strong>{fmt(result)} {reverse?selected[0]:"мл/ч"} · {fmt(concentration)} {concUnit}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 {result===null&&<p className="muted">Заполните необходимые поля: масса, количество и объём должны быть положительными, доза или скорость — неотрицательной.</p>}
 <button type="button" className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button>
 <button type="button" className="back" onClick={reset}>Сбросить поля</button>
 {error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{infusionMeta.disclaimer}</p><p className="disclaimer">Формула: {infusionMeta.sourceLabel}.</p></section></>;
}
