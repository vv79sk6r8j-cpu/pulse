import { ArrowLeft, Download, FileText } from "lucide-react";
import questionnairePdf from "./preoperative-questionnaire.pdf?url";
import examinationPdf from "./preoperative-examination.pdf?url";
import preparationPdf from "./anesthesia-preparation.pdf?url";

export const documentTemplates = [
  { id: "preoperative-questionnaire", title: "Предоперационная анкета", category: "ШАБЛОН ДОКУМЕНТА", pdfUrl: questionnairePdf, disclaimer: "Перед применением проверьте соответствие локальной документации и требованиям обработки персональных данных." },
  { id: "preoperative-examination", title: "Обследование перед операцией", category: "ШАБЛОН ДОКУМЕНТА", pdfUrl: examinationPdf, disclaimer: "Перед применением согласуйте рекомендации с лечащим врачом и анестезиологом." },
  { id: "anesthesia-preparation", title: "Подготовка к анестезии", category: "ШАБЛОН ДОКУМЕНТА", pdfUrl: preparationPdf, disclaimer: "Перед применением согласуйте рекомендации с лечащим врачом и анестезиологом." },
] as const;
export type DocumentId=(typeof documentTemplates)[number]["id"];

export default function DocumentViewer({id,onBack}:{id:DocumentId;onBack:()=>void}){
 const doc=documentTemplates.find(x=>x.id===id);
 if(!doc)return null;
 const pdfUrl=doc.pdfUrl;
 return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все документы</button>
 <div className="page-heading"><span className="overline">{doc.category}</span><h1>{doc.title}</h1><p className="muted">Документ PDF · доступен для скачивания</p></div>
 <section className="calculator"><div className="calchead"><div><span className="overline">PDF</span><h2>{doc.title}</h2></div><FileText size={32}/></div>
 <p className="disclaimer">Сохраните документ на устройство, чтобы распечатать или заполнить его.</p>
 <a className="copy-button" href={pdfUrl} download={doc.id+".pdf"}><Download size={18}/> Скачать PDF</a>
 <p className="disclaimer">{doc.disclaimer}</p>
 </section></>;
}
