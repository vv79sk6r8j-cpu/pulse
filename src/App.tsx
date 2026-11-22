import { useState } from "react";
import { Activity, BookOpen, Calculator, ClipboardList, FileText, Search, HeartPulse, House, ArrowUpRight, Menu, X, ChevronRight, ShieldCheck, Clock3 } from "lucide-react";

type Section = "Главная" | "Теория" | "Шкалы и расчёты" | "POCUS" | "Документы" | "Справочники";
const sections = [
  { title: "Теория" as Section, description: "Конспекты, клинические алгоритмы и рекомендации", icon: BookOpen, count: "Библиотека готовится" },
  { title: "Шкалы и расчёты" as Section, description: "Оценка состояния и клинические калькуляторы", icon: Calculator, count: "1 инструмент" },
  { title: "POCUS" as Section, description: "Протоколы ультразвукового обследования", icon: Activity, count: "Скоро" },
  { title: "Документы" as Section, description: "Дневники, консультации и шаблоны", icon: FileText, count: "Скоро" },
  { title: "Справочники" as Section, description: "Краткие справочные материалы", icon: ClipboardList, count: "Скоро" }
];
const navigation = [{title:"Главная" as Section,icon:House},...sections.map(s=>({title:s.title,icon:s.icon}))];
const gcs = [
  { name: "Открывание глаз (E)", values: [["Спонтанное",4],["На обращение",3],["На боль",2],["Отсутствует",1]] },
  { name: "Речевая реакция (V)", values: [["Ориентирован",5],["Спутанная речь",4],["Отдельные слова",3],["Нечленораздельные звуки",2],["Отсутствует",1]] },
  { name: "Двигательная реакция (M)", values: [["Выполняет команды",6],["Локализует боль",5],["Отдёргивает на боль",4],["Патологическое сгибание",3],["Разгибание",2],["Отсутствует",1]] }
] as const;
function Mark({size=36}:{size?:number}) {
 return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#17485A"/><path d="M5 33h10c3 0 3-6 7-6s4 6 8 6h3l3 5 5-24 6 37 5-18h7" stroke="#71DED1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export default function App(){
 const [active,setActive]=useState<Section>("Главная");
 const [query,setQuery]=useState("");
 const [menuOpen,setMenuOpen]=useState(false);
 const [scores,setScores]=useState<[number,number,number]>([4,5,6]);
 const total=scores.reduce((a,b)=>a+b,0);
 const filtered=sections.filter(s=>(s.title+" "+s.description).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")));
 const go=(next:Section)=>{setActive(next);setMenuOpen(false);setQuery("");window.scrollTo({top:0,behavior:"smooth"});};
 return <div className="app">
  {menuOpen&&<button className="scrim" aria-label="Закрыть меню" onClick={()=>setMenuOpen(false)}/>}
  <aside className={"sidebar "+(menuOpen?"open":"")}>
   <div className="brand"><Mark size={44}/><div><strong>PULSE</strong><span>ANAESTHESIA & INTENSIVE CARE</span></div><button className="close-menu" aria-label="Закрыть меню" onClick={()=>setMenuOpen(false)}><X size={20}/></button></div>
   <div className="nav-label">РАЗДЕЛЫ</div>
   <nav aria-label="Основная навигация">{navigation.map(item=><button key={item.title} className={"nav-link "+(active===item.title?"selected":"")} onClick={()=>go(item.title)}><item.icon size={19}/><span>{item.title}</span>{active===item.title&&<span className="nav-dot"/>}</button>)}</nav>
   <div className="sidebar-bottom"><ShieldCheck size={18}/><span>Для медицинских специалистов</span></div>
  </aside>
  <div className="workspace">
   <div className="topbar"><button className="menu-toggle" aria-label="Открыть меню" onClick={()=>setMenuOpen(true)}><Menu size={22}/></button><span className="crumb">PULSE <ChevronRight size={14}/> {active}</span><span className="version">v0.2 · preview</span></div>
   <main>
    <section className="hero"><div><div className="hero-kicker"><span className="status-dot"/> КЛИНИЧЕСКАЯ ПЛАТФОРМА</div><h1>{active==="Главная"?"Знания и инструменты.\nВсегда под рукой.":active}</h1><p>{active==="Главная"?"Единое пространство для анестезиологии и интенсивной терапии. Быстрый доступ к клиническим инструментам и материалам.":"Выберите инструмент или материал для работы. Библиотека PULSE постепенно пополняется."}</p><button className="hero-action" onClick={()=>go("Шкалы и расчёты")}>Открыть калькуляторы <ArrowUpRight size={18}/></button></div><div className="hero-visual"><Mark size={104}/><span>PULSE</span><small>CLINICAL WORKSPACE</small></div></section>
    <div className="section-heading"><div><span className="overline">НАВИГАЦИЯ</span><h2>{active==="Главная"?"Разделы платформы":"Исследуйте PULSE"}</h2></div><span className="muted-label">5 направлений</span></div>
    <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по разделам..." aria-label="Поиск по разделам"/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={17}/></button>}</label>
    <div className="cards">{filtered.map(s=><button key={s.title} className="sectioncard" onClick={()=>go(s.title)}><div className="card-top"><span className="card-icon"><s.icon size={23}/></span><ArrowUpRight size={19}/></div><strong>{s.title}</strong><p>{s.description}</p><span className="card-meta">{s.count}</span></button>)}</div>
    {filtered.length===0&&<div className="empty">По запросу ничего не найдено. Попробуйте другое название.</div>}
    {(active==="Главная"||active==="Шкалы и расчёты")&&<section className="calculator"><div className="calchead"><div><span className="overline">ДОСТУПНЫЙ ИНСТРУМЕНТ</span><h2>Шкала комы Глазго</h2><p className="muted">Glasgow Coma Scale · оценка уровня сознания</p></div><div className="score">{total}<small>/15</small></div></div><div className="gcsgrid">{gcs.map((category,i)=><label key={category.name}><span>{category.name}</span><select value={scores[i]} onChange={e=>setScores(prev=>prev.map((v,j)=>i===j?Number(e.target.value):v) as [number,number,number])}>{category.values.map(([name,value])=><option key={value} value={value}>{value} — {name}</option>)}</select></label>)}</div><div className="result"><span>Результат</span><strong>E{scores[0]} · V{scores[1]} · M{scores[2]} = {total}</strong></div><p className="disclaimer">При интубации, седации и других препятствиях оценке документируйте неоцениваемые компоненты отдельно. Не заменяет клиническую оценку.</p></section>}
    {active!=="Главная"&&active!=="Шкалы и расчёты"&&<div className="coming"><Clock3 size={22}/><div><strong>Раздел в разработке</strong><p>Здесь появятся проверенные материалы с источниками и датой актуализации.</p></div></div>}
    <footer>© PULSE · Информационный инструмент для медицинских специалистов. Не заменяет клиническое решение.</footer>
   </main>
  </div>
  <nav className="mobile-nav" aria-label="Быстрая навигация">{[navigation[0],navigation[2],navigation[3],navigation[4]].map(item=><button key={item.title} className={active===item.title?"selected":""} onClick={()=>go(item.title)}><item.icon size={21}/><span>{item.title==="Шкалы и расчёты"?"Шкалы":item.title}</span></button>)}<button onClick={()=>setMenuOpen(true)}><Menu size={21}/><span>Ещё</span></button></nav>
 </div>;
}