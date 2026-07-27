#!/usr/bin/env python3
"""
AGENTE CEO 03: GROWTH MARKETING Y VENTAS
Chief Growth Officer - Funnel de adquisicion, estrategias de monetizacion, ejecucion comercial

Analiza: Canales de adquisicion, conversion, funnel, partnerships
Entrega: Playbook de growth, funnel completo, estrategia ventas B2B

Input: CEO_01_ESTRATEGIA_NEGOCIO.json, CEO_02_FINANCIERO_OPERACIONES.json
Output: CEO_03_GROWTH_VENTAS.json
"""

import json
import random
from datetime import datetime
from pathlib import Path

OUTPUT_DIR = Path("E:/-=Medioevo=-/CONSOLIDADO_6MAS1/AGENT_BESTSELLER/AGENTES/OUTPUTS")

def cargar_estrategia():
    """Carga la estrategia del Agente CEO 01"""
    ruta = OUTPUT_DIR / "CEO_01_ESTRATEGIA_NEGOCIO.json"
    if ruta.exists():
        with open(ruta, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def funnel_adquisicion_completo():
    """Funnel de adquisicion detallado por canal"""

    funnel = {
        "canales_organicos": {
            "booktok_bookstagram": {
                "descripcion": "Contenido viral organico en plataformas libros",
                "alcance_mensual_estimado": "50,000-200,000 vistas",
                "ctr": "3-7%",
                "conversion_landing": "2-5%",
                "tasa_final_compra": "0.5-2%",
                "costo": "$0 (solo tiempo/esfuerzo)",
                "cac_efectivo": "$2-5",
                "volumen_mensual": "100-500 conversions",
                "estrategia": [
                    "3-5 posts diarios con hooks validados",
                    "Aprovechar hashtags trending (#books, #fyp, #scifi)",
                    "Colaboraciones con booktokers 10K-100K followers",
                    "Series tipo: 'Libros que te hacen cuestionar la realidad'",
                    "Reveal de easter eggs para create FOMO"
                ],
                "contenido_tipo": [
                    "POV: Descubriste que la realidad es un archivo",
                    "Rate this cover: which one catches your eye?",
                    "Series recommendations for complex minds",
                    "Hidden patterns in books (saga 6+1)",
                    "If you liked Dark, try this"
                ]
            },
            "reddit_comunidad": {
                "descripcion": "Engagement en comunidades de lectores",
                "subreddits": ["r/scifi", "r/books", "r/suggestmeabook", "r/writing", "r/fantasy"],
                "estrategia": "Participacion autentica + AMAs",
                "volumen_mensual": "50-200 conversions",
                "cac": "$5-15",
                "contenido": [
                    "AMA: Soy escritor indie desarrollando saga 6+1 libros basada en teoria cientifica real",
                    "Recommendation: Dark meets literature - any suggestions?",
                    "Discussion: Books with hidden layers (Rayuela style)?"
                ]
            },
            "seo_organico_medioevo_space": {
                "descripcion": "Trafico organico a la plataforma",
                "keywords": ["scifi compleja espanol", "sagas como Dark", "teoria cientifica ficcion", "libros con capas ocultas"],
                "volumen_mensual": "30-100 conversions (Ano 1)",
                "cac": "$3-8",
                "crecimiento": "20% MoM"
            },
            "newsletter_substack": {
                "descripcion": "Owned audience - newsletter propia",
                "meta_suscripcion": "Mes 6: 1000+ subscribers",
                "open_rate": "40-60%",
                "ctr": "8-15%",
                "cac": "$2-4",
                "retencion": "Alta - owned channel"
            }
        },

        "canales_pagos": {
            "amazon_ads": {
                "descripcion": "Sponsored Products en KDP",
                "presupuesto_mensual": "$500-2,000",
                "acos_target": "30-50%",
                "volumen_mensual": "200-800 ventas",
                "cac": "$3-8",
                "roi": "200-300%",
                "estrategia": [
                    "Auto-targeting libros similares (Dark, Ted Chiang, etc.)",
                    "Keyword targeting: 'sci fi complex', 'philosophical fiction'",
                    "$0.99 Book 1 ad + $4.99 upsell"
                ]
            },
            "facebook_instagram_ads": {
                "descripcion": "Ads a audiencia similaritarios",
                "presupuesto_mensual": "$300-1,000",
                "cpc": "$0.30-0.80",
                "conversion_website": "3-8%",
                "volumen_mensual": "100-300 conversions",
                "cac": "$8-15",
                "audiencias": [
                    "Intereses: Dark, Ted Chiang, Black Mirror, science documentaries",
                    "Comportamiento: Kindle users, Amazon purchasers",
                    "Lookalike: Custom audiences de compradores"
                ]
            },
            "bookbub_featured_deals": {
                "descripcion": "Featured Deals en BookBub",
                "costo": "$200-800 (depende categoria)",
                "volumen_feature": "500-2,000 downloads",
                "cac": "$0.10-0.40",
                "retencion": "Baja a compras full-price",
                "uso": "Book 1 a $0.99 o gratis"
            }
        },

        "canales_partnerships": {
            "influencer_booktokers": {
                "descripcion": "Colaboracion con creadores libros",
                "tier_micro": {"seguidores": "10K-50K", "costo": "$50-200", "volumen": "50-200 ventas"},
                "tier_mid": {"seguidores": "50K-200K", "costo": "$200-800", "volumen": "200-800 ventas"},
                "tier_macro": {"seguidores": "200K+", "costo": "$1,000-5,000", "volumen": "1,000-5,000 ventas"},
                "estrategia": "Empezar micro, escalar a mid, aspirar macro Ano 2"
            },
            "podcasts_libros": {
                "descripcion": "Entrevistas en podcasts de literatura",
                "targets": ["Entre Libros", "Naufragios", "Cultura de masas"],
                "costo": "$0-200 (mayoria gratis)",
                "volumen": "20-100 ventas por aparicion",
                "brand_building": "Alto"
            },
            "cross_promotion_autores": {
                "descripcion": "Newsletter swaps con autores similares",
                "costo": "$0",
                "volumen": "10-50 conversions por swap",
                "relacion": "Networking continuo"
            }
        },

        "funnel_completo": {
            "awareness": {
                "fuentes": ["BookTok", "Reddit", "SEO", "Ads"],
                "volumen_mensual": "100,000-500,000 impressions",
                "conversion_al_siguiente": "3-7%"
            },
            "interest": {
                "accion": "Visit landing page / medioevo.space",
                "volumen": "3,000-35,000 visits",
                "conversion": "25-40%"
            },
            "consideration": {
                "accion": "Sample chapter download / Look Inside",
                "volumen": "750-14,000",
                "conversion": "30-60%"
            },
            "conversion": {
                "accion": "Purchase Book 1",
                "volumen": "225-8,400",
                "valor_promedio_orden": "$4.99-9.99"
            },
            "retention": {
                "accion": "Read through rate a Books 2-3",
                "porcentaje": "60-70%",
                "estrategia": "Email sequence, community, content"
            },
            "advocacy": {
                "accion": "Reviews, recommendations, referrals",
                "porcentaje": "5-15%",
                "impacto": "Organic growth multiplier"
            }
        }
    }

    return funnel

def playbook_growth_ejecutivo():
    """Playbook de growth tactics"""

    playbook = {
        "tacticas_ano_1": {
            "Q1_pre_lanzamiento": {
                "foco": "Build anticipation + Community",
                "acciones": [
                    "Lanzar Discord server 'El Archivo'",
                    "Crear newsletter Substack",
                    "Comenzar BookTok con contenido lore",
                    "Setup medioevo.space basic",
                    "Beta reading group 50 personas",
                    "ARC giveaways a booktokers"
                ],
                "metricas": ["500 Discord members", "200 newsletter subs", "5000 TikTok followers"]
            },
            "Q2_lanzamiento": {
                "foco": "Launch Book 1 + Traction",
                "acciones": [
                    "Lanzamiento Book 1 (ebook $0.99)",
                    "Amazon ads scale up",
                    "BookBub featured deal",
                    "PR blast (press releases)",
                    "Reddit AMA",
                    "Influencer campaign (10 micro)"
                ],
                "metricas": ["1000 ventas Book 1", "200 reviews", "4.3+ rating", "2000 community"]
            },
            "Q3_sostenimiento": {
                "foco": "Retention + Book 2 prep",
                "acciones": [
                    "Lanzar Book 2",
                    "Box set Books 1-2",
                    "Content marketing (lore articles)",
                    "Email nurture sequences",
                    "Retargeting campaigns"
                ],
                "metricas": ["50% read-through", "Community 3500", "Revenue run-rate $60K+"]
            },
            "Q4_escalamiento": {
                "foco": "Scale winners + Holiday push",
                "acciones": [
                    "Lanzar Book 3",
                    "Holiday campaigns (Black Friday)",
                    "Box set completo Ano 1",
                    "Audiobook Book 1",
                    "Prepare Ano 2 strategy"
                ],
                "metricas": ["Revenue $80K-120K", "Community 5000+", "3 books published"]
            }
        },

        "tacticas_adquisicion_prioritarias": [
            {
                "tactica": "Free Book 1 + landing page optimized",
                "prioridad": "ALTA",
                "roi": "5-10x",
                "tiempo": "Semana 1-2"
            },
            {
                "tactica": "BookTok organic + 2-3 posts diarios",
                "prioridad": "ALTA",
                "roi": "Infinito (free)",
                "tiempo": "Continuo"
            },
            {
                "tactica": "Amazon ads auto-targeting",
                "prioridad": "ALTA",
                "roi": "200-300%",
                "tiempo": "Semana 2-4"
            },
            {
                "tactica": "BookBub Featured Deal",
                "prioridad": "MEDIA",
                "roi": "300-500%",
                "tiempo": "Mes 2-3"
            },
            {
                "tactica": "Influencer micro (10K-50K)",
                "prioridad": "MEDIA",
                "roi": "150-300%",
                "tiempo": "Mes 2-4"
            },
            {
                "tactica": "Newsletter swaps",
                "prioridad": "MEDIA",
                "roi": "Infinito",
                "tiempo": "Mes 3-6"
            }
        ],

        "tacticas_retencion": [
            "Email welcome series (5 emails post-compra)",
            "Book 2 launch notification",
            "Content exclusivo para email subscribers",
            "Discord community engagement",
            "Early access a nuevos libros",
            "Discount codes para box sets"
        ],

        "automatizaciones_clave": [
            "Email sequences (Mailchimp/ConvertKit)",
            "Social media scheduling (Buffer/Hootsuite)",
            "Amazon ads rules-based optimization",
            "Sales tracking dashboard",
            "Review monitoring alerts"
        ]
    }

    return playbook

def estrategia_ventas_b2b():
    """Estrategia de ventas B2B"""

    b2b = {
        "productos_b2b": {
            "crm_traficantes": {
                "descripcion": "CRM para traficantes de medios digitales",
                "precio": "$29-99/mes",
                "segmento": "Performance marketers",
                "tamano_mercado": "50,000-200,000 potenciales",
                "estrategia_venta": [
                    "Landing page con demo video",
                    "Free trial 14 dias",
                    "Pricing transparente",
                    "Case studies de usuarios"
                ],
                "canal_venta": ["SEO", "Reddit marketing", "Partnerships"],
                "meta_ano1": "$500-2,000/MRR"
            },
            "consultoria_observacionismo": {
                "descripcion": "Consultoria en metodologia observacionista",
                "precio": "$500-2,000/proyecto",
                "segmento": "Industrias: publising, gaming, contenido",
                "proceso_venta": [
                    "Discovery call (30 min)",
                    "Propuesta escrita",
                    "Negociacion",
                    "Ejecucion + reporte"
                ],
                "canal_venta": ["Inbound (blog)", "Outbound (email)", "Referrals"],
                "meta_ano1": "$10,000-25,000"
            },
            "licenciamiento_tech": {
                "descripcion": "Licenciar tecnologia agentes escritura",
                "precio": "Por contrato",
                "segmento": "Publishers, plataformas edtech",
                "proceso_venta": [
                    "Identificar targets (C-level publishing)",
                    "Warm intro via network",
                    "Demo tecnologia",
                    "Negociacion contrato"
                ],
                "canal_venta": ["Networking", "Conferencias", "Warm intros"],
                "meta_ano1": "$0-50,000 (pilotos)"
            },
            "workshops_13_capas": {
                "descripcion": "Talleres de escritura metodo 13 Capas",
                "precio": "$50-200/persona",
                "formato": ["Online 4 semanas", "Intensivo 2 dias"],
                "segmento": "Escritores aspirantes",
                "estrategia_venta": [
                    "Webinar gratis (lead magnet)",
                    "Email nurture",
                    "Launch campaigns",
                    "Testimonios participantes"
                ],
                "canal_venta": ["Email list", "Social", "Partnerships"],
                "meta_ano1": "$5,000-15,000"
            }
        },

        "proceso_venta_b2b": {
            "prospeccion": "LinkedIn + email (hunter.io)",
            "discovery": "BANT qualification (Budget, Authority, Need, Timeline)",
            "demo": "Demo customizada 30 min",
            "propuesta": "Propuesta escrita en 48h",
            "negociacion": "Terminos + contrato",
            "cierre": "Firma + onboarding"
        },

        "equipo_ventas_b2b": {
            "ano1": "Founder-led sales",
            "ano2": "Contratar 1 SDR + 1 AE",
            "ano3": "Expandir a 3-5 personas ventas"
        }
    }

    return b2b

def metricas_growth_tracking():
    """Métricas de growth a trackear"""

    return {
        "metricas_norte": {
            "revenue": "MRR / ARR tracking",
            "customers": "Total readers adquiridos",
            "community": "Active community members",
            "books": "Books read through rate"
        },
        "metricas_entrada": {
            "impressions": "Views en contenido",
            "clicks": "CTR en ads/contenido",
            "landing_visits": "Visitas a landing",
            "sample_downloads": "Downloads capitulo muestra"
        },
        "metricas_engagement": {
            "email_open_rate": "40-60%",
            "email_ctr": "8-15%",
            "discord_dau": "Daily active users",
            "social_engagement": "Likes, comments, shares"
        },
        "metricas_conversion": {
            "landing_to_sample": "25-40%",
            "sample_to_purchase": "30-60%",
            "book1_to_book2": "60-70%",
            "ltv_cac_ratio": ">30x"
        },
        "metricas_retencion": {
            "churn_mensual": "2-4%",
            "nrr": ">100%",
            "read_through_rate": "60-70%",
            "reviews_per_book": "20-50"
        }
    }

def generar_estrategia_growth_completa():
    """Genera estrategia de growth completa"""

    print("Construyendo funnel de adquisicion...")
    funnel = funnel_adquisicion_completo()

    print("Creando playbook de growth...")
    playbook = playbook_growth_ejecutivo()

    print("Desarrollando estrategia B2B...")
    b2b = estrategia_ventas_b2b()

    print("Definiendo metricas de tracking...")
    metricas = metricas_growth_tracking()

    output = {
        "fecha_generacion": datetime.now().isoformat(),
        "version": "1.0",
        "agente": "CEO_03_GROWTH_VENTAS",
        "ejecutivo": "Chief Growth Officer MEDIOEVO",

        "resumen_ejecutivo": {
            "strategy": "Growth organico + paid acquisition + retention",
            "cpc_promedio": "$0.30-0.80",
            "cac_promedio": "$6-13",
            "ltv": "$380-750",
            "payback": "2-4 meses",
            "recomendacion": "70% organico / 30% paid Ano 1"
        },

        "funnel_adquisicion": funnel,
        "playbook_growth": playbook,
        "estrategia_ventas_b2b": b2b,
        "metricas_tracking": metricas,

        "prioridades_ejecucion": [
            "Semana 1: Setup BookTok + Discord",
            "Semana 2: Landing page optimizada",
            "Semana 3: Amazon ads live",
            "Mes 2: Influencer campaign",
            "Mes 3: BookBub featured deal",
            "Mes 4: Newsletter automation",
            "Mes 6: B2B CRM launch"
        ],

        "stack_tecnologico_marketing": [
            "BookTok/Instagram (organico)",
            "Amazon Ads",
            "Meta Business Suite",
            "Substack (newsletter)",
            "Discord (comunidad)",
            "ConvertKit / Mailchimp (email)",
            "Google Analytics",
            "Sales tracking dashboard (custom)"
        ],

        "roles_contratacion": {
            "ano1": ["Founder (todo)"],
            "ano2": ["Social media manager part-time", "VA admin"],
            "ano3": ["Head of Growth", "Content creator", "Marketing manager"]
        }
    }

    # Guardar
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    ruta = OUTPUT_DIR / "CEO_03_GROWTH_VENTAS.json"

    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Estrategia Growth guardada: {ruta}")
    print(f"\nRESUMEN GROWTH:")
    print(f"  CAC: $6-13")
    print(f"  LTV: $380-750")
    print(f"  Payback: 2-4 meses")
    print(f"  Canales prioritarios: BookTok, Amazon Ads, Reddit")
    print(f"  B2B: CRM + Consultoria + Workshops")

    return output

if __name__ == "__main__":
    print("=" * 70)
    print("AGENTE CEO 03: GROWTH MARKETING Y VENTAS")
    print("=" * 70)
    print()

    resultado = generar_estrategia_growth_completa()

    print("\n" + "=" * 70)
    print("CGO Growth completado")
