// Repos publicos de github.com/Lutren listados en el sitio y en /llms.txt.
// Los `name` son slugs reales para construir URLs; no agregar espacios.
export interface Repo {
  name: string;
  lang?: string;
  desc: string;
  cat: string;
}

export const GH_USER = 'Lutren';

export const repos: Repo[] = [
  {
    name: 'obsai-core',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'Nucleo de evidencia sin dependencias para envelopes, procedencia, continuidad de memoria y claim gates.'
  },
  {
    name: 'residueos',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'ActionGate local-first: decisiones APPROVE, REVIEW y BLOCK con evidencia, revision humana y auditoria en SQLite.'
  },
  {
    name: 'residueos-core',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'Primitivas para ledgers de residuo, revision auditable y gates antes de acciones de IA.'
  },
  {
    name: 'observacionismo-gate',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'SDK pequeno para flujos de IA con evidencia, jamming, costo, aprobacion y witness ledger antes de actuar.'
  },
  {
    name: 'obs-info-kernel-lite',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'Registro ligero de claims y evidence store para brechas de evidencia, anti-informacion y candidatos dark-information.'
  },
  {
    name: 'obs-safe-integration-kit',
    lang: 'Python',
    cat: 'Evidencia y gates',
    desc: 'Kernel local-first para integrar agentes con ObservationEnvelope, EvidenceStore, ActionGate y dry-run.'
  },
  {
    name: 'ai-web-gateway-observacionista',
    cat: 'Evidencia y gates',
    desc: 'Gateway de evidencia para observaciones de API, lector y navegador con routing, reintentos, cache e interfaces MCP.'
  },
  {
    name: 'rapid-agent-guardian',
    lang: 'Python',
    cat: 'Seguridad de agentes',
    desc: 'Gate de seguridad para trabajo real: evidence envelopes, checkpoints humanos y guardrails de release.'
  },
  {
    name: 'safe-exec',
    lang: 'Python',
    cat: 'Seguridad de agentes',
    desc: 'Capa de ejecucion segura para tools de LLM con gates conscientes de fatiga, witness logs y chequeos de politica.'
  },
  {
    name: 'agent-handoff-protocol',
    cat: 'Seguridad de agentes',
    desc: 'Workflow practico de handoff para evitar perdida de memoria entre sesiones de agentes de codigo.'
  },
  {
    name: 'agent-release-checklist',
    cat: 'Seguridad de agentes',
    desc: 'Checklist de release para software hecho con IA: secretos, licencias, tests, claims, evidencia y aprobacion humana.'
  },
  {
    name: 'claudio-system-regulator',
    lang: 'Python',
    cat: 'Seguridad de agentes',
    desc: 'Kernel regulador public-safe: presion del host, retencion de fuentes, gates de publicacion y reportes de evidencia.'
  },
  {
    name: 'duat-lab',
    cat: 'Labs e investigacion',
    desc: 'Lab falsable observer-aware: demos sinteticas, gates de evidencia, controles negativos y witness logs.'
  },
  {
    name: 'duat-genesis',
    lang: 'Python',
    cat: 'Labs e investigacion',
    desc: 'Sandbox de simulacion sintetica MIT para corridas observables, ejemplos de falsadores y limites publicos.'
  },
  {
    name: 'medioevo-osit-formal-lab',
    lang: 'Python',
    cat: 'Labs e investigacion',
    desc: 'Lab formal public-safe de metricas MEDIOEVO/OSIT: H_eff, R, Phi_eff, residuo MTS y gates.'
  },
  {
    name: 'observational-calibration-toolkit',
    cat: 'Labs e investigacion',
    desc: 'Calibracion y falsacion de claims de IA con modelos nulos, grados de evidencia y limites de claim.'
  },
  {
    name: 'data-curation-observatory',
    cat: 'Labs e investigacion',
    desc: 'Workflow de curaduria para proyectos de IA: manifiestos, fichas tecnicas, deduplicacion y etiquetas de evidencia.'
  },
  {
    name: 'data-double-slit',
    lang: 'Python',
    cat: 'Labs e investigacion',
    desc: 'Simulador de interferencia de datos con interpretaciones paralelas, efecto de observacion y trazas de decision.'
  },
  {
    name: 'gemma-observacionismo-cleanup',
    lang: 'Python',
    cat: 'Labs e investigacion',
    desc: 'Toolkit MIT de limpieza y observacion con fixtures sinteticas. No incluye pesos, prompts ni runtime privado.'
  },
  {
    name: 'neurostate-ui',
    cat: 'UI y display',
    desc: 'Frontera UI public-safe para observabilidad de estado de agentes local-first sin conectores de runtime privado.'
  },
  {
    name: 'medioevo-duat-public-release',
    lang: 'TypeScript',
    cat: 'UI y display',
    desc: 'Release publico del display de orquestacion DUAT / MEDIOEVO con demos sinteticas.'
  },
  {
    name: 'medioevo-tools',
    lang: 'Python',
    cat: 'Herramientas de autor',
    desc: 'Herramientas open-source de escritura y publicacion para autores indie: prep KDP, metadata y workflows asistidos por IA.'
  },
  {
    name: 'la-biblioteca-de-alejandria',
    cat: 'Indices y hub',
    desc: 'Indice publico de repos saneados, limites, whitepapers y enlaces de apoyo.'
  },
  {
    name: 'claudio-os-blueprint',
    lang: 'Python',
    cat: 'Indices y hub',
    desc: 'Blueprint de Claudio OS. Plano publico-seguro, sin afirmar ISO terminada.'
  },
  {
    name: 'Lutren',
    cat: 'Indices y hub',
    desc: 'Perfil y hub de GitHub Sponsors para sistemas de IA con gates, continuidad y herramientas MEDIOEVO.'
  },
];

export const categories = [
  'Evidencia y gates',
  'Seguridad de agentes',
  'Labs e investigacion',
  'UI y display',
  'Herramientas de autor',
  'Indices y hub'
];
