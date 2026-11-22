import { useState } from "react";
import { Activity, BookOpen, Calculator, ClipboardList, FileText, Search, Stethoscope, HeartPulse } from "lucide-react";

const sections = [
  { title: "Теория", desc: "Клинические материалы и алгоритмы", icon: BookOpen },
  { title: "Шкалы и расчёты", desc: "Калькуляторы для практики", icon: Calculator },
  { title: "POCUS", desc: "Протоколы ультразвуковой диагностики", icon: Activity },
  { title: "Документы", desc: "Шаблоны и протоколы", icon: FileText },
  { title: "Справочники", desc: "Быстрый доступ к информации", icon: ClipboardList },
];
const gcs = [
  { name: "Открывание глаз (E)", values: [["Спонтанное",4],["На обращение",3],["На боль",2],["Отсутствует",1]] },
  { name: "Речевая реакция (V)", values: [["Ориентирован",5],["Спутанная речь",4],["Отдельные слова",3],["Нечленораздельные звуки",2],["Отсутствует",1]] },
  { name: "Двигательная реакция (M)", values: [["Выполняет команды",6],["Локализует боль",5],["Отдёргивает на боль",4],["Патологическое сгибание",3],["Разгибание",2],["Отсутствует",1]] },
] as const;
export default function App() {
  const [query,setQuery] = useState("");
  const [active,setActive] = useState("Главная");
  const [scores,setScores] = useState<[number,number,number]>([4,5,6]);
  const total=scores.reduce((a,b)=>a+b,0);
  return <div className="app">
    <aside className="sidebar"><div className="brand"><HeartPulse size={32}/><span>PULSE</span></div><p className="tagline">ANAESTHESIA & INTENSIVE CARE</p>
      <nav><button className={active==="Главная"?"selected":""} onClick={()=>setActive("Главная")}>Главная</button>{sections.map(s=><button key={s.title} className={active===s.title?"selected":""} onClick={()=>setActive(s.title)}><s.icon size={19}/>{s.title}</button>)}</nav>
      <p className="sidefoot">Клинический справочник • MVP 0.1</p>
    </aside>
    <main><header><div><p className="eyebrow">PULSE / {active}</p><h1>{active==="Главная"?"Рабочее пространство врача":active}</h1><p className="muted">Анестезиология и интенсивная терапия — всё необходимое под рукой.</p></div><Stethoscope className="headericon" size={38}/></header>
      <div className="search"><Search size={19}/><input aria-label="Поиск по разделам" placeholder="Найти раздел..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <div className="cards">{sections.filter(s=>s.title.toLowerCase().includes(query.toLowerCase())||s.desc.toLowerCase().includes(query.toLowerCase())).map(s=><button key={s.title} className="sectioncard" onClick={()=>setActive(s.title)}><s.icon size={26}/><strong>{s.title}</strong><span>{s.desc}</span></button>)}</div>
      {(active==="Главная"||active==="Шкалы и расчёты")&&<section className="calculator"><div className="calchead"><div><p className="eyebrow">КЛИНИЧЕСКИЙ ИНСТРУМЕНТ</p><h2>Шкала комы Глазго (GCS)</h2></div><div className="score">{total}<small>/ 15</small></div></div><p className="muted">Выберите лучший наблюдаемый ответ в каждой категории.</p><div className="gcsgrid">{gcs.map((category,i)=><label key={category.name}><span>{category.name}</span><select value={scores[i]} onChange={e=>setScores(prev=>prev.map((v,j)=>i===j?Number(e.target.value):v) as [number,number,number])}>{category.values.map(([name,value])=><option key={value} value={value}>{value} — {name}</option>)}</select></label>)}</div><p className="result">E{scores[0]} V{scores[1]} M{scores[2]} = <strong>{total} баллов</strong></p><p className="disclaimer">Важно: при интубации, седации и других препятствиях оценке необходимо документировать неоцениваемые компоненты отдельно. Инструмент не заменяет клиническое решение.</p></section>}
      <footer>Материалы носят справочный характер. Проверяйте актуальные клинические рекомендации.</footer>
    </main></div>;
}
