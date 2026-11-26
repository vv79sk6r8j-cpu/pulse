import type { ReactNode } from "react";
export function parseDecimal(value:string):number {
 const s=value.trim();
 return /^\d+(?:[.,]\d+)?$/.test(s)?Number(s.replace(",",".")):NaN;
}
export function UnitFieldFrame({children}:{children:ReactNode}){
 return <div style={{display:"flex",alignItems:"center",border:"1px solid currentColor",borderRadius:8,overflow:"hidden",minWidth:0}}>{children}</div>;
}
export const numericInputStyle={flex:"1 1 0",minWidth:0,width:0,border:0,borderRadius:0} as const;
export const unitSelectStyle={width:"auto",maxWidth:"55%",border:0,borderLeft:"1px solid currentColor",borderRadius:0} as const;
export function UnitSuffix({children}:{children:ReactNode}){return <span style={{padding:"0 10px",whiteSpace:"nowrap"}}>{children}</span>;}
