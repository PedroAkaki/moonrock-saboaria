export type RoadmapTopic = {
  id: string;
  title: string;
  href?: string;
};

export type RoadmapNode = {
  slug: string;
  title: string;
  section?: string;
  href?: string;
  leftTopics?: RoadmapTopic[];
  rightTopics?: RoadmapTopic[];
};

export const roadmapNodes: RoadmapNode[] = [
  {
    slug: "seguranca",
    title: "Segurança",
    section: "Fundamentos",
    leftTopics: [
      { id: "epi", title: "EPI obrigatório" },
      { id: "soda-na-agua", title: "Soda na água" },
      { id: "ventilacao", title: "Ventilação" },
    ],
    rightTopics: [
      { id: "utensilios", title: "Utensílios separados" },
      { id: "primeiros-socorros", title: "Primeiros socorros" },
      { id: "cosmetico-vs-limpeza", title: "Cosmético vs limpeza" },
    ],
  },
  {
    slug: "base-glicerinada",
    title: "Base Glicerinada",
    section: "Fundamentos",
    href: "/aprendizado/base-glicerinada",
    leftTopics: [
      { id: "fusao", title: "Fusão controlada" },
      { id: "temperatura", title: "Temperatura" },
      { id: "higroscopia", title: "Higroscopia" },
    ],
    rightTopics: [
      { id: "bolhas", title: "Bolhas e álcool" },
      { id: "aditivos", title: "Aditivos" },
      { id: "receita-mel", title: "Receita: Base com mel", href: "/receitas" },
    ],
  },
  {
    slug: "sabao-de-oleo-usado",
    title: "Sabão de Óleo Usado",
    section: "Ingredientes",
    href: "/aprendizado/sabao-de-oleo-usado",
    leftTopics: [
      { id: "oleo-degradado", title: "Óleo degradado" },
      { id: "sap-incerto", title: "SAP incerto" },
      { id: "filtragem", title: "Filtragem" },
      { id: "superfat-seguranca", title: "Superfat de segurança" },
    ],
    rightTopics: [
      { id: "limpeza-domestica", title: "Limpeza doméstica" },
      { id: "nao-usar-corpo", title: "Não usar no corpo" },
      { id: "receita-oleo-usado", title: "Receita: Óleo usado", href: "/receitas" },
    ],
  },
  {
    slug: "oleos-gorduras",
    title: "Óleos e Gorduras",
    section: "Ingredientes",
    leftTopics: [
      { id: "sap-naoh", title: "SAP NaOH" },
      { id: "sap-koh", title: "SAP KOH" },
      { id: "iodo", title: "Índice de iodo" },
    ],
    rightTopics: [
      { id: "ins", title: "INS" },
      { id: "dos", title: "DOS" },
      { id: "biblioteca-oleos", title: "Biblioteca de Óleos", href: "/oleos" },
    ],
  },
  {
    slug: "cold-process-basico",
    title: "Cold Process Básico",
    section: "Cold Process",
    href: "/aprendizado/cold-process-basico",
    leftTopics: [
      { id: "naoh-agua", title: "NaOH + Água" },
      { id: "superfat", title: "Superfat" },
      { id: "trace", title: "Trace" },
    ],
    rightTopics: [
      { id: "temperatura-cp", title: "Temperatura" },
      { id: "gel-phase", title: "Gel Phase" },
      { id: "cura", title: "Cura" },
      { id: "receita-azeite-coco", title: "Receita: Azeite & Coco", href: "/receitas" },
    ],
  },
  {
    slug: "controle-de-formulacao",
    title: "Controle de Formulação",
    section: "Cold Process",
    leftTopics: [
      { id: "dureza", title: "Dureza" },
      { id: "limpeza-prop", title: "Limpeza" },
      { id: "condicionamento", title: "Condicionamento" },
    ],
    rightTopics: [
      { id: "espuma", title: "Espuma" },
      { id: "substituicao", title: "Substituição de óleos" },
      { id: "calculadora", title: "Calculadora", href: "/calculadora" },
    ],
  },
  {
    slug: "hot-process",
    title: "Hot Process",
    section: "Métodos",
    leftTopics: [
      { id: "cozimento", title: "Cozimento" },
      { id: "pasta-gel", title: "Pasta/Gel" },
      { id: "uso-rapido", title: "Uso mais rápido" },
    ],
    rightTopics: [
      { id: "textura-rustica", title: "Textura rústica" },
      { id: "resgate-lote", title: "Resgate de lote" },
    ],
  },
  {
    slug: "cold-process-avancado",
    title: "Cold Process Avançado",
    section: "Métodos",
    leftTopics: [
      { id: "swirls", title: "Swirls" },
      { id: "camadas", title: "Camadas" },
      { id: "cores-naturais", title: "Cores naturais" },
    ],
    rightTopics: [
      { id: "fragrancias", title: "Fragrâncias aceleradoras" },
      { id: "vanilina", title: "Vanilina" },
      { id: "design", title: "Design" },
    ],
  },
  {
    slug: "saboaria-liquida-koh",
    title: "Saboaria Líquida KOH",
    section: "Avançado",
    leftTopics: [
      { id: "naoh-vs-koh", title: "NaOH vs KOH" },
      { id: "pasta-mae", title: "Pasta mãe" },
      { id: "diluicao", title: "Diluição" },
    ],
    rightTopics: [
      { id: "clareza", title: "Clareza" },
      { id: "viscosidade", title: "Viscosidade" },
      { id: "conservacao", title: "Conservação" },
    ],
  },
  {
    slug: "syndet-avancado",
    title: "Syndet Avançado",
    section: "Avançado",
    leftTopics: [
      { id: "nao-sabao", title: "Não é sabão" },
      { id: "sci", title: "SCI" },
      { id: "slsa", title: "SLSA" },
    ],
    rightTopics: [
      { id: "capb", title: "CAPB" },
      { id: "ph-acido", title: "pH ácido" },
      { id: "barra-syndet", title: "Barra syndet" },
    ],
  },
];
