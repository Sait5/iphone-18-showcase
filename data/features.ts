import type { Feature, FeatureId, IphoneModel } from "@/types/iphone";

export const features: Feature[] = [
  { id: "camera", index: "01", title: "Камеры Fusion", kicker: "Система камер", description: "Оптика собрана в цельный модуль с точной геометрией линз и отдельным датчиком глубины.", specs: [{ label: "Главная", value: "48 Мп" }, { label: "Видео", value: "4K · 120 fps" }, { label: "Зум", value: "до 8×" }], rotation: [-0.12, 2.63, -0.05] },
  { id: "display", index: "02", title: "ProMotion XDR", kicker: "Дисплей", description: "Яркая OLED-панель с адаптивной частотой обновления сохраняет плавность и экономит заряд.", specs: [{ label: "Частота", value: "1–120 Гц" }, { label: "Пик", value: "3 000 нит" }, { label: "Стекло", value: "Ceramic Shield" }], rotation: [0, 0, 0] },
  { id: "body", index: "03", title: "Цельный корпус", kicker: "Материалы и дизайн", description: "Тонкая металлическая рама и матовая задняя панель собраны без лишних визуальных разрывов.", specs: [{ label: "Рама", value: "Титан" }, { label: "Защита", value: "IP68" }, { label: "Покрытие", value: "PVD" }], rotation: [0.02, 2.24, 0] },
  { id: "button", index: "04", title: "Боковая кнопка", kicker: "Питание и блокировка", description: "Короткое нажатие включает или выключает дисплей. Удержание вызывает Siri и системные действия.", specs: [{ label: "Нажатие", value: "Экран вкл/выкл" }, { label: "Удержание", value: "Siri" }, { label: "Отклик", value: "Haptic" }], rotation: [0.04, -1.17, 0.02] },
  { id: "speakers", index: "05", title: "Пространственный звук", kicker: "Динамики", description: "Стереопара создаёт широкую сцену, а точная настройка подчёркивает голос и низкие частоты.", specs: [{ label: "Формат", value: "Dolby Atmos" }, { label: "Сцена", value: "Spatial Audio" }, { label: "Динамика", value: "+25%" }], rotation: [-1.08, 0.25, 0.03] },
];

export const tourOrder = features.map((feature) => feature.id);

export function getModelFeature(id: FeatureId | null, model: IphoneModel): Feature | undefined {
  const base = features.find(feature => feature.id === id);
  if (!base) return undefined;
  if (model.foldable && id === "display") return { ...base, title: "Раскрывает больше", description: "Единый внутренний экран с виджетами и иконками раскрывается вместе с шарниром. В сложенном виде доступен внешний дисплей.", specs: [{ label: "Внутренний", value: model.display }, { label: "Внешний", value: "Отдельный экран" }, { label: "Формат", value: "Книжка" }] };
  if (model.foldable && id === "body") return { ...base, title: "Складная архитектура", description: "Две тонкие половины соединены центральным шарниром. Нажмите «Сложить iPhone», чтобы рассмотреть механизм в движении.", specs: [{ label: "Механизм", value: "Центральный шарнир" }, { label: "Покрытия", value: "Серебро / синий" }, { label: "Статус", value: "Дизайн-концепт" }] };
  if (id === "camera") return { ...base, title: model.cameras === 1 ? "Камера Fusion" : "Камеры Fusion", description: model.cameras === 3 ? base.description : model.cameras === 2 ? "Двойной модуль: основная и сверхширокоугольная камеры для повседневных сюжетов." : "Один компактный модуль сохраняет тонкий силуэт Air.", specs: [{ label: "Модулей", value: String(model.cameras) }, { label: "Главная", value: "48 Мп" }, { label: "Видео", value: model.cameras === 3 || model.foldable ? "4K · 120 fps" : "4K · 60 fps" }] };
  if (id === "display") return { ...base, specs: [{ label: "Диагональ", value: model.display }, ...base.specs.slice(0, 2)] };
  if (id === "body") return { ...base, specs: [{ label: "Корпус", value: model.material }, { label: "Вес", value: model.weight }, { label: "Толщина", value: model.foldable ? `${model.thickness} / ${model.foldedThickness}` : model.thickness }] };
  return base;
}
