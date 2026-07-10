// Repos públicos de github.com/Lutren - listados en el sitio y en /llms.txt
// para descubribilidad por humanos y por IAs.
export interface Repo {
  name: string;
  lang?: string;
  desc: string;
  cat: string;
}

export const GH_USER = 'Lutren';

export const repos: Repo[] = [
  // Núcleo de evidencia / gates (open - core OSIT)
  {
    name: 'obsai - core',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'Núcleo de evidencia sin dependencias para agentes: observation envelopes, procedencia, continuidad de memoria y claim gates para reducir alucinación.'
  },
  {
    name: 'residueos',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'ActionGate local - first: decisiones APPROVE/REVIEW/BLOCK con evidencia, receptores, revisión humana y auditoría en SQLite.'
  },
  {
    name: 'residueos - core',
    cat: 'Evidencia y gates',
    desc: 'Primitivas ActionGate: approve/review/block, ledgers de residuo y revisión auditable de acciones de IA.'
  },
  {
    name: 'observacionismo - gate',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'SDK MIT pequeño para flujos de IA con gate de evidencia: jamming, costo, aprobación y witness - ledger antes de actuar.'
  },
  {
    name: 'obs - info - kernel - lite',
    cat: 'Evidencia y gates',
    desc: 'Registro de claims y evidence - store ligero: etiqueta brechas de evidencia, anti - información y candidatos a dark - information.'
  },
  {
    name: 'obs - safe - integration - kit',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'Kernel de integración local - first para agentes más seguros: ObservationEnvelope, EvidenceStore, ActionGate y dry - run.'
  },
  {
    name: 'ai - web - gateway - observacionista',
    cat: 'Evidencia y gates',
    desc: 'Gateway de evidencia para observaciones de API, lector y navegador con routing, reintentos, caché e interfaces MCP.'
  },
  // Seguridad de agentes
  {
    name: 'rapid - agent - guardian',
    lang: 'Python',
    cat: 'Seguridad de agentes',
    desc: 'Gate de seguridad para trabajo real: evidence envelopes, checkpoints de aprobación humana y guardrails de release.'
  },
  {
    name: 'safe - exec',
    lang: 'Python',
    cat: 'Seguridad de agentes',
    desc: 'Capa de ejecución segura para tools de LLM: gates conscientes de fatiga, witness logs y chequeos de política.'
  },
  {
    name: 'agent - handoff - protocol',
    cat: 'Seguridad de agentes',
    desc: 'Evita la pérdida de memoria entre sesiones: workflow práctico de handoff para agentes de código.'
  },
  {
    name: 'agent - release - checklist',
    cat: 'Seguridad de agentes',
    desc: 'Checklist de release para software hecho con IA: secretos, licencias, tests, claims, evidencia y aprobación humana.'
  },
  {
    name: 'claudio - system - regulator',
    lang: 'Python',
    cat: 'Seguridad de agentes',
    desc: 'Kernel regulador 24/7 public - safe: presión del host, retención de fuentes, gates de publicación y reportes de evidencia.'
  },
  // Labs / investigación falsable
  {
    name: 'duat - lab',
    cat: 'Labs e investigación',
    desc: 'Lab falsable observer - aware: demos sintéticas, gates de evidencia, controles negativos y witness logs.'
  },
  {
    name: 'duat - genesis',
    lang: 'Python',
    cat: 'Labs e investigación',
    desc: 'Sandbox de simulación sintética MIT para corridas observables, ejemplos de falsadores y límites públicos.'
  },
  {
    name: 'medioevo - osit - formal - lab',
    lang: 'Python',
    cat: 'Labs e investigación',
    desc: 'Lab formal public - safe de métricas MEDIOEVO/OSIT: H_eff, R, Phi_eff, residuo MTS y gates.'
  },
  {
    name: 'observational - calibration - toolkit',
    cat: 'Labs e investigación',
    desc: 'Calibración y falsación de claims de IA: modelos nulos, grados de evidencia y límites de claim.'
  },
  {
    name: 'data - curation - observatory',
    cat: 'Labs e investigación',
    desc: 'Workflow de curaduría para proyectos de IA: manifiestos, fichas técnicas, deduplicación y etiquetas de evidencia.'
  },
  {
    name: 'data - double - slit',
    lang: 'Python',
    cat: 'Labs e investigación',
    desc: 'Simulador de interferencia de datos inspirado en lo cuántico: interpretaciones paralelas, efecto de observación y trazas de decisión.'
  },
  {
    name: 'gemma - observacionismo - cleanup',
    lang: 'Python',
    cat: 'Labs e investigación',
    desc: 'Toolkit MIT de limpieza/observación con fixtures sintéticas; sin pesos, prompts ni runtime de Claudio.'
  },
  // UI / display
  {
    name: 'neurostate - ui',
    cat: 'UI y display',
    desc: 'Frontera UI public - safe para observabilidad de estado de agentes local - first; sin conectores de runtime privado.'
  },
  {
    name: 'medioevo - duat - public - release',
    lang: 'TypeScript',
    cat: 'UI y display',
    desc: 'Release público de display de orquestación DUAT / MEDIOEVO.'
  },
  // Herramientas de autor / MEDIOEVO
  {
    name: 'medioevo - tools',
    lang: 'Python',
    cat: 'Herramientas de autor',
    desc: 'Herramientas open - source de escritura y publicación para autores indie: prep KDP, metadata, workflows asistidos por IA y orquestación multi - modelo.'
  },
  // Índices / blueprint / hub
  {
    name: 'la - biblioteca - de - alejandria',
    cat: 'Índices y hub',
    desc: 'Índice público de repos saneados, límites, whitepapers y enlaces de apoyo.'
  },
  {
    name: 'claudio - os - blueprint',
    lang: 'Python',
    cat: 'Índices y hub',
    desc: 'Blueprint del SO Claudio (solo plano; no afirma ISO terminada).'
  },
  {
    name: 'Lutren',
    cat: 'Índices y hub',
    desc: 'Perfil y hub de GitHub Sponsors: sistemas de IA con gate de evidencia, seguridad de agentes local - first, continuidad de memoria y herramientas MEDIOEVO.'
  },
];

export const categories = [
  'Evidencia y gates',
  'Seguridad de agentes',
  'Labs e investigación',
  'UI y display',
  'Herramientas de autor',
  'Índices y hub'
];
