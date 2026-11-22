export default {
 async fetch(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = new Set(["https://vv79sk6r8j-cpu.github.io"]);
  const headers = {"Access-Control-Allow-Origin":allowed.has(origin)?origin:"https://vv79sk6r8j-cpu.github.io","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin","Content-Type":"application/json; charset=utf-8"};
  const reply=(status,message)=>new Response(JSON.stringify({message}),{status,headers});
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(request.method!=="POST"||!allowed.has(origin))return reply(403,"Forbidden");
  if(Number(request.headers.get("Content-Length")||0)>12000)return reply(413,"Too large");
  let data;try{data=await request.json()}catch{return reply(400,"Invalid JSON")}
  const title=String(data.title||"").trim(),description=String(data.description||"").trim(),contact=String(data.contact||"").trim();
  if(!title||!description||title.length>120||description.length>4000||contact.length>200)return reply(400,"Invalid fields");
  if(!env.GITHUB_TOKEN||!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return reply(503,"Not configured");
  const now=new Date(),stamp=now.toISOString(),id=stamp.replace(/[:.]/g,"-")+"-"+crypto.randomUUID().slice(0,8);
  const path="Feedback/"+id+".md";
  const file="# "+title.replace(/[\r\n]/g," ")+"\n\nДата: "+stamp+"\n\n## Описание\n\n"+description+"\n";
  const bytes=new TextEncoder().encode(file);let binary="";for(const byte of bytes)binary+=String.fromCharCode(byte);
  const saved=await fetch("https://api.github.com/repos/vv79sk6r8j-cpu/pulse/contents/"+encodeURIComponent(path).replace("%2F","/"),{method:"PUT",headers:{"Authorization":"Bearer "+env.GITHUB_TOKEN,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"PULSE-Feedback-Worker","Content-Type":"application/json"},body:JSON.stringify({message:"feedback: "+id,content:btoa(binary),branch:"main"})});
  if(!saved.ok)return reply(502,"GitHub storage failed");
  const link="https://github.com/vv79sk6r8j-cpu/pulse/blob/main/"+path;
  const message=["🩺 PULSE — новое сообщение об ошибке","Заголовок: "+title,"Описание: "+description,"Контакты: "+(contact||"не указаны"),"Дата: "+stamp,"Запись: "+link].join("\n").slice(0,4000);
  const notified=await fetch("https://api.telegram.org/bot"+env.TELEGRAM_BOT_TOKEN+"/sendMessage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:message,disable_web_page_preview:true})});
  if(!notified.ok)return reply(502,"Saved, but notification failed");
  return reply(200,"OK");
 }
};
