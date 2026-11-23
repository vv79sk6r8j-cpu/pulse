import { useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import { documentTemplate as questionnaire } from "./preoperative-questionnaire";
import { documentTemplate as memos } from "./patient-memos";

export const documentTemplates=[questionnaire,memos] as const;
export type DocumentId=(typeof documentTemplates)[number]["id"];

export default function DocumentViewer({id,onBack}:{id:DocumentId;onBack:()=>void}){
 const doc=documentTemplates.find(x=>x.id===id);
 const [copied,setCopied]=useState(false);
 const [error,setError]=useState(false);
 if(!doc)return null;
 const copy=async()=>{try{await navigator.clipboard.writeText(doc.content);setCopied(true);setError(false);}catch{setError(true);}};
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все документы</button>
 <div className="page-heading"><span className="overline">{doc.category}</span><h1>{doc.title}</h1><p className="muted">Материал из вкладки «{doc.sourceTab}» исходного Google Docs</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">ШАБЛОН</span><h2>{doc.title}</h2></div></div>
 <div className="document-source-text">{doc.content}</div>
 <button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать текст"}</button>
 {error&&<p role="alert" className="copy-error">Не удалось скопировать текст.</p>}
 <p className="disclaimer">{doc.disclaimer}</p>
 <p className="disclaimer"><a href={doc.sourceUrl} target="_blank" rel="noopener noreferrer">Открыть оригинал в Google Docs <ExternalLink size={14}/></a></p>
 </section></>;
}
