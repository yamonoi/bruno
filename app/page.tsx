import Image from "next/image";
import { createApiClient } from "@/lib/api";

const navItems = ["Каталог теплиц", "Комплектующие", "Оборудование", "Проекты", "О компании", "Контакты"];

const greenhouseTypes = [
  {
    title: "Ягодные теплицы",
    description: "Туннели и многопролётные конструкции для клубники, малины, голубики",
    tags: ["Ягода", "Туннели", "Открытый грунт + субстрат"],
    image: "/images/type-berry.png",
  },
  {
    title: "Блочные промышленные теплицы",
    description: "Теплицы под один слой плёнки или двойную плёнку с наддувом для выращивания овощей и цветов.",
    tags: ["Двойная плёнка с наддувом", "Multi-span", "Круглогодичное"],
    image: "/images/type-industrial.png",
  },
  {
    title: "Стеклянные теплицы VENLO",
    description: "Стеклянные теплицы для круглогодичного выращивания овощей, цветов, фруктов и зелени.",
    tags: ["Стекло", "VENLO", "Премиум"],
    image: "/images/type-glass.png",
    badge: "Скоро",
  },
];

const components = [
  "Каркас с закладными деталями",
  "Плёночное покрытие и система наддува",
  "Окна и вентиляция",
  "Циркуляционные вентиляторы",
  "Подвесные системы выращивания",
  "Капельный полив",
  "Система туманообразования",
  "Удобрение и фильтрация",
  "Климат-контроллер",
  "Метеостанция",
  "Электрооборудование",
  "Сетки, экраны и укрывные материалы",
  "Сетки, экраны и укрывные материалы",
  "Сетки, экраны и укрывные материалы",
  "Сетки, экраны и укрывные материалы",
  "Сетки, экраны и укрывные материалы",
];

const projects = [
  {
    title: "Ягодный комплекс, 10 500 м²",
    culture: "Клубника",
    region: "Беларусь",
    type: "Ягодная теплица ТЯ-09",
    image: "/images/project-1.png",
  },
  {
    title: "Тепличный комплекс, 25 000 м²",
    culture: "Томаты, огурцы",
    region: "Россия (МО)",
    type: "Плёночная теплица с наддувом",
    image: "/images/project-2.png",
  },
  {
    title: "Зелёный хозяйство, 8 000 м²",
    culture: "Салат, зелень",
    region: "Казахстан",
    type: "Мультиспан теплица",
    image: "/images/project-3.png",
  },
];

const technologyRows = [
  {
    title: "Каркас и нагрузки",
    text: "Расчёт конструкций под снеговые и ветровые нагрузки регионов СНГ",
    icon: "▣",
  },
  {
    title: "Плёнка с наддувом",
    text: "Двойная плёнка с системой наддува для энергоэффективности",
    icon: "≋",
  },
  {
    title: "Климат и вентиляция",
    text: "Интеллектуальная система управления микроклиматом теплицы",
    icon: "◌",
  },
  {
    title: "Полив и туман",
    text: "Капельный полив и системы туманообразования для оптимальной влажности",
    icon: "◔",
  },
  {
    title: "Автоматизация и мониторинг",
    text: "Климат-контроллеры и системы удалённого мониторинга параметров",
    icon: "⌁",
  },
];

const workflow = [
  {
    step: "01",
    title: "Заявка и обсуждение вашей задачи",
    text: "Анализируем ваши требования: культура, площадь, регион, бюджет",
  },
  {
    step: "02",
    title: "Предварительный расчёт и КП",
    text: "Подбираем оптимальное решение и готовим коммерческое предложение",
  },
  {
    step: "03",
    title: "Проектирование и поставка",
    text: "Разрабатываем проект с учётом нагрузок и организуем поставку",
  },
  {
    step: "04",
    title: "Монтаж и сопровождение",
    text: "Выполняем монтаж и обеспечиваем сервисное обслуживание",
  },
];

const chips = [
  "Для ягодных хозяйств",
  "Для тепличных комплексов",
  "4 типа теплиц",
  "> 10 000 м² в одном проекте",
  "Поставка и сервис по СНГ",
];

const containerClass = "mx-auto w-full max-w-[1580px] px-4 sm:px-6 xl:px-0";

export default async function Home() {
  const api = createApiClient();
  const documents = await api.documents.list();
  console.log("documents response:", documents);

  return (
    <main className="overflow-x-clip bg-[var(--bg-main)] text-[var(--text-main)]">
      <header className="border-b border-black/10 bg-white">
        <div className={`${containerClass} flex h-[72px] items-center justify-between gap-6`}>
          <Image src="/images/logo.png" alt="Большие урожаи" width={240} height={48} className="h-auto w-[220px]" priority />
          <nav className="hidden items-center gap-10 text-[16px] font-medium xl:flex">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-[var(--accent)]">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-[10px] bg-[var(--accent)] px-5 py-2.5 text-[16px] font-semibold text-white transition-colors hover:brightness-95">
              Рассчитать проект
            </button>
            <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--accent)] text-lg text-white">
              ☎
            </button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto h-[560px] w-full max-w-[1920px]">
        <Image
          src="/images/hero-bg.png"
          alt="Промышленные теплицы для больших урожаев"
          fill
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute bottom-4 left-1/2 hidden w-full max-w-[1580px] -translate-x-1/2 items-end justify-between gap-5 px-6 lg:flex xl:px-0">
          <div className="rounded-[18px] bg-[#6d7b5f]/65 px-4 py-4 text-white backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/images/hero-thumb.png"
                alt="Промышленная теплица"
                width={122}
                height={84}
                className="h-[64px] w-[92px] rounded-[10px] object-cover"
              />
              <p className="max-w-[185px] text-[36px] leading-[1.08] font-semibold">Промышленные теплицы для СНГ</p>
            </div>
          </div>
          <div className="max-w-[520px]">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full bg-[#f1f3ea] px-3 py-1 text-[14px] font-semibold text-[#47512e]">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <p className="max-w-[330px] text-right text-[14px] leading-snug text-white">
            На сайте ориентировочная цена, финальное КП готовит инженер
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg-soft)] py-[88px]">
        <div className={containerClass}>
          <h2 className="mb-12 text-center text-[52px] leading-[1.14] font-semibold">3 типа теплиц под ваши задачи</h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {greenhouseTypes.map((item) => (
              <article key={item.title} className="relative rounded-[16px] bg-[#f5f5f7] p-5">
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={420}
                    height={190}
                    className="h-[220px] w-full rounded-[12px] object-cover"
                  />
                  {item.badge ? (
                    <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-3 py-1 text-[13px] font-semibold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-[41px] leading-[1.2] font-medium">{item.title}</h3>
                <p className="mt-2 text-[17px] leading-[1.5] text-black/55">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 pb-11">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#ececdc] px-2.5 py-1 text-[13px] font-semibold text-[#97a65d]">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="absolute bottom-5 right-5 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#ececdc] text-xl text-[var(--accent)]">
                  →
                </span>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <article className="grid rounded-[16px] bg-[#f5f5f7] p-5 md:grid-cols-[370px_1fr] md:gap-6">
              <Image
                src="/images/type-mix.png"
                alt="Микс теплицы"
                width={420}
                height={220}
                className="h-[250px] w-full rounded-[12px] object-cover"
              />
              <div>
                <h3 className="text-[46px] leading-tight font-medium">Микс теплицы</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#ececdc] px-2.5 py-1 text-[13px] font-semibold text-[#97a65d]">
                    Индивидуальный проект
                  </span>
                  <span className="rounded-full bg-[#ececdc] px-2.5 py-1 text-[13px] font-semibold text-[#97a65d]">
                    Гибридная конструкция
                  </span>
                </div>
                <p className="mt-3 text-[17px] leading-[1.45] text-black/60">
                  <b>Стеклянные стены и плёночная кровля.</b> Гибридное решение для проектов с особыми
                  требованиями к свету и бюджету. Разрабатывается индивидуально.
                </p>
                <button className="mt-5 rounded-[8px] bg-[var(--accent)] px-5 py-2.5 text-[16px] font-semibold text-white">
                  Оставить заявку
                </button>
              </div>
            </article>
            <article className="relative rounded-[16px] bg-[var(--bg-green)] p-6 text-white">
              <h3 className="max-w-[290px] text-[44px] leading-[1.08] font-medium">Как подобрать теплицу под ваши задачи</h3>
              <span className="absolute bottom-5 right-5 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-xl text-[var(--accent)]">
                →
              </span>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-green)] py-[86px]">
        <div className={`${containerClass} grid overflow-hidden rounded-[18px] bg-[#f5f5f7] lg:grid-cols-[1fr_1fr]`}>
          <div className="p-7 md:p-9">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-[57px] leading-[1.12] font-semibold">Рассчитать стоимость теплицы</h2>
              <button className="text-2xl text-black/35">×</button>
            </div>
            <div className="mb-7 grid grid-cols-3 text-center text-[14px] text-black/55">
              <span className="border-b-[4px] border-[var(--accent)] pb-1.5 font-semibold text-[var(--accent)]">Параметры</span>
              <span className="border-b-[4px] border-black/12 pb-1.5">Комплектация</span>
              <span className="border-b-[4px] border-black/12 pb-1.5">Контакты</span>
            </div>
            <div className="space-y-3 text-[15px]">
              <label className="block">
                <span className="mb-1 block font-semibold text-black/70">Площадь теплицы, м²</span>
                <span className="mb-2 block text-[13px] text-black/40">Минимальная площадь — 500 м²</span>
                <input
                  placeholder="Например: 5000"
                  className="w-full rounded-[9px] border border-black/12 bg-white px-4 py-2.5 text-[16px] outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-semibold text-black/70">Регион строительства</span>
                <input
                  placeholder="Минск, Беларусь"
                  className="w-full rounded-[9px] border border-black/12 bg-white px-4 py-2.5 text-[16px] outline-none"
                />
                <span className="mt-2 block text-[12px] text-black/40">Регион влияет на стоимость доставки и монтажа</span>
              </label>
            </div>
            <h3 className="mt-5 text-[18px] font-semibold">Тип теплицы</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {[
                ["Плёночная теплица", "от 8 000 $/м²"],
                ["Ягодная теплица", "от 12 000 $/м²"],
                ["Стеклянная теплица", "от 18 000 $/м²"],
              ].map(([title, price], i) => (
                <button
                  key={title}
                  className={`rounded-[10px] border p-3 text-left ${
                    i === 1 ? "border-[var(--accent)] bg-[#f5f8ea]" : "border-black/12 bg-white"
                  }`}
                >
                  <p className="text-[15px] font-semibold">{title}</p>
                  <p className="mt-1 text-[13px] font-semibold text-[var(--accent)]">{price}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-[10px] border border-black/12 bg-white px-4 py-2.5 text-[15px]">🍓 Клубника/Земляника</div>
            <div className="mt-5 flex justify-between border-t border-black/8 pt-4">
              <button className="rounded-[8px] bg-[#ececdc] px-4 py-2 text-[15px] font-semibold text-black/70">← Назад</button>
              <button className="rounded-[8px] bg-[var(--accent)] px-5 py-2 text-[15px] font-semibold text-white">Далее →</button>
            </div>
          </div>
          <Image src="/images/calc-tomato.png" alt="Томаты в теплице" width={680} height={560} className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="bg-white py-[86px]">
        <div className={containerClass}>
          <h2 className="text-center text-[52px] leading-[1.14] font-semibold">Комплектующие и инженерные системы</h2>
          <p className="mx-auto mt-4 max-w-[860px] text-center text-[18px] leading-[1.45] text-black/55">
            Каждый узел теплицы можно купить отдельно. Полный ассортимент оборудования для строительства и модернизации тепличных комплексов.
          </p>
          <div className="mt-10 grid overflow-hidden rounded-[14px] border border-black/10 md:grid-cols-2 lg:grid-cols-4">
            {components.map((item, index) => (
              <article
                key={`${item}-${index}`}
                className={`min-h-[188px] border-b border-r border-black/10 p-6 lg:min-h-[214px] ${
                  index % 4 === 3 ? "lg:border-r-0" : ""
                } ${index >= 12 ? "border-b-0" : ""} ${index === 0 ? "bg-[#88a63c] text-white" : "bg-[#efeee5]"}`}
              >
                <span
                  className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-lg ${
                    index === 0 ? "bg-white text-[#88a63c]" : "bg-[#f5f5eb] text-[#88a63c]"
                  }`}
                >
                  ⌁
                </span>
                <p className="text-[19px] leading-[1.3] font-semibold">{item}</p>
                {index === 0 ? (
                  <span className="mt-7 ml-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-xl text-[#88a63c]">
                    →
                  </span>
                ) : null}
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button className="rounded-[8px] bg-[var(--accent)] px-6 py-3 text-[16px] font-semibold text-white">Перейти к комплектующим</button>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-soft)] py-[86px]">
        <div className={containerClass}>
          <h2 className="text-center text-[54px] leading-[1.15] font-semibold">Реализованные проекты</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="rounded-[14px] bg-[#f5f5f7]">
                <Image src={project.image} alt={project.title} width={460} height={170} className="h-[230px] w-full rounded-t-[14px] object-cover" />
                <div className="p-6">
                  <h3 className="text-[24px] leading-[1.25] font-semibold">{project.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-[15px] text-black/58">
                    <li className="flex justify-between gap-4"><span>Культура:</span><b className="text-black/75">{project.culture}</b></li>
                    <li className="flex justify-between gap-4"><span>Регион:</span><b className="text-black/75">{project.region}</b></li>
                    <li className="flex justify-between gap-4"><span>Тип:</span><b className="text-black/75">{project.type}</b></li>
                  </ul>
                  <a href="#" className="mt-4 inline-block text-[16px] font-semibold text-[#93ae4f]">Смотреть проект →</a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-2">
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white text-[#98ae56]">‹</span>
            <span className="mt-4 h-2 w-2 rounded-full bg-[#98ae56]" />
            <span className="mt-4 h-2 w-2 rounded-full bg-[#98ae56]/40" />
            <span className="mt-4 h-2 w-2 rounded-full bg-[#98ae56]/40" />
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#e6e5d7] text-[#98ae56]">›</span>
          </div>
          <div className="mt-8 text-center">
            <button className="rounded-[8px] bg-white px-7 py-3 text-[16px] font-semibold text-black/60">Все проекты →</button>
          </div>
        </div>
      </section>

      <section className="bg-white py-[90px]">
        <div className={containerClass}>
          <h2 className="text-center text-[52px] leading-[1.14] font-semibold">Технологии и j,jheljdfybt</h2>
          <p className="mx-auto mt-4 max-w-[940px] text-center text-[17px] text-black/45">
            Используем европейские технологии и комплектующие, адаптированные под нагрузки СНГ
          </p>
          <div className="mt-10 overflow-hidden rounded-[16px] border border-black/8 bg-[#efeee2]">
            {technologyRows.map((item, index) => (
              <article
                key={item.title}
                className={`grid grid-cols-[54px_1fr_auto] items-center gap-4 border-b border-black/8 px-5 py-4 md:px-7 ${
                  index === technologyRows.length - 1 ? "border-b-0" : ""
                }`}
              >
                <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[10px] bg-[#f6f6f0] text-[20px] text-[#93ae4f]">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[20px] font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-[14px] text-black/45">{item.text}</p>
                </div>
                <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#f6f6f0] text-xl text-[#93ae4f]">→</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[86px]">
        <div className={containerClass}>
          <h2 className="max-w-[1160px] text-[54px] leading-[1.16] font-semibold">
            Мы совмещаем тепличные технологии и агроэкспертизу, чтобы ваши проекты в СНГ окупались быстрее
          </h2>
          <p className="mt-4 max-w-[980px] text-[17px] leading-[1.45] text-black/55">
            Работаем с ведущими производителями тепличного оборудования, адаптируя технологии под требования белорусского и международного рынка.
          </p>
          <div className="mt-9 grid gap-4 xl:grid-cols-4">
            <article className="relative overflow-hidden rounded-[16px]">
              <Image
                src="/images/expertise-left.png"
                alt="Опыт в тепличных проектах"
                width={400}
                height={340}
                className="h-[340px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/35 p-6 text-white">
                <p className="text-[56px] leading-none">5+ лет</p>
                <p className="mt-2 text-[22px]">в тепличных проектах</p>
                <p className="mt-2 text-[16px] leading-[1.35] text-white/88">
                  Мы внедряли решения для ягодных хозяйств и промышленных комплексов, адаптировали конструкции под разные регионы СНГ.
                </p>
              </div>
            </article>

            <article className="relative rounded-[16px] bg-[#efeee2] p-6">
              <p className="text-[64px] leading-[0.95]">10 000+ м²</p>
              <p className="mt-2 text-[28px]">в одном проекте</p>
              <p className="mt-3 text-[16px] leading-[1.42] text-black/55">
                Проектируем и поставляем многопролётные плёночные теплицы с наддувом и ягодные комплексы крупной площади с продуманной логистикой и инженерными системами под ключ.
              </p>
              <span className="absolute bottom-6 right-6 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-black text-[22px] text-white">→</span>
            </article>

            <article className="relative overflow-hidden rounded-[16px]">
              <Image
                src="/images/expertise-tomatoes.png"
                alt="Томаты"
                width={400}
                height={340}
                className="h-[340px] w-full object-cover"
              />
              <span className="absolute bottom-6 right-6 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#f4f4ea] text-[22px] text-[#93ae4f]">→</span>
            </article>

            <article className="relative rounded-[16px] bg-[#88a63c] p-6 text-white">
              <h3 className="text-[52px] leading-[1.08] font-medium">Комплексные решения «под ключ»</h3>
              <p className="mt-3 text-[16px] leading-[1.42] text-white/90">
                Берём на себя весь цикл: от подбора типа теплицы и концепции проекта до поставки каркаса, покрытия, полива, тумана, климат-контроля и электрооборудования.
              </p>
              <span className="absolute bottom-6 right-6 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[22px] text-[#88a63c]">→</span>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-soft)] py-[92px]">
        <div className={containerClass}>
          <h2 className="text-center text-[54px] leading-[1.14] font-semibold">Как мы работаем</h2>
          <p className="mt-4 text-center text-[17px] text-black/45">
            Путь клиента «Больших урожаев» — от заявки до работающего тепличного комплекса.
          </p>
          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <article key={item.step} className="relative rounded-[16px] bg-[#f5f5f7] p-6 pt-9">
                <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-[#89a838] px-4 py-2 text-[16px] font-semibold text-white shadow-md">
                  {item.step}
                </span>
                <h3 className="text-[24px] leading-[1.25] font-semibold">{item.title}</h3>
                <p className="mt-3 text-[16px] leading-[1.45] text-black/52">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-green)] py-[76px]">
        <div className={`${containerClass} grid items-center gap-8 rounded-[22px] bg-[#f5f5f7] px-7 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-10`}>
          <div>
            <h2 className="max-w-[700px] text-[66px] leading-[1.12] font-semibold">Большие Урожаи начинаются с правильной теплицы</h2>
            <p className="mt-5 max-w-[650px] text-[18px] leading-[1.42] text-black/58">
              Оставьте заявку, и наш инженер свяжется с вами для обсуждения деталей и подготовки коммерческого предложения
            </p>
            <p className="mt-4 text-[16px] text-black/48">Работаем только под заказ. Стоимость и состав проекта считаются индивидуально.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-[8px] bg-[var(--accent)] px-5 py-2.5 text-[16px] font-semibold text-white">Рассчитать стоимость</button>
              <button className="rounded-[8px] bg-[#ececdc] px-5 py-2.5 text-[16px] font-semibold">Оставить заявку</button>
            </div>
          </div>
          <Image src="/images/cta-tomatoes.png" alt="Томаты" width={560} height={320} className="h-auto w-full object-contain" />
        </div>
      </section>

      <footer className="bg-[linear-gradient(90deg,#343f24_0%,#3f472f_100%)] py-10 text-white">
        <div className={containerClass}>
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Image src="/images/logo-footer.png" alt="Большие урожаи" width={230} height={58} className="h-auto w-[230px]" />
              <p className="mt-4 text-[16px] leading-[1.35] text-white/70">Промышленные теплицы и комплектующие для стран СНГ</p>
            </div>
            <div>
              <h3 className="text-[19px] font-semibold">Каталог</h3>
              <ul className="mt-3 space-y-1.5 text-[16px] text-white/72">
                <li>Каталог теплиц</li>
                <li>Комплектующие</li>
                <li>Оборудование</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[19px] font-semibold">Компания</h3>
              <ul className="mt-3 space-y-1.5 text-[16px] text-white/72">
                <li>О компании</li>
                <li>Контакты</li>
                <li>Проекты</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[19px] font-semibold">Контакты</h3>
              <ul className="mt-3 space-y-1.5 text-[16px] text-white/72">
                <li>+7 (000) 000-00-00</li>
                <li>info@greenhouse.ru</li>
                <li>◌  ◌  ◌  ◌  ◌</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-5 text-[15px] text-white/62 md:flex-row md:items-center md:justify-between">
            <p>© 2026 «Большие урожаи». Все права защищены.</p>
            <a href="#" className="text-[#90a941]">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
