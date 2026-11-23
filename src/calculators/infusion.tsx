import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const infusionMeta={
 category:"КЛИНИЧЕСКИЙ КАЛЬКУЛЯТОР",
 title:"Скорость инфузии вазоактивных препаратов",
 subtitle:"Норадреналин · Адреналин · Допамин · Универсальный режим",
 shortTitle:"ИНФУЗИЯ",
 cardTitle:"Расчёт скорости шприцевого дозатора",
 instruction:"Введите фактическое количество действующего вещества в готовом растворе, конечный объём, массу тела и назначенную дозу. Калькулятор не предлагает лечебную дозу или схему разведения.",
 catalogDescription:"Перевод назначенной дозы норадреналина, адреналина и допамина в мл/ч",
 disclaimer:"Высокорисковые препараты: независимо проверьте назначение, массу тела, конечную концентрацию, единицы и скорость дозатора по локальному протоколу. Учитывайте различия маркировки основания и солей. Этот инструмент не рекомендует дозировки и не проверяет совместимость растворов.",
 sourceLabel:"Размерностный расчёт: мкг/кг/мин × кг × 60 мин/ч ÷ (мкг/мл)",
 sourceUrl:""
} as const;
const drugs=[["norepi","Норадреналин"],["epi","Адреналин"],["dopamine","Допамин"],["other","Другой препарат"]] as const;
export function infusionRate(doseMcgKgMin:number,weightKg:number,drugMg:number,volumeMl:number):number{
 return doseMcgKgMin*weightKg*60*volumeMl/(drugMg*1000);
}
export default function InfusionTool({onBack}:{onBack:()=>void}){
 const [drug,setDrug]=useState("norepi"),[weight,setWeight]=useState(""),[mg,setMg]=useState(""),[volume,setVolume]=useState(""),[dose,setDose]=useState(""),[copied,setCopied]=useState(false),[error,setError]=useState(false);
 const w=Number(weight),m=Number(mg),v=Number(volume),d=Number(dose);
 const valid=weight!==""&&mg!==""&&volume!==""&&dose!==""&&[w,m,v,d].every(Number.isFinite)&&w>0&&w<=500&&m>0&&m<=10000&&v>0&&v<=2000&&d>=0&&d<=1000;
 const rate=valid?infusionRate(d,w,m,v):null;
 const concentration=valid?m*1000/v:null;
 const name=drugs.find(x=>x[0]===drug)?.[1]??"Препарат";
 const note=rate===null?"":`${name}: ${d} мкг/кг/мин при массе ${w} кг; раствор ${m} мг/${v} мл (${concentration!.toFixed(2)} мкг/мл); скорость ${rate.toFixed(2)} мл/ч.`;
 const copy=async()=>{try{await navigator.clipboard.writeText(note);setCopied(true);setError(false);}catch{setError(true);}};
 const update=(fn:(v:string)=>void)=>(v:string)=>{fn(v);setCopied(false);};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все инструменты</button><div className="page-heading"><span className="overline">{infusionMeta.category}</span><h1>{infusionMeta.title}</h1><p className="muted">{infusionMeta.subtitle}</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">{infusionMeta.shortTitle}</span><h2>{infusionMeta.cardTitle}</h2></div><div className="score">{rate===null?"—":rate.toFixed(2)}<small>мл/ч</small></div></div>
 <p className="disclaimer">{infusionMeta.instruction}</p><div className="gcsgrid">
 <label><span>Препарат</span><select value={drug} onChange={e=>setDrug(e.target.value)}>{drugs.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
 <label><span>Масса тела, кг</span><input type="number" min="0" step="0.1" inputMode="decimal" value={weight} onChange={e=>update(setWeight)(e.target.value)} placeholder="Например, 70"/></label>
 <label><span>Количество препарата в готовом растворе, мг</span><input type="number" min="0" step="any" inputMode="decimal" value={mg} onChange={e=>update(setMg)(e.target.value)} placeholder="Введите фактическое значение"/></label>
 <label><span>Конечный объём раствора, мл</span><input type="number" min="0" step="any" inputMode="decimal" value={volume} onChange={e=>update(setVolume)(e.target.value)} placeholder="Например, 50"/></label>
 <label><span>Назначенная доза, мкг/кг/мин</span><input type="number" min="0" step="any" inputMode="decimal" value={dose} onChange={e=>update(setDose)(e.target.value)} placeholder="Введите назначенную дозу"/></label></div>
 {rate!==null&&<><div className="result"><span>Результат</span><strong>{rate.toFixed(2)} мл/ч · {concentration!.toFixed(2)} мкг/мл</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
 {error&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
 <p className="disclaimer">{infusionMeta.disclaimer}</p><p className="disclaimer">Формула: {infusionMeta.sourceLabel}.</p></section></>;
}
