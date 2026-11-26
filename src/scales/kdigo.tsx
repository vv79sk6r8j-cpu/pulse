import {useState} from "react";
import {ArrowLeft} from "lucide-react";
import {UnitFieldFrame,UnitSuffix,numericInputStyle,unitSelectStyle,parseDecimal,validateNumeric,FieldFeedback} from "../components/NumericInputWithUnit";
export const kdigoMeta={validation:{c:{min:Number.MIN_VALUE},b48:{min:Number.MIN_VALUE},b7:{min:Number.MIN_VALUE},w:{min:Number.MIN_VALUE},vol:{min:0},h:{min:Number.MIN_VALUE}},catalogDescription:"ОПП: динамика креатинина, диурез, ЗПТ (KDIGO 2012)"};
export function stageAKI(c:number,b48:number,b7:number,rate:number,h:number,rrt:boolean){
 const ratios=[b48,b7].filter(b=>Number.isFinite(b)&&b>0).map(b=>c/b);
 const ratio=ratios.length?Math.max(...ratios):NaN;
 const rise=b48>0&&c-b48>=26.5-1e-8;
 const acute=rise||ratio>=1.5;
 const cr=acute?(ratio>=3||c>=353.6?3:ratio>=2?2:1):0;
 const urine=rate>=0&&h>=6?(rate===0&&h>=12||rate<0.3&&h>=24?3:rate<0.5&&h>=12?2:rate<0.5?1:0):0;
 return {cr,urine,ratio,rise,stage:Math.max(cr,urine,rrt?3:0)};
}
export default function KdigoTool({onBack}:{onBack:()=>void}){
 const [v,setV]=useState<Record<string,string>>({}),[unit,setUnit]=useState("мкмоль/л"),[rrt,setRrt]=useState(""),[status,setStatus]=useState("");
 const n=(k:string)=>parseDecimal(v[k]??"");
 const factor=unit==="мг/дл"?88.4:1;
 const c=n("c")*factor,b48=n("b48")*factor,b7=n("b7")*factor,w=n("w"),vol=n("vol"),h=n("h");
 const rate=w>0&&vol>=0&&h>0?vol/w/h:NaN;
 const invalid=Object.entries(kdigoMeta.validation).some(([k,rule])=>validateNumeric(v[k]??'',rule,true)?.kind==='error');
 const r=stageAKI(c,b48,b7,rate,h,rrt==="yes");
 const complete=c>0&&b48>0&&b7>0&&Number.isFinite(rate)&&h>=24&&rrt!=="";
 const triggers=[r.rise?"Прирост креатинина ≥26,5 мкмоль/л за 48 ч":null,r.ratio>=1.5?"Креатинин ≥"+(r.ratio>=3?"3":r.ratio>=2?"2":"1,5")+" исходного уровня за 7 суток":null,r.cr===3&&c>=353.6?"Креатинин ≥353,6 мкмоль/л при остром повышении":null,r.urine?(rate===0&&h>=12?"Анурия ≥12 ч":r.urine===3?"Диурез <0,3 мл/кг/ч ≥24 ч":r.urine===2?"Диурез <0,5 мл/кг/ч ≥12 ч":"Диурез <0,5 мл/кг/ч ≥6 ч"):null,rrt==="yes"?"Начата ЗПТ по поводу ОПП":null].filter(Boolean).join("; ");
 const result=r.stage?"ОПП, стадия "+r.stage+(complete||r.stage===3?"":" (не менее)"):complete?"По введённым значениям критерии ОПП не выявлены; ОПП не исключено, оцените динамику и отдельные интервалы диуреза":"Недостаточно данных для исключения ОПП";
 const note=result+"; креатинин текущий / 48 ч / 7 сут: "+["c","b48","b7"].map(k=>v[k]||"нет данных").join(" / ")+" "+unit+"; диурез: "+(Number.isFinite(rate)?rate.toFixed(3)+" мл/кг/ч за "+h+" ч":"нет данных")+"; ЗПТ по поводу ОПП: "+(rrt==="yes"?"да":rrt==="no"?"нет":"неизвестно")+"; критерии: "+(triggers||"не выявлены по доступным данным")+". KDIGO 2012.";
 const [attempted,setAttempted]=useState(false);
 const field=(k:string,label:string,u:string,creat=false)=>{const issue=validateNumeric(v[k]??"",kdigoMeta.validation[k as keyof typeof kdigoMeta.validation],attempted);return <label key={k}><span>{label}</span><UnitFieldFrame issue={issue}><input aria-invalid={issue?.kind==="error"} aria-label={label} inputMode="decimal" style={numericInputStyle} value={v[k]??""} onChange={e=>{setV(p=>({...p,[k]:e.target.value}));setStatus("");}}/>{creat?<select aria-label="Единицы креатинина" style={unitSelectStyle} value={unit} onChange={e=>{setUnit(e.target.value);setV(p=>({...p,c:"",b48:"",b7:""}));setStatus("");}}><option>мкмоль/л</option><option>мг/дл</option></select>:<UnitSuffix>{u}</UnitSuffix>}</UnitFieldFrame><FieldFeedback issue={issue}/></label>;};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все инструменты</button><div className="page-heading"><h1>Острое повреждение почек (KDIGO)</h1><p>Взрослые пациенты · KDIGO 2012</p></div><section className="calculator"><p className="disclaimer">Введите известные значения. Исходный креатинин за 7 суток должен отражать исходный уровень при установленном или предполагаемом остром повышении. Диурез оценивается за непрерывный интервал; проверьте также более короткие интервалы отдельно.</p><div className="gcsgrid">{field("c","Текущий креатинин",unit,true)}{field("b48","Креатинин за предыдущие 48 ч",unit,true)}{field("b7","Исходный креатинин (до 7 суток)",unit,true)}{field("w","Масса тела","кг")}{field("vol","Объём мочи","мл")}{field("h","Интервал диуреза","ч")}<label><span>Начата ЗПТ по поводу ОПП</span><select value={rrt} onChange={e=>{setRrt(e.target.value);setStatus("");}}><option value="">Неизвестно</option><option value="yes">Да</option><option value="no">Нет</option></select></label></div>{invalid?<p role="alert">Проверьте числовые значения.</p>:<><div className="result"><strong>{result}</strong></div>{triggers&&<p>{triggers}</p>}<p>{Number.isFinite(rate)?"Диурез: "+rate.toFixed(3)+" мл/кг/ч. ":""}{r.cr?"Креатинин: стадия "+r.cr+". ":""}{r.urine?"Диурез: стадия "+r.urine+". ":""}{rrt==="yes"?"ЗПТ: стадия 3.":""}</p><button className="copy-button" onClick={async()=>{try{await navigator.clipboard.writeText(note);setStatus("Скопировано");}catch{setStatus("Ошибка копирования");}}}>Копировать результат</button></>}<button className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button><button className="back" onClick={()=>{setAttempted(false);setV({});setRrt("");setStatus("");}}>Сбросить поля</button><p role="status">{status}</p><p className="disclaimer">Не исключает ОПП при неполных данных. Не предназначен для детей или оценки показаний к ЗПТ. <a href="https://kdigo.org/guidelines/acute-kidney-injury/" target="_blank" rel="noreferrer">Источник: KDIGO AKI 2012, таблица 2.</a></p></section></>;
}
