export const qsofaMeta = {
  validation: {resp:{required:true,min:0,integer:true,unit:'1/мин'},sbp:{required:true,min:0,integer:true,unit:'мм рт. ст.'},mental:{required:true}},
  category: "КЛИНИЧЕСКАЯ ШКАЛА",
  title: "qSOFA — быстрая оценка риска при подозрении на инфекцию",
  subtitle: "quick Sequential Organ Failure Assessment",
  shortTitle: "qSOFA",
  cardTitle: "Три клинических критерия",
  instruction: "У взрослых с подозреваемой или подтверждённой инфекцией оцените ЧДД, систолическое АД и нарушение сознания (GCS менее 15). Каждый критерий даёт 1 балл; 2–3 балла указывают на повышенный риск неблагоприятного исхода.",
  catalogDescription: "ЧДД, систолическое АД, изменение сознания",
  disclaimer: "qSOFA не является самостоятельным диагностическим критерием сепсиса и не рекомендуется как единственный скрининговый инструмент. Даже 0–1 балл не исключает сепсис. Оценивайте клиническую картину и органную дисфункцию. SSC 2026 рекомендует NEWS, NEWS2, MEWS или SIRS вместо qSOFA как единственного инструмента скрининга.",
  sourceLabel: "Singer et al., Sepsis-3, JAMA 2016; ограничения скрининга: SSC 2026, doi:10.1097/CCM.0000000000007075"
} as const;

/** qSOFA: thresholds from Sepsis-3; keep scoring separate from presentation. */
export const qsofaSource="https://jamanetwork.com/journals/jama/fullarticle/2492881";
export function calculateQsofa(respiratoryRate:number,systolicBP:number,alteredMentalStatus:boolean){
  return Number(respiratoryRate>=22)+Number(systolicBP<=100)+Number(alteredMentalStatus);
}
