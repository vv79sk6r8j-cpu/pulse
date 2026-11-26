import KdigoTool, { kdigoMeta } from "./scales/kdigo";
import EarlyScaleTool from "./scales/ScaleTool";
import GcsTool, { gcsMeta } from "./scales/gcs";
import { rassMeta } from "./scales/rass";
import { qsofaMeta } from "./scales/qsofa";
import AsaTool, { asaMeta } from "./scales/asa";
import FourTool, { fourMeta } from "./scales/four";
import SofaTool, { sofaMeta } from "./scales/sofa";
import IbwTool, { ibwMeta } from "./calculators/ibw";
import RenalTool, { renalMeta } from "./calculators/renal";
import InfusionTool, { infusionMeta } from "./calculators/infusion";
import DocumentViewer, { documentTemplates } from "./documents/DocumentViewer";
import PeArticle from "./PeArticle";
import { useState } from "react";
import { BookOpen, Calculator, ClipboardList, FileText, Search, House, ArrowUpRight, Menu, X, ChevronRight, ShieldCheck, Copy, Check, ArrowLeft, MessageSquareWarning, Send, ExternalLink } from "lucide-react";

type Section = "Главная" | "Теория" | "Шкалы и расчёты" | "POCUS" | "Документы" | "Справочники";
type Page = Section | "GCS" | "RASS" | "qSOFA" | "ASA" | "FOUR" | "SOFA" | "IBW" | "Renal" | "Infusion" | "KDIGO" | "preoperative-questionnaire" | "patient-memos" | "Feedback" | "PE";
function PocusIcon({size=24}:{size?:number|string}){return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 25Q32 17 43 25L42 33Q41 38 37 42L36 54Q32 59 28 54L27 42Q23 38 22 33Z"/><path d="M21.5 29Q32 22 42.5 29"/><path d="M32 44V49"/><path d="M32 56C32 65 15 61 15 52V46"/><path d="M18 18L11 7Q32 -2 53 7L46 18"/><path d="M24 11Q32 6 40 11"/><path d="M28 16Q32 13 36 16"/></svg>}

const sections = [
 {title:"Теория" as Section,description:"Конспекты, клинические алгоритмы и рекомендации",icon:BookOpen},
 {title:"Шкалы и расчёты" as Section,description:"Оценка состояния и клинические калькуляторы",icon:Calculator},
 {title:"POCUS" as Section,description:"Протоколы ультразвукового обследования",icon:PocusIcon},
 {title:"Документы" as Section,description:"Дневники, консультации и шаблоны",icon:FileText},
 {title:"Справочники" as Section,description:"Краткие справочные материалы",icon:ClipboardList}
];
const navigation=[{title:"Главная" as Section,icon:House},...sections.map(s=>({title:s.title,icon:s.icon}))];

function Mark({size=36}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#17485A"/><path d="M5 33h10c3 0 3-6 7-6s4 6 8 6h3l3 5 5-24 6 37 5-18h7" stroke="#71DED1" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}

export default function App(){
 const [page,setPage]=useState<Page>("Главная");
 const [query,setQuery]=useState("");
 const [menuOpen,setMenuOpen]=useState(false);
 const [feedbackTitle,setFeedbackTitle]=useState("");
 const [feedbackDescription,setFeedbackDescription]=useState("");
 const [feedbackContact,setFeedbackContact]=useState("");
 const [feedbackState,setFeedbackState]=useState<"idle"|"sending"|"success"|"error">("idle");
 const section:Section=(page==="GCS"||page==="RASS"||page==="qSOFA"||page==="ASA"||page==="FOUR"||page==="SOFA"||page==="IBW"||page==="Renal"||page==="Infusion"||page==="KDIGO")?"Шкалы и расчёты":page==="PE"?"Теория":page==="Feedback"?"Главная":(page==="preoperative-questionnaire"||page==="patient-memos")?"Документы":page;
 const filtered=sections.filter(s=>(s.title+" "+s.description).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")));
 const articles=[{title:"Тромбоэмболия лёгочной артерии (ТЭЛА)",description:"Диагностика, оценка риска, антикоагуляция и реперфузионная терапия",keywords:"ТЭЛА тромбоэмболия легочной артерии PE PESI Wells Geneva"}];
 const filteredArticles=articles.filter(a=>(a.title+" "+a.description+" "+a.keywords).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")));
 const scales=[{title:"Шкала комы Глазго (GCS)",description:gcsMeta.catalogDescription,status:"Доступно",page:"GCS" as Page},{title:"RASS",description:rassMeta.catalogDescription,status:"Доступно",page:"RASS" as Page},{title:"qSOFA",description:qsofaMeta.catalogDescription,status:"Доступно",page:"qSOFA" as Page},{title:"ASA PS",description:asaMeta.catalogDescription,status:"Доступно",page:"ASA" as Page},{title:"FOUR",description:fourMeta.catalogDescription,status:"Доступно",page:"FOUR" as Page},{title:"SOFA",description:sofaMeta.catalogDescription,status:"Доступно",page:"SOFA" as Page},{title:"Идеальная масса тела (IBW)",description:ibwMeta.catalogDescription,status:"Доступно",page:"IBW" as Page},{title:"Функция почек",description:renalMeta.catalogDescription,status:"Доступно",page:"Renal" as Page},{title:"Скорость инфузии",description:infusionMeta.catalogDescription,status:"Доступно",page:"Infusion" as Page},{title:"Острое повреждение почек (KDIGO)",description:kdigoMeta.catalogDescription,status:"Доступно",page:"KDIGO" as Page}];
 const filteredScales=scales.filter(s=>(s.title+" "+s.description).toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru")));
 const go=(next:Page)=>{setPage(next);setMenuOpen(false);setQuery("");window.scrollTo({top:0,behavior:"smooth"});};
 const submitFeedback=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();if(!feedbackTitle.trim()||!feedbackDescription.trim())return;const endpoint="https://pulse-feedback.s78cj9knjj.workers.dev";if(!endpoint){setFeedbackState("error");return;}setFeedbackState("sending");try{const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:feedbackTitle.trim(),description:feedbackDescription.trim(),contact:feedbackContact.trim(),page:window.location.href})});if(!response.ok)throw Error("Feedback unavailable");setFeedbackState("success");setFeedbackTitle("");setFeedbackDescription("");setFeedbackContact("");}catch{setFeedbackState("error");}};

 return <div className="app">
  {menuOpen&&<button className="scrim" aria-label="Закрыть меню" onClick={()=>setMenuOpen(false)}/>}
  <aside className={"sidebar "+(menuOpen?"open":"")}>
   <div className="brand"><svg className="sidebar-wordmark" viewBox="0 0 238 55" role="img" aria-label="PULSE — ANAESTHESIA & INTENSIVE CARE"><path d="M2 29 H12 Q16 29 18 25 Q22 18 26 29 H32 L37 35 L43 8 L50 47 L56 29 H66 Q70 29 74 24 Q78 20 82 29 H88" fill="none" stroke="#71DED1" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"/><text x="98" y="31" fill="#FFFFFF" fontSize="28" fontWeight="750" letterSpacing="2.3">PULSE</text><text x="99" y="45" fill="#91B7C2" fontSize="7.1" letterSpacing=".62">ANAESTHESIA &amp; INTENSIVE CARE</text></svg><button className="close-menu" aria-label="Закрыть меню" onClick={()=>setMenuOpen(false)}><X size={20}/></button></div>
   <div className="nav-label">РАЗДЕЛЫ</div>
   <nav aria-label="Основная навигация">{navigation.map(item=><button key={item.title} className={"nav-link "+(section===item.title?"selected":"")} onClick={()=>go(item.title)}><item.icon size={19}/><span>{item.title}</span>{section===item.title&&<span className="nav-dot"/>}</button>)}</nav>
   <div className="sidebar-bottom"><button className="nav-link" onClick={()=>go("Feedback")}><MessageSquareWarning size={18}/> Сообщить об ошибке</button><a href="https://t.me/a_alenchyk" target="_blank" rel="noopener noreferrer" className="sidebar-contact"><Send size={17}/> Контакты · Telegram <ExternalLink size={14}/></a><div className="sidebar-note"><ShieldCheck size={16}/> Для медицинских специалистов</div></div>
  </aside>
  <div className="workspace">
   <div className="topbar"><button className="menu-toggle" aria-label="Открыть меню" onClick={()=>setMenuOpen(true)}><Menu size={22}/></button><button className="top-mark" aria-label="На главную" onClick={()=>go("Главная")}><Mark size={30}/></button><div className="breadcrumbs"><button onClick={()=>go("Главная")}>Главная</button>{page!=="Главная"&&<><ChevronRight size={14}/><button onClick={()=>go(section)}>{section}</button></>}{(page==="GCS"||page==="RASS"||page==="qSOFA"||page==="ASA"||page==="FOUR"||page==="SOFA"||page==="IBW"||page==="Renal"||page==="Infusion"||page==="KDIGO")&&<><ChevronRight size={14}/><span>{page}</span></>}{page==="PE"&&<><ChevronRight size={14}/><span>ТЭЛА</span></>}{(page==="preoperative-questionnaire"||page==="patient-memos")&&<><ChevronRight size={14}/><span>{page==="preoperative-questionnaire"?"Анкета":"Памятки"}</span></>}</div><span className="version">v0.4 · dev</span></div>
   <main>
    {page==="Главная"&&<>
     <section className="hero"><div><div className="hero-kicker"><span className="status-dot"/> КЛИНИЧЕСКАЯ ПЛАТФОРМА</div><h1>PULSE — знания и инструменты под рукой</h1><p>Рабочее пространство для анестезиологии и интенсивной терапии.</p></div><div className="hero-visual"><Mark size={72}/><span>PULSE</span></div></section>
     <div className="section-heading"><div><span className="overline">НАВИГАЦИЯ</span><h2>Разделы платформы</h2></div><span className="muted-label">5 направлений</span></div>
     <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по разделам..." aria-label="Поиск по разделам"/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={17}/></button>}</label>
     <div className="cards">{filtered.map(s=>{const ready=s.title==="Шкалы и расчёты"||s.title==="Теория"||s.title==="Документы";return <button key={s.title} className={"sectioncard "+(ready?"sectioncard-ready":"sectioncard-soon")} onClick={()=>go(s.title)}><div className="card-top"><span className="card-icon"><s.icon size={23}/></span><ArrowUpRight size={19}/></div><strong>{s.title}</strong><p>{s.description}</p><span className={"card-status "+(ready?"card-status-ready":"card-status-soon")}><span className="status-indicator"/>{ready?(s.title==="Теория"?"Доступно · 1 статья":s.title==="Документы"?"Доступно · 2 шаблона":"Доступно · 10 инструментов"):"Скоро"}</span></button>})}</div>
     {filtered.length===0&&<div className="empty">По запросу ничего не найдено.</div>}
    </>}
    {page==="Feedback"&&<><div className="page-heading"><span className="overline">ОБРАТНАЯ СВЯЗЬ</span><h1>Сообщить об ошибке</h1><p className="muted">Опишите неточность в расчёте, тексте или работе сайта. Не отправляйте персональные данные пациентов.</p></div><form className="feedback-form" onSubmit={submitFeedback}><label>Краткий заголовок<input required maxLength={120} value={feedbackTitle} onChange={e=>{setFeedbackTitle(e.target.value);setFeedbackState("idle")}} placeholder="Например: Ошибка в шкале GCS"/></label><label>Описание<textarea required rows={6} maxLength={4000} value={feedbackDescription} onChange={e=>{setFeedbackDescription(e.target.value);setFeedbackState("idle")}} placeholder="Что произошло и как воспроизвести ошибку?"/></label><label>Контакты (необязательно)<input maxLength={200} value={feedbackContact} onChange={e=>{setFeedbackContact(e.target.value);setFeedbackState("idle")}} placeholder="Telegram или email"/></label><p className="disclaimer">Заголовок и описание могут быть опубликованы в открытом репозитории PULSE. Контакты передаются только для уведомления владельца через Telegram и не сохраняются в GitHub. Не указывайте персональные или медицинские данные третьих лиц.</p><button className="copy-button" disabled={feedbackState==="sending"} type="submit"><Send size={18}/>{feedbackState==="sending"?"Отправка…":"Отправить"}</button>{feedbackState==="success"&&<p role="status" className="feedback-success">Сообщение отправлено. Спасибо!</p>}{feedbackState==="error"&&<p role="alert" className="copy-error">Не удалось отправить сообщение. Форма пока не подключена к серверу или сервис временно недоступен. Попробуйте связаться через Telegram.</p>}</form></>}
    {page!=="Главная"&&page!=="Feedback"&&page!=="PE"&&<>{page!=="GCS"&&page!=="RASS"&&page!=="qSOFA"&&page!=="ASA"&&page!=="FOUR"&&page!=="SOFA"&&page!=="IBW"&&page!=="Renal"&&page!=="Infusion"&&page!=="KDIGO"&&page!=="preoperative-questionnaire"&&page!=="patient-memos"&&<div className="page-heading"><span className="overline">РАЗДЕЛ PULSE</span><h1>{page}</h1><p className="muted">{page==="Шкалы и расчёты"?"Клинические шкалы и калькуляторы":page==="Теория"?"Статьи и учебно-справочные материалы с обязательным указанием источника.":"Материалы раздела будут появляться по мере проверки и публикации."}</p></div>}
     {page==="Теория"&&<><label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по статьям..." aria-label="Поиск по статьям"/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={17}/></button>}</label><div className="tool-list">{filteredArticles.map(a=><button className="tool-row" key={a.title} onClick={()=>go("PE")}><span className="card-icon"><BookOpen size={22}/></span><span className="tool-copy"><strong>{a.title}</strong><small>{a.description}</small></span><ChevronRight size={20}/></button>)}</div>{filteredArticles.length===0&&<div className="empty">Статьи по запросу не найдены.</div>}</>}
     {page==="Документы"&&<div className="tool-list">{documentTemplates.map(d=><button className="tool-row" key={d.id} onClick={()=>go(d.id)}><span className="card-icon"><FileText size={22}/></span><span className="tool-copy"><strong>{d.title}</strong><small>PDF · скачать документ</small></span><ChevronRight size={20}/></button>)}</div>}
     {(page==="preoperative-questionnaire"||page==="patient-memos")&&<DocumentViewer id={page} onBack={()=>go("Документы")}/>}
     {page==="Шкалы и расчёты"&&<>
      <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по шкалам..." aria-label="Поиск по шкалам"/>{query&&<button aria-label="Очистить поиск" onClick={()=>setQuery("")}><X size={17}/></button>}</label>
      <div className="tool-list">{filteredScales.map(s=><button className="tool-row" key={s.title} onClick={()=>go(s.page)}><span className="card-icon"><Calculator size={22}/></span><span className="tool-copy"><strong>{s.title}</strong><small>{s.description}</small></span><span className="available">{s.status}</span><ChevronRight size={20}/></button>)}</div>
      {filteredScales.length===0&&<div className="empty">Шкалы по запросу не найдены.</div>}
     </>}
     {(page==="RASS"||page==="qSOFA")&&<EarlyScaleTool key={page} kind={page} onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="ASA"&&<AsaTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="FOUR"&&<FourTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="SOFA"&&<SofaTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="IBW"&&<IbwTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="Renal"&&<RenalTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="Infusion"&&<InfusionTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="KDIGO"&&<KdigoTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page==="GCS"&&<GcsTool onBack={()=>go("Шкалы и расчёты")}/>}
     {page!=="Шкалы и расчёты"&&page!=="GCS"&&page!=="RASS"&&page!=="qSOFA"&&page!=="ASA"&&page!=="FOUR"&&page!=="SOFA"&&page!=="IBW"&&page!=="Renal"&&page!=="Infusion"&&page!=="KDIGO"&&page!=="preoperative-questionnaire"&&page!=="patient-memos"&&page!=="Документы"&&page!=="Теория"&&<div className="coming"><div className="card-icon"><BookOpen size={20}/></div><div><strong>Материалы готовятся</strong><p>В этом разделе появятся проверенные материалы с источниками и датой актуализации.</p></div></div>}
    </>}
    {page==="PE"&&<><button className="back" onClick={()=>go("Теория")}><ArrowLeft size={17}/> Все статьи</button><PeArticle/></>}
    <footer><div>© PULSE · Справочный инструмент для медицинских специалистов. Не заменяет клиническое решение.</div><div className="footer-links"><button onClick={()=>go("Feedback")}>Сообщить об ошибке</button><a href="https://t.me/a_alenchyk" target="_blank" rel="noopener noreferrer">Контакты · Telegram</a></div></footer>
   </main>
  </div>
  <nav className="mobile-nav" aria-label="Быстрая навигация">{[navigation[0],navigation[2],navigation[3],navigation[4]].map(item=><button key={item.title} className={section===item.title?"selected":""} onClick={()=>go(item.title)}><item.icon size={21}/><span>{item.title==="Шкалы и расчёты"?"Шкалы":item.title}</span></button>)}<button className={menuOpen?"selected":""} onClick={()=>setMenuOpen(true)}><Menu size={21}/><span>Ещё</span></button></nav>
 </div>;
}