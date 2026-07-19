export const navigationItems = [
  {
    id: "overview",
    label: "Обзор",
    eyebrow: "Точка отсчёта",
    title: "Наблюдение начинается с косвенных следов",
    description:
      "Здесь появится ясный ответ, пространственная картина и объяснение того, какие наблюдения повлияли на оценку.",
  },
  {
    id: "signals",
    label: "Сигналы",
    eyebrow: "Доказательная база",
    title: "Сигналы",
    description: "Наблюдения, на которых строится текущая оценка.",
  },
  {
    id: "model",
    label: "Модель",
    eyebrow: "Прозрачные настройки",
    title: "Управление моделью",
    description:
      "Здесь будут доступны веса сигналов, чувствительность и понятное объяснение того, как меняется итоговая оценка.",
  },
  {
    id: "ai-worklog",
    label: "Работа с ИИ",
    eyebrow: "Открытый процесс",
    title: "Работа с ИИ",
    description:
      "Журнал будет фиксировать реальные решения, найденные проблемы, изменения и выполненные проверки без скрытых рассуждений.",
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
export type SectionId = NavigationItem["id"];

export const defaultSectionId: SectionId = "overview";

export function isSectionId(value: string): value is SectionId {
  return navigationItems.some((item) => item.id === value);
}
