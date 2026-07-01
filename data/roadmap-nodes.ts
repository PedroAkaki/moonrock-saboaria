export type RoadmapNodeType = "module" | "foundation" | "tool" | "milestone";
export type ForumStatusSource = "learning-module" | "always-current" | "always-available" | "locked";
export type TopicType = "concept" | "safety" | "tool" | "recipe" | "checklist";

export interface RoadmapTopic {
  id: string;
  title: string;
  type: TopicType;
  href?: string;
  importance?: "primary" | "secondary";
}

export interface RoadmapNode {
  id: string;
  slug: string;
  title: string;
  type: RoadmapNodeType;
  section: string;
  href?: string;
  statusSource: ForumStatusSource;
  leftTopics?: RoadmapTopic[];
  rightTopics?: RoadmapTopic[];
}

export const roadmapNodes: RoadmapNode[] = [
  {
    id: "seguranca",
    slug: "seguranca",
    title: "Segurança",
    type: "foundation",
    section: "Fundamentos",
    statusSource: "always-current",
    leftTopics: [
      { id: "epi", title: "EPI obrigatório", type: "safety" },
      { id: "soda-na-agua", title: "Soda na água", type: "safety" },
      { id: "ventilacao", title: "Ventilação", type: "safety" },
    ],
    rightTopics: [
      { id: "utensilios", title: "Utensílios separados", type: "safety" },
      { id: "primeiros-socorros", title: "Primeiros socorros", type: "safety", importance: "secondary" },
      { id: "cosmetico-vs-limpeza", title: "Cosmético vs limpeza", type: "concept" },
    ],
  },
  {
    id: "base-glicerinada",
    slug: "base-glicerinada",
    title: "Base Glicerinada",
    type: "module",
    section: "Fundamentos",
    href: "/aprendizado/base-glicerinada",
    statusSource: "learning-module",
    leftTopics: [
      { id: "fusao", title: "Fusão controlada", type: "concept" },
      { id: "temperatura", title: "Temperatura", type: "concept" },
      { id: "higroscopia", title: "Higroscopia", type: "concept" },
    ],
    rightTopics: [
      { id: "bolhas", title: "Bolhas e álcool", type: "concept" },
      { id: "aditivos", title: "Aditivos", type: "concept" },
      { id: "receita-mel", title: "Receita: Base com mel", type: "recipe", href: "/receitas" },
    ],
  },
  {
    id: "sabao-de-oleo-usado",
    slug: "sabao-de-oleo-usado",
    title: "Sabão de Óleo Usado",
    type: "module",
    section: "Ingredientes",
    href: "/aprendizado/sabao-de-oleo-usado",
    statusSource: "learning-module",
    leftTopics: [
      { id: "oleo-degradado", title: "Óleo degradado", type: "concept" },
      { id: "sap-incerto", title: "SAP incerto", type: "concept" },
      { id: "filtragem", title: "Filtragem", type: "concept" },
      { id: "superfat-seguranca", title: "Superfat de segurança", type: "concept" },
    ],
    rightTopics: [
      { id: "limpeza-domestica", title: "Limpeza doméstica", type: "concept" },
      { id: "nao-usar-corpo", title: "Não usar no corpo", type: "safety" },
      { id: "receita-oleo-usado", title: "Receita: Óleo usado", type: "recipe", href: "/receitas" },
    ],
  },
  {
    id: "oleos-gorduras",
    slug: "oleos-gorduras",
    title: "Óleos e Gorduras",
    type: "tool",
    section: "Ingredientes",
    statusSource: "always-available",
    leftTopics: [
      { id: "sap-naoh", title: "SAP NaOH", type: "concept" },
      { id: "sap-koh", title: "SAP KOH", type: "concept" },
      { id: "iodo", title: "Índice de iodo", type: "concept" },
    ],
    rightTopics: [
      { id: "ins", title: "INS", type: "concept" },
      { id: "dos", title: "DOS", type: "concept" },
      { id: "biblioteca-oleos", title: "Biblioteca de Óleos", type: "tool", href: "/oleos" },
    ],
  },
  {
    id: "cold-process-basico",
    slug: "cold-process-basico",
    title: "Cold Process Básico",
    type: "module",
    section: "Cold Process",
    href: "/aprendizado/cold-process-basico",
    statusSource: "learning-module",
    leftTopics: [
      { id: "naoh-agua", title: "NaOH + Água", type: "concept" },
      { id: "superfat", title: "Superfat", type: "concept" },
      { id: "trace", title: "Trace", type: "concept" },
    ],
    rightTopics: [
      { id: "temperatura-cp", title: "Temperatura", type: "concept" },
      { id: "gel-phase", title: "Gel Phase", type: "concept" },
      { id: "cura", title: "Cura", type: "concept" },
      { id: "receita-azeite-coco", title: "Receita: Azeite & Coco", type: "recipe", href: "/receitas" },
    ],
  },
  {
    id: "controle-de-formulacao",
    slug: "controle-de-formulacao",
    title: "Controle de Formulação",
    type: "module",
    section: "Cold Process",
    statusSource: "learning-module",
    leftTopics: [
      { id: "dureza", title: "Dureza", type: "concept" },
      { id: "limpeza-prop", title: "Limpeza", type: "concept" },
      { id: "condicionamento", title: "Condicionamento", type: "concept" },
    ],
    rightTopics: [
      { id: "espuma", title: "Espuma", type: "concept" },
      { id: "substituicao", title: "Substituição de óleos", type: "concept" },
      { id: "calculadora", title: "Calculadora", type: "tool", href: "/calculadora" },
    ],
  },
  {
    id: "hot-process",
    slug: "hot-process",
    title: "Hot Process",
    type: "module",
    section: "Métodos",
    href: "/aprendizado/hot-process",
    statusSource: "locked",
    leftTopics: [
      { id: "cozimento", title: "Cozimento", type: "concept" },
      { id: "pasta-gel", title: "Pasta/Gel", type: "concept" },
      { id: "uso-rapido", title: "Uso mais rápido", type: "concept" },
    ],
    rightTopics: [
      { id: "textura-rustica", title: "Textura rústica", type: "concept" },
      { id: "resgate-lote", title: "Resgate de lote", type: "concept" },
    ],
  },
  {
    id: "cold-process-avancado",
    slug: "cold-process-avancado",
    title: "Cold Process Avançado",
    type: "module",
    section: "Métodos",
    statusSource: "locked",
    leftTopics: [
      { id: "swirls", title: "Swirls", type: "concept" },
      { id: "camadas", title: "Camadas", type: "concept" },
      { id: "cores-naturais", title: "Cores naturais", type: "concept" },
    ],
    rightTopics: [
      { id: "fragrancias", title: "Fragrâncias aceleradoras", type: "concept" },
      { id: "vanilina", title: "Vanilina", type: "concept" },
      { id: "design", title: "Design", type: "concept" },
    ],
  },
  {
    id: "saboaria-liquida-koh",
    slug: "saboaria-liquida-koh",
    title: "Saboaria Líquida KOH",
    type: "module",
    section: "Avançado",
    statusSource: "locked",
    leftTopics: [
      { id: "naoh-vs-koh", title: "NaOH vs KOH", type: "concept" },
      { id: "pasta-mae", title: "Pasta mãe", type: "concept" },
      { id: "diluicao", title: "Diluição", type: "concept" },
    ],
    rightTopics: [
      { id: "clareza", title: "Clareza", type: "concept" },
      { id: "viscosidade", title: "Viscosidade", type: "concept" },
      { id: "conservacao", title: "Conservação", type: "concept" },
    ],
  },
  {
    id: "syndet-avancado",
    slug: "syndet-avancado",
    title: "Syndet Avançado",
    type: "milestone",
    section: "Avançado",
    statusSource: "locked",
    leftTopics: [
      { id: "nao-sabao", title: "Não é sabão", type: "concept" },
      { id: "sci", title: "SCI", type: "concept" },
      { id: "slsa", title: "SLSA", type: "concept" },
    ],
    rightTopics: [
      { id: "capb", title: "CAPB", type: "concept" },
      { id: "ph-acido", title: "pH ácido", type: "concept" },
      { id: "barra-syndet", title: "Barra syndet", type: "concept" },
    ],
  },
];
