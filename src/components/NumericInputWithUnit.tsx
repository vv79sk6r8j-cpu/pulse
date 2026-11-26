import type { ReactNode } from "react";
export function parseDecimal(value:string):number {
 const s=value.trim();
 const n=/^\d+(?:[.,]\d+)?$/.test(s)?Number(s.replace(",",".")):NaN;
 return Number.isFinite(n)?n:NaN;
}
export function UnitFieldFrame({children,issue}:{children:ReactNode;issue?:FieldIssue}){
 return <div style={{display:"flex",alignItems:"center",border:"1px solid "+(issue?.kind==="error"?"#dc2626":issue?.kind==="warning"?"#d97706":"currentColor"),borderRadius:8,overflow:"hidden",minWidth:0}}>{children}</div>;
}
export const numericInputStyle={flex:"1 1 0",minWidth:0,width:0,border:0,borderRadius:0} as const;
export const unitSelectStyle={width:"auto",maxWidth:"55%",border:0,borderLeft:"1px solid currentColor",borderRadius:0} as const;
export function UnitSuffix({children}:{children:ReactNode}){return <span style={{padding:"0 10px",whiteSpace:"nowrap"}}>{children}</span>;}

export type FieldIssue={kind:"error"|"warning";message:string};
export function validateNumeric(raw:string,opts:{required?:boolean;min?:number;max?:number;warnMin?:number;warnMax?:number;factor?:number;integer?:boolean},attempted:boolean):FieldIssue|undefined{
 if(!raw.trim())return attempted&&opts.required?{kind:"error",message:"Заполните обязательное поле."}:undefined;
 if(!attempted)return undefined;
 const n=parseDecimal(raw)*(opts.factor??1);
 if(!Number.isFinite(n)||(opts.integer&&!Number.isInteger(n))||(opts.min!==undefined&&n<opts.min)||(opts.max!==undefined&&n>opts.max))return {kind:"error",message:"Недопустимое значение. Проверьте ввод."};
 if((opts.warnMin!==undefined&&n<opts.warnMin)||(opts.warnMax!==undefined&&n>opts.warnMax))return {kind:"warning",message:"Нетипичное значение. Проверьте ввод и единицы измерения."};
}
export function FieldFeedback({issue}:{issue?:FieldIssue}){return issue?<small role={issue.kind==="error"?"alert":"status"} style={{display:"block",color:issue.kind==="error"?"#dc2626":"#b45309"}}>{issue.message}</small>:null;}
