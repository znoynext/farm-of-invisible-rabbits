export const navigationItems = [
  {
    id: "overview",
    label: "Обзор",
    eyebrow: "Начните здесь",
    title: "Наблюдение начинается с косвенных следов",
    description:
      "Текущая оценка, причины результата и возможность проверить гипотезу.",
  },
  {
    id: "signals",
    label: "Сигналы",
    eyebrow: "Данные для расчёта",
    title: "Сигналы",
    description:
      "Наблюдения, по которым система оценивает количество кроликов.",
  },
  {
    id: "model",
    label: "Модель",
    eyebrow: "Как система считает",
    title: "Модель оценки",
    description:
      "Настройки того, как система учитывает разные типы сигналов.",
  },
  {
    id: "ai-worklog",
    label: "AI Worklog",
    eyebrow: "Как шла работа",
    title: "AI Worklog",
    description:
      "Как проект создавался с помощью ИИ, какие решения принимались и как результат проверялся.",
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
export type SectionId = NavigationItem["id"];

export const defaultSectionId: SectionId = "overview";

export function isSectionId(value: string): value is SectionId {
  return navigationItems.some((item) => item.id === value);
}
