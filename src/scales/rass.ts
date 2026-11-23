export const rassMeta = {
  category: "КЛИНИЧЕСКАЯ ШКАЛА",
  title: "RASS — шкала возбуждения и седации",
  subtitle: "Richmond Agitation–Sedation Scale",
  shortTitle: "RASS",
  cardTitle: "Выберите наблюдаемый уровень",
  instruction: "Сначала оцените поведение пациента, затем реакцию на голос и, при отсутствии ответа, на физическую стимуляцию.",
  catalogDescription: "Уровень возбуждения и седации от −5 до +4",
  caution: "RASS отражает наблюдаемый уровень возбуждения или седации и не устанавливает причину нарушения сознания.",
  sourceLabel: "SCCM, Richmond Agitation–Sedation Scale; Sessler et al., 2002"
} as const;

/** RASS criteria. Edit clinical wording here; keep scores unchanged unless validated. */
export const rass = [
  {score:4,name:"Агрессивен",detail:"Выраженная агрессия, непосредственная опасность для персонала."},
  {score:3,name:"Крайне возбуждён",detail:"Удаляет трубки или катетеры либо агрессивен по отношению к персоналу."},
  {score:2,name:"Возбуждён",detail:"Частые нецеленаправленные движения или десинхронизация с аппаратом ИВЛ."},
  {score:1,name:"Беспокоен",detail:"Тревожен, движения неагрессивные и не чрезмерно энергичные."},
  {score:0,name:"Бодрствует и спокоен",detail:"Контактный, спокойный."},
  {score:-1,name:"Сонлив",detail:"Пробуждение на голос с зрительным контактом более 10 секунд."},
  {score:-2,name:"Лёгкая седация",detail:"Кратковременное пробуждение на голос со зрительным контактом менее 10 секунд."},
  {score:-3,name:"Умеренная седация",detail:"Движение на голос, но без зрительного контакта."},
  {score:-4,name:"Глубокая седация",detail:"Нет ответа на голос, но есть движение на физическую стимуляцию."},
  {score:-5,name:"Не пробуждается",detail:"Нет ответа ни на голос, ни на физическую стимуляцию."}
] as const;
export const rassSource="https://www.sccm.org/SCCM/media/SCCM/PDFs/Agitation-Richmond-Agitation-Sedation-Scale.pdf";
