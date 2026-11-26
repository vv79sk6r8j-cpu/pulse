import {UnitFieldFrame,UnitSuffix,numericInputStyle,parseDecimal,validateNumeric,FieldFeedback,type FieldIssue} from "../components/NumericInputWithUnit";
import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { rass, rassSource, rassMeta } from "./rass";
import { calculateQsofa, qsofaSource, qsofaMeta } from "./qsofa";

export type EarlyScale = "RASS" | "qSOFA";


export default function EarlyScaleTool({kind,onBack}:{kind:EarlyScale,onBack:()=>void}){
  const [rassScore,setRassScore]=useState<number|null>(null);
  const [resp,setResp]=useState("");
  const [sbp,setSbp]=useState("");
  const [mental,setMental]=useState<"normal"|"altered"|null>(null);
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState(false);
  const [attempted,setAttempted]=useState(false);
  const isRass=kind==="RASS";
  const meta=isRass?rassMeta:qsofaMeta;
  const rr=resp.trim()===""?null:parseDecimal(resp);
  const bp=sbp.trim()===""?null:parseDecimal(sbp);
  const validRR=!validateNumeric(resp,qsofaMeta.validation.resp,true)&&Number.isInteger(rr);
  const validBP=!validateNumeric(sbp,qsofaMeta.validation.sbp,true)&&Number.isInteger(bp);
  const issue=(raw:string,key:'resp'|'sbp'):FieldIssue|undefined=>validateNumeric(raw,qsofaMeta.validation[key],attempted)??(attempted&&raw.trim()&&!Number.isInteger(parseDecimal(raw))?{kind:"error",message:"Введите целое число."}:undefined);
  const missing:FieldIssue|undefined=attempted?{kind:"error",message:"Выберите вариант."}:undefined;
  const complete=validRR&&validBP&&mental!==null;
  const total=complete?calculateQsofa(rr!,bp!,mental==="altered"):null;
  const selected=rass.find(item=>item.score===rassScore);
  const result=isRass?(selected?`RASS: ${selected.score>0?"+":""}${selected.score} — ${selected.name.toLowerCase()}.`:""):(total===null?"":`qSOFA: ${total}/3 (ЧДД ${rr}/мин — ${rr!>=22?1:0}; САД ${bp} мм рт. ст. — ${bp!<=100?1:0}; изменение сознания — ${mental==="altered"?1:0}).`);
  const copy=async()=>{if(!result)return;try{await navigator.clipboard.writeText(result);setCopied(true);setCopyError(false);}catch{setCopied(false);setCopyError(true);}};
  return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button>
    <div className="page-heading"><span className="overline">{meta.category}</span><h1>{meta.title}</h1><p className="muted">{meta.subtitle}</p></div>
    <section className="calculator">
      {isRass?<><div className="calchead"><div><span className="overline">{meta.shortTitle}</span><h2>{meta.cardTitle}</h2></div><div className="score">{rassScore===null?"—":rassScore>0?`+${rassScore}`:rassScore}</div></div>
        <p className="disclaimer">{meta.instruction}</p>
        <div className="scale-options" style={attempted&&rassScore===null?{outline:"1px solid #dc2626",borderRadius:8}:undefined}>{rass.map(item=><button key={item.score} type="button" aria-pressed={rassScore===item.score} className={"scale-option "+(rassScore===item.score?"active":"")} onClick={()=>{setRassScore(item.score);setCopied(false);setCopyError(false);}}><strong>{item.score>0?"+":""}{item.score}</strong><span><b>{item.name}</b><small>{item.detail}</small></span></button>)}</div>
        <FieldFeedback issue={rassMeta.validation.score.required&&rassScore===null?missing:undefined}/>
      </>:<><div className="calchead"><div><span className="overline">{meta.shortTitle}</span><h2>{meta.cardTitle}</h2></div><div className="score">{total===null?"—":total}<small>/3</small></div></div>
        <div className="gcsgrid"><label><span>Частота дыхания</span><UnitFieldFrame issue={issue(resp,'resp')}><input type="text" inputMode="numeric" style={numericInputStyle} value={resp} onChange={e=>{setResp(e.target.value);setCopied(false);}}/><UnitSuffix>1/мин</UnitSuffix></UnitFieldFrame><FieldFeedback issue={issue(resp,'resp')}/></label><label><span>Систолическое АД</span><UnitFieldFrame issue={issue(sbp,'sbp')}><input type="text" inputMode="numeric" style={numericInputStyle} value={sbp} onChange={e=>{setSbp(e.target.value);setCopied(false);}}/><UnitSuffix>мм рт. ст.</UnitSuffix></UnitFieldFrame><FieldFeedback issue={issue(sbp,'sbp')}/></label><label><span>Изменение сознания (GCS &lt; 15)</span><select aria-invalid={attempted&&mental===null} style={attempted&&mental===null?{borderColor:"#dc2626"}:undefined} value={mental??""} onChange={e=>{setMental(e.target.value===""?null:e.target.value as "normal"|"altered");setCopied(false);}}><option value="">Выберите</option><option value="normal">Нет — 0 баллов</option><option value="altered">Да — 1 балл</option></select><FieldFeedback issue={qsofaMeta.validation.mental.required&&mental===null?missing:undefined}/></label></div>
        {(!validRR&&resp!==""||!validBP&&sbp!=="")&&<p role="alert" className="copy-error">Проверьте введённые значения и единицы измерения.</p>}
        {complete&&<div className="interpretation"><span className="overline">ИНТЕРПРЕТАЦИЯ</span><p>{total!>=2?"2–3 балла: повышенный риск неблагоприятного исхода при подозрении на инфекцию. Требуется дальнейшая клиническая оценка.":"0–1 балл: критерий повышенного риска qSOFA не достигнут; сепсис этим не исключается."}</p></div>}
      </>}
      {result&&<><div className="result"><span>Результат</span><strong>{result}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
      <button className="copy-button" onClick={()=>setAttempted(true)}>Проверить ввод и рассчитать</button>
      <button className="back" onClick={()=>{setAttempted(false);setRassScore(null);setResp("");setSbp("");setMental(null);setCopied(false);setCopyError(false);}}>Сбросить поля</button>{copyError&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
      <p className="disclaimer">{meta.disclaimer}</p>
      <p className="disclaimer">Источник: {isRass?<a href={rassSource} target="_blank" rel="noopener noreferrer">{rassMeta.sourceLabel}</a>:<a href={qsofaSource} target="_blank" rel="noopener noreferrer">{qsofaMeta.sourceLabel}</a>}.</p>
    </section></>;
}
