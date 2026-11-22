import markdown from "./articles/tela.md?raw";
import type { ReactNode } from "react";

type Block={level:number;text:string;id?:string};
const blocks:Block[]=markdown.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean).map(s=>{
 const m=s.match(/^(#{1,4})\s+([\s\S]*)$/);
 return m?{level:m[1].length,text:m[2]}:{level:0,text:s};
});
const anchors:Record<string,string>={"Диагностика":"pe-diagnosis","Оценка риска":"pe-risk","Лечение в остром периоде ТЭЛА":"pe-treatment","Источник":"pe-source"};
function inline(text:string):ReactNode{
 const link=text.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
 return link?<a href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>:text;
}
export default function PeArticle(){
 let source=false;
 return <article className="medical-article">
  <div className="article-intro"><span className="overline">ТЕОРИЯ · ПОСОБИЕ</span><h1>{blocks[0]?.text}</h1><p className="article-kind">Тип материала: пособие · без плашки КР или МР</p></div>
  <nav className="article-toc" aria-label="Содержание статьи"><strong>Содержание</strong><a href="#pe-diagnosis">Диагностика</a><a href="#pe-risk">Оценка риска</a><a href="#pe-treatment">Лечение</a><a href="#pe-source">Источник</a></nav>
  <div className="article-section article-verbatim">{blocks.slice(1).map((b,i)=>{
   if(b.level===2&&b.text==="Источник")source=true;
   if(source)return null;
   if(b.level===2)return <h2 id={anchors[b.text]} key={i}>{b.text}</h2>;
   if(b.level===3)return <h3 key={i}>{b.text}</h3>;
   if(b.level===4)return <h4 key={i}>{b.text}</h4>;
   if(b.text.startsWith("- ")){return <ul key={i} className="article-list">{b.text.split("\n").map((item,j)=><li key={j}>{item.replace(/^- /,"")}</li>)}</ul>;}
   if(b.text.startsWith("| ")){const rows=b.text.split("\n").map(line=>line.split("|").slice(1,-1).map(cell=>cell.trim()));return <div key={i} className="article-table-wrap"><table className="article-table"><thead><tr>{rows[0].map((cell,j)=><th key={j}>{cell}</th>)}</tr></thead><tbody>{rows.slice(2).map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>;}
   return <p key={i}>{inline(b.text)}</p>;
  })}</div>
  <section id="pe-source" className="article-source"><h2>Источник</h2>{blocks.slice(blocks.findIndex(b=>b.level===2&&b.text==="Источник")+1).map((b,i)=><p key={i}>{inline(b.text)}</p>)}</section>
 </article>;
}
