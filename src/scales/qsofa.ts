/** qSOFA: thresholds from Sepsis-3; keep scoring separate from presentation. */
export const qsofaSource="https://jamanetwork.com/journals/jama/fullarticle/2492881";
export function calculateQsofa(respiratoryRate:number,systolicBP:number,alteredMentalStatus:boolean){
  return Number(respiratoryRate>=22)+Number(systolicBP<=100)+Number(alteredMentalStatus);
}
