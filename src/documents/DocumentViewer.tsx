import { ArrowLeft, Download, FileText } from "lucide-react";
import { documentTemplate as questionnaire } from "./preoperative-questionnaire";
import { documentTemplate as memos } from "./patient-memos";

export const documentTemplates=[questionnaire,memos] as const;
export type DocumentId=(typeof documentTemplates)[number]["id"];

export default function DocumentViewer({id,onBack}:{id:DocumentId;onBack:()=>void}){
 const doc=documentTemplates.find(x=>x.id===id);
 if(!doc)return null;
 const pdfUrl=import.meta.env.BASE_URL+"documents/"+doc.id+".pdf";
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все документы</button>
 <div className="page-heading"><span className="overline">{doc.category}</span><h1>{doc.title}</h1><p className="muted">Документ PDF · доступен для скачивания</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">PDF</span><h2>{doc.title}</h2></div><FileText size={32}/></div>
 <p className="disclaimer">Сохраните документ на устройство, чтобы распечатать или заполнить его.</p>
 <a className="copy-button" href={pdfUrl} download={doc.id+".pdf"}><Download size={18}/> Скачать PDF</a>
 <p className="disclaimer">{doc.disclaimer}</p>
 </section></>;
}
