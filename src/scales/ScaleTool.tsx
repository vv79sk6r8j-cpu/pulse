import { useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { rass, rassSource } from "./rass";
import { calculateQsofa, qsofaSource } from "./qsofa";

export type EarlyScale = "RASS" | "qSOFA";


export default function EarlyScaleTool({kind,onBack}:{kind:EarlyScale,onBack:()=>void}){
  const [rassScore,setRassScore]=useState<number|null>(null);
  const [resp,setResp]=useState("");
  const [sbp,setSbp]=useState("");
  const [mental,setMental]=useState<"normal"|"altered"|null>(null);
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState(false);
  const isRass=kind==="RASS";
  const rr=resp.trim()===""?null:Number(resp);
  const bp=sbp.trim()===""?null:Number(sbp);
  const validRR=rr!==null&&Number.isFinite(rr)&&Number.isInteger(rr)&&rr>=0&&rr<=100;
  const validBP=bp!==null&&Number.isFinite(bp)&&Number.isInteger(bp)&&bp>=20&&bp<=300;
  const complete=validRR&&validBP&&mental!==null;
  const total=complete?calculateQsofa(rr!,bp!,mental==="altered"):null;
  const selected=rass.find(item=>item.score===rassScore);
  const result=isRass?(selected?`RASS: ${selected.score>0?"+":""}${selected.score} — ${selected.name.toLowerCase()}.`:""):(total===null?"":`qSOFA: ${total}/3 (ЧДД ${rr}/мин — ${rr!>=22?1:0}; САД ${bp} мм рт. ст. — ${bp!<=100?1:0}; изменение сознания — ${mental==="altered"?1:0}).`);
  const copy=async()=>{if(!result)return;try{await navigator.clipboard.writeText(result);setCopied(true);setCopyError(false);}catch{setCopied(false);setCopyError(true);}};
  return <><button className="back" onClick={onBack}><ArrowLeft size={17}/> Все шкалы</button>
    <div className="page-heading"><span className="overline">КЛИНИЧЕСКАЯ ШКАЛА</span><h1>{isRass?"RASS — шкала возбуждения и седации":"qSOFA — быстрая оценка риска при подозрении на инфекцию"}</h1><p className="muted">{isRass?"Richmond Agitation–Sedation Scale":"quick Sequential Organ Failure Assessment"}</p></div>
    <section className="calculator">
      {isRass?<><div className="calchead"><div><span className="overline">RASS</span><h2>Выберите наблюдаемый уровень</h2></div><div className="score">{rassScore===null?"—":rassScore>0?`+${rassScore}`:rassScore}</div></div>
        <p className="disclaimer">Сначала оцените поведение пациента, затем реакцию на голос и, при отсутствии ответа, на физическую стимуляцию.</p>
        <div className="scale-options">{rass.map(item=><button key={item.score} type="button" aria-pressed={rassScore===item.score} className={"scale-option "+(rassScore===item.score?"active":"")} onClick={()=>{setRassScore(item.score);setCopied(false);setCopyError(false);}}><strong>{item.score>0?"+":""}{item.score}</strong><span><b>{item.name}</b><small>{item.detail}</small></span></button>)}</div>
      </>:<><div className="calchead"><div><span className="overline">qSOFA</span><h2>Три клинических критерия</h2></div><div className="score">{total===null?"—":total}<small>/3</small></div></div>
        <div className="gcsgrid"><label><span>Частота дыхания, /мин</span><input type="number" inputMode="numeric" min="0" max="100" step="1" value={resp} onChange={e=>{setResp(e.target.value);setCopied(false);}} placeholder="Например, 24"/></label><label><span>Систолическое АД, мм рт. ст.</span><input type="number" inputMode="numeric" min="20" max="300" step="1" value={sbp} onChange={e=>{setSbp(e.target.value);setCopied(false);}} placeholder="Например, 95"/></label><label><span>Изменение сознания (GCS &lt; 15)</span><select value={mental??""} onChange={e=>{setMental(e.target.value===""?null:e.target.value as "normal"|"altered");setCopied(false);}}><option value="">Выберите</option><option value="normal">Нет — 0 баллов</option><option value="altered">Да — 1 балл</option></select></label></div>
        {(!validRR&&resp!==""||!validBP&&sbp!=="")&&<p role="alert" className="copy-error">Проверьте введённые значения и единицы измерения.</p>}
        {complete&&<div className="interpretation"><span className="overline">ИНТЕРПРЕТАЦИЯ</span><p>{total!>=2?"2–3 балла: повышенный риск неблагоприятного исхода при подозрении на инфекцию. Требуется дальнейшая клиническая оценка.":"0–1 балл: критерий повышенного риска qSOFA не достигнут; сепсис этим не исключается."}</p></div>}
      </>}
      {result&&<><div className="result"><span>Результат</span><strong>{result}</strong></div><button className="copy-button" onClick={copy}>{copied?<Check size={18}/>:<Copy size={18}/>} {copied?"Скопировано":"Копировать результат"}</button></>}
      {copyError&&<p role="alert" className="copy-error">Не удалось скопировать результат.</p>}
      <p className="disclaimer">{isRass?"RASS отражает наблюдаемый уровень возбуждения или седации и не устанавливает причину нарушения сознания.":"qSOFA не является самостоятельным диагностическим критерием сепсиса и не рекомендуется как единственный скрининговый инструмент. Оценивайте клиническую картину и органную дисфункцию."}</p>
      <p className="disclaimer">Источник: {isRass?<a href={rassSource} target="_blank" rel="noopener noreferrer">SCCM, Richmond Agitation–Sedation Scale; Sessler et al., 2002</a>:<a href={qsofaSource} target="_blank" rel="noopener noreferrer">Singer et al., Sepsis-3, JAMA 2016</a>}.</p>
    </section></>;
}
