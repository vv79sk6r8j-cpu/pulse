import { useState } from "react";
import { Activity, BookOpen, Calculator, ClipboardList, FileText, Search, House, ArrowUpRight, Menu, X, ChevronRight, ShieldCheck, Copy, Check, ArrowLeft } from "lucide-react";

type Section = "Главная" | "Теория" | "Шкалы и расчёты" | "POCUS" | "Документы" | "Справочники";
type Page = Section | "GCS";
const sections = [
 {title:"Теория" as Section,description:"Конспекты, клинические алгоритмы и рекомендации",icon:BookOpen},
 {title:"Шкалы и расчёты" as Section,description:"Оценка состояния и клинические калькуляторы",icon:Calculator},
 {title:"POCUS" as Section,description:"Протоколы ультразвукового обследования",icon:Activity},
 {title:"Документы" as Section,description:"Дневники, консультации и шаблоны",icon:FileText},
 {title:"Справочники" as Section,description:"Краткие справочные материалы",icon:ClipboardList}
];
const navigation=[{title:"Главная" as Section,icon:House},...sections.map(s=>({title:s.title,icon:s.icon}))];
const gcs=[
 {name:"Открывание глаз (E)",values:[["Спонтанное",4],["На обращение",3],["На боль",2],["Отсутствует",1]]},
 {name:"Речевая реакция (V)",values:[["Ориентирован",5],["Спутанная речь",4],["Отдельные слова",3],["Нечленораздельные звуки",2],["Отсутствует",1]]},
 {name:"Двигательная реакция (M)",values:[["Выполняет команды",6],["Локализует боль",5],["Отдёргивает на боль",4],["Патологическое сгибание",3],["Разгибание",2],["Отсутствует",1]]}
] as const;
function Mark({size=36}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#17485A"/><path d="M5 33h10c3 0 3-6 7-6s4 6 8 6h3l3 5 5-24 6 37 5-18h7" stroke="#71DED1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function interpretation(total:number){if(total===15)return "15 баллов — максимальная оценка по GCS; при отсутствии других нарушений соответствует ясному сознанию.";if(total>=13)return "13–14 баллов — лёгкое снижение оценки по GCS.";if(total>=9)return "9–12 баллов — умеренное нарушение сознания по диапазону GCS.";return "3–8 баллов — тяжёлое нарушение сознания по GCS (диапазон, обычно соответствующий коме).";}
function shortInterpretation(total:number){if(total===15)return "максимальная оценка по GCS (при отсутствии иных нарушений — ясное сознание)";if(total>=13)return "лёгкое снижение оценки по GCS";if(total>=9)return "умеренное нарушение сознания по GCS";return "тяжёлое нарушение сознания по GCS (диапазон 3–8 баллов, кома)";}
export default function App(){
 const [page,setPage]=useState<Page>("Главная");
 const [query,setQuery]=useState("");
 const [menuOpen,setMenuOpen]=useState(false);
 const [scores,setScores]=useState<[number,number,number]>([4,5,6]);
 const [copied,setCopied]=useState(false);
 const [copyError,setCopyError]=useState(false);
 const section:Section=page==="GCS"?"Шкалы и расчёты":page;
 const total=scores.reduce((a,b)=>a+b,0);
 const filtered=sections.filter(s=>(s.title+" "+s.description).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")));
 const scales=[{title:"Шкала комы Глазго (GCS)",description:"Оценка реакции открывания глаз, речевого и двигательного ответа",status:"Доступно"}];
 const filteredScales=scales.filter(s=>(s.title+" "+s.description).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")));
 const go=(next:Page)=>{setPage(next);setMenuOpen(false);setQuery("");setCopied(false);setCopyError(false);window.scrollTo({top:0,behavior:"smooth"});};
 const copyResult=async()=>{const text="По шкале комы Глазго (GCS): E"+scores[0]+"V"+scores[1]+"M"+scores[2]+", "+total+" баллов — "+shortInterpretation(total)+".";try{await navigator.clipboard.writeText(text);setCopied(true);setCopyError(false);}catch{setCopyError(true);setCopied(false);}};
 return <div className="app">
  {menuOpen&&<button className="scrim" aria-label="Закрыть меню" onClick={()=>setMenuOpen(false)}/>}
  <aside className={"sidebar "+(menuOpen?"open":"")}>
   <div className="brand"><Mark size={40}/><div><strong>PULSE</strong><span>ANAESTHESIA & INTENSIVE CARE</span></div><button className="close-menu" aria-label="Закрыть меню" onClick={()=>setMenuOpen(false)}><X size={20}/></button></div>
   <div className="nav-label">РАЗДЕЛЫ</div>
   <nav aria-label="Основная навигация">{navigation.map(item=><button key={item.title} className={"nav-link "+(section===item.title?"selected":"")} onClick={()=>go(item.title)}><item.icon size={19}/><span>{item.title}</span>{section===item.title&&<span className="nav-dot"/>}</button>)}</nav>
   <div className="sidebar-bottom"><ShieldCheck size={18}/><span>Для медицинских специалистов</span></div>
  </aside>
  <div className="workspace">
   <div className="topbar"><button className="menu-toggle" aria-label="Открыть меню" onClick={()=>setMenuOpen(true)}><Menu size={22}/></button><button className="top-mark" aria-label="На главную" onClick={()=>go("Главная")}><Mark size={30}/></button><div className="breadcrumbs"><button onClick={()=>go("Главная")}>Главная</button>{page!=="Главная"&&<><ChevronRight size={14}/><button onClick={()=>go(section)}>{section}</button></>}{page==="GCS"&&<><ChevronRight size={14}/><span>GCS</span></>}</div><span className="version">v0.2 · preview</span></div>
   <main>
    {page==="Главная"&&<>
     <section className="hero"><div><div className="hero-kicker"><span className="status-dot"/> КЛИНИЧЕСКАЯ ПЛАТФОРМА</div><h1>PULSE — знания и инструменты под рукой</h1><p>Рабочее пространство для анестезиологии и интенсивной терапии.</p></div><div className="hero-visual"><Mark size={72}/><span>PULSE</span></div></section>
     <div className="section-heading"><div><span className="overline">НАВИГАЦИЯ</span><h2>Разделы платформы</h2></div><span className="muted-label">5 направлений</span></div>
     <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по разделам..." aria-label="Поиск по разделам"/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={17}/></button>}</label>
     <div className="cards">{filtered.map(s=><button key={s.title} className="sectioncard" onClick={()=>go(s.title)}><div className="card-top"><span className="card-icon"><s.icon size={23}/></span><ArrowUpRight size={19}/></div><strong>{s.title}</strong><p>{s.description}</p><span className="card-meta">{s.title==="Шкалы и расчёты"?"1 инструмент":"Скоро"}</span></button>)}</div>
     {filtered.length===0&&<div className="empty">По запросу ничего не найдено.</div>}
    </>}
    {page!=="Главная"&&<><div className="page-heading"><span className="overline">{page==="GCS"?"КЛИНИЧЕСКИЙ ИНСТРУМЕНТ":"РАЗДЕЛ PULSE"}</span><h1>{page==="GCS"?"Шкала комы Глазго":page}</h1><p className="muted">{page==="GCS"?"Glasgow Coma Scale · оценка уровня сознания":page==="Шкалы и расчёты"?"Клинические шкалы и калькуляторы":"Материалы раздела будут появляться по мере проверки и публикации."}</p></div>
     {page==="Шкалы и расчёты"&&<>
      <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по шкалам..." aria-label="Поиск по шкалам"/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={17}/></button>}</label>
      <div className="tool-list">{filteredScales.map(s=><button className="tool-row" key={s.title} onClick={()=>go("GCS")}><span className="card-icon"><Calculator size={22}/></span><span className="tool-copy"><strong>{s.title}</strong><small>{s.description}</small></span><span className="available">{s.status}</span><ChevronRight size={20}/></button>)}</div>
      {filteredScales.length===0&&<div className="empty">Шкалы по запросу не найдены.</div>}
     </>}
     {page==="GCS"&&<>
      <button className="back" onClick={()=>go("Шкалы и расчёты")}><ArrowLeft size={17}/> Все шкалы</button>
      <section className="calculator"><div className="calchead"><div><span className="overline">GLASGOW COMA SCALE</span><h2>Оценка по трём компонентам</h2></div><div className="score">{total}<small>/15</small></div></div>
       <div className="gcsgrid">{gcs.map((category,i)=><label key={category.name}><span>{category.name}</span><select value={scores[i]} onChange={e=>{setScores(prev=>prev.map((v,j)=>i===j?Number(e.target.value):v) as [number,number,number]);setCopied(false);setCopyError(false);}}>{category.values.map(([name,value])=><option key={value} value={value}>{value} — {name}</option>)}</select></label>)}</div>
       <div className="result"><span>Результат</span><strong>E{scores[0]} · V{scores[1]} · M{scores[2]} = {total} баллов</strong></div>
       <div className="interpretation"><span className="overline">ИНТЕРПРЕТАЦИЯ</span><p>{interpretation(total)}</p></div>
       <button className="copy-button" onClick={copyResult}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button>
       {copyError&&<p role="alert" className="copy-error">Не удалось скопировать текст. Проверьте разрешение доступа к буферу обмена.</p>}
       <p className="disclaimer">Интерпретация по сумме GCS ориентировочная и не является самостоятельным диагнозом или точной классификацией глубины комы. При интубации, седации и других препятствиях оценке документируйте неоцениваемые компоненты отдельно; не подставляйте за них минимальные баллы.</p>
      </section>
     </>}
     {page!=="Шкалы и расчёты"&&page!=="GCS"&&<div className="coming"><div className="card-icon"><BookOpen size={20}/></div><div><strong>Материалы готовятся</strong><p>В этом разделе появятся проверенные материалы с источниками и датой актуализации.</p></div></div>}
    </>}
    <footer>© PULSE · Справочный инструмент для медицинских специалистов. Не заменяет клиническое решение.</footer>
   </main>
  </div>
  <nav className="mobile-nav" aria-label="Быстрая навигация">{[navigation[0],navigation[2],navigation[3],navigation[4]].map(item=><button key={item.title} className={section===item.title?"selected":""} onClick={()=>go(item.title)}><item.icon size={21}/><span>{item.title==="Шкалы и расчёты"?"Шкалы":item.title}</span></button>)}<button className={menuOpen?"selected":""} onClick={()=>setMenuOpen(true)}><Menu size={21}/><span>Ещё</span></button></nav>
 </div>;
}