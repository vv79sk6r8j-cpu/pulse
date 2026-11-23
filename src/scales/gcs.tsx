import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";

export const gcsMeta = {
 category: "КЛИНИЧЕСКАЯ ШКАЛА",
 title: "Шкала комы Глазго",
 subtitle: "Glasgow Coma Scale · оценка уровня сознания",
 shortTitle: "GCS",
 cardTitle: "Оценка по трём компонентам",
 catalogDescription: "Оценка реакции открывания глаз, речевого и двигательного ответа",
 instruction: "Оцените открывание глаз, речевую и двигательную реакции.",
 disclaimer: "Интерпретация по сумме GCS ориентировочная и не является самостоятельным диагнозом или точной классификацией глубины комы. При интубации, седации и других препятствиях оценке документируйте неоцениваемые компоненты отдельно; не подставляйте за них минимальные баллы.",
 sourceLabel: "Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet. 1974.",
 sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/4136544/"
} as const;

const gcs=[
 {name:"Открывание глаз (E)",values:[["Спонтанное",4],["На обращение",3],["На боль",2],["Отсутствует",1]]},
 {name:"Речевая реакция (V)",values:[["Ориентирован",5],["Спутанная речь",4],["Отдельные слова",3],["Нечленораздельные звуки",2],["Отсутствует",1]]},
 {name:"Двигательная реакция (M)",values:[["Выполняет команды",6],["Локализует боль",5],["Отдёргивает на боль",4],["Патологическое сгибание",3],["Разгибание",2],["Отсутствует",1]]}
] as const;
function shortInterpretation(total:number){if(total===15)return "ясное сознание";if(total>=13)return "умеренное оглушение";if(total>=10)return "глубокое оглушение";if(total>=8)return "сопор";if(total>=6)return "умеренная кома";if(total>=4)return "глубокая кома";return "запредельная кома";}
function interpretation(total:number){return shortInterpretation(total);}
export default function GcsTool({onBack}:{onBack:()=>void}){
 const [scores,setScores]=useState<[number,number,number]>([4,5,6]);
 const [copied,setCopied]=useState(false);
 const [copyError,setCopyError]=useState(false);
 const total=scores.reduce((a,b)=>a+b,0);
 const copyResult=async()=>{const text="По шкале комы Глазго (GCS): E"+scores[0]+"V"+scores[1]+"M"+scores[2]+", "+total+" баллов — "+shortInterpretation(total)+".";try{await navigator.clipboard.writeText(text);setCopied(true);setCopyError(false);}catch{setCopyError(true);setCopied(false);}};
 return      <>
      <div className="page-heading"><span className="overline">{gcsMeta.category}</span><h1>{gcsMeta.title}</h1><p className="muted">{gcsMeta.subtitle}</p></div>
      <button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button>
      <section className="calculator"><div className="calchead"><div><span className="overline">GLASGOW COMA SCALE</span><h2>{gcsMeta.cardTitle}</h2></div><div className="score">{total}<small>/15</small></div></div>
       <div className="gcsgrid">{gcs.map((category,i)=><label key={category.name}><span>{category.name}</span><select value={scores[i]} onChange={e=>{setScores(prev=>prev.map((v,j)=>i===j?Number(e.target.value):v) as [number,number,number]);setCopied(false);setCopyError(false);}}>{category.values.map(([name,value])=><option key={value} value={value}>{value} — {name}</option>)}</select></label>)}</div>
       <div className="result"><span>Результат</span><strong>E{scores[0]} · V{scores[1]} · M{scores[2]} = {total} баллов</strong></div>
       <div className="interpretation"><span className="overline">ИНТЕРПРЕТАЦИЯ</span><p>{interpretation(total)}</p></div>
       <button className="copy-button" onClick={copyResult}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button>
       {copyError&&<p role="alert" className="copy-error">Не удалось скопировать текст. Проверьте разрешение доступа к буферу обмена.</p>}
       <p className="disclaimer">{gcsMeta.disclaimer}</p>
       <p className="disclaimer">Источник: <a href={gcsMeta.sourceUrl} target="_blank" rel="noopener noreferrer">{gcsMeta.sourceLabel}</a></p>
      </section>
     </>;
}
