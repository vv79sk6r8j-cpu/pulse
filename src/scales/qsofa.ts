export const qsofaMeta = {
  validation: {resp:{required:true,min:0,integer:true,unit:'1/мин'},sbp:{required:true,min:0,integer:true,unit:'мм рт. ст.'},mental:{required:true}},
  category: "КЛИНИЧЕСКАЯ ШКАЛА",
  title: "qSOFA — быстрая оценка риска при подозрении на инфекцию",
  subtitle: "quick Sequential Organ Failure Assessment",
  shortTitle: "qSOFA",
  cardTitle: "Три клинических критерия",
  instruction: "",
  catalogDescription: "ЧДД, систолическое АД, изменение сознания",
  disclaimer: "qSOFA не является самостоятельным диагностическим критерием сепсиса и не рекомендуется как единственный скрининговый инструмент. Оценивайте клиническую картину и органную дисфункцию.",
  sourceLabel: "Singer et al., Sepsis-3, JAMA 2016"
} as const;

/** qSOFA: thresholds from Sepsis-3; keep scoring separate from presentation. */
export const qsofaSource="https://jamanetwork.com/journals/jama/fullarticle/2492881";
export function calculateQsofa(respiratoryRate:number,systolicBP:number,alteredMentalStatus:boolean){
  return Number(respiratoryRate>=22)+Number(systolicBP<=100)+Number(alteredMentalStatus);
}
