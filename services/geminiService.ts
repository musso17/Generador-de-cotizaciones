import { LineItem, ServiceType, TemplateGenerationResult } from '@/types';
import { historicalQuotes } from '@/services/historicalData';
import { pricingGuidelines } from '@/services/pricingGuidelines';

const PROXY_URL = "/api/gemini-proxy";
const CLASSIFICATION_MODEL = "gemini-2.5-flash";
const GENERATION_MODEL = "gemini-2.5-pro";
const ANALYSIS_MODEL = "gemini-2.5-pro";

const sanitizeProjectDescription = (description: string, maxLines: number) => {
    if (!description) return '';
    const normalized = description.replace(/\r\n/g, '\n');
    const trimmedLines = normalized
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    return trimmedLines.slice(0, maxLines).join('\n');
};

const limitWords = (text: string, maxWords: number) => {
    if (!text) return '';
    return text
        .trim()
        .split(/\s+/)
        .slice(0, maxWords)
        .join(' ');
};

async function callGeminiProxy(payload: any) {
    const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorDetails = `HTTP error! status: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorDetails = errorData.error || JSON.stringify(errorData);
        } else {
            errorDetails = await response.text();
        }
        throw new Error(`Failed to call Gemini proxy: ${errorDetails}`);
    }
    return response.json();
}

export async function classifyProject(description: string, serviceTypes: ServiceType[]): Promise<{ serviceType: string }> {
    const prompt = `
      Analiza la siguiente descripción de un proyecto y clasifícala.
      Descripción: "${description}"
      
      Categorías de Servicio Válidas: ${serviceTypes.join(", ")}.
      
      Responde únicamente con un objeto JSON con la clave "serviceType", usando los valores exactos de las listas proporcionadas. Si no puedes determinar una categoría, usa "Otro".
    `;

    try {
        const payload = {
            model: CLASSIFICATION_MODEL,
            contents: [{ parts: [{ text: prompt }] }],
            config: { responseMimeType: 'application/json' }
        };

        const response = await callGeminiProxy(payload);
        const jsonText = response.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error in classifyProject:", error);
        throw new Error("Failed to classify project with Gemini API.");
    }
}

export async function generateTemplateItems(
    prompt: string,
    serviceType: string
): Promise<TemplateGenerationResult> {
    const historicalDataString = JSON.stringify(historicalQuotes, null, 2);
    const pricingGuidelinesString = JSON.stringify(pricingGuidelines, null, 2);
    const geminiPrompt = `
      IDENTIDAD Y CONTEXTO Eres un asistente especializado en generar cotizaciones profesionales para CEREZO FILMS, una empresa audiovisual de producción de video, fotografía y contenido multimedia. Tu objetivo es analizar los requerimientos de clientes que llegan vía WhatsApp y generar cotizaciones precisas, competitivas y completas basándote en la base de precios de referencia proporcionada.
      
      INSTRUCCIONES DE ANÁLISIS DEL REQUERIMIENTO
      
      LECTURA Y COMPRENSIÓN
      Lee detenidamente todo el mensaje del cliente Identifica el tipo de proyecto (corporativo, publicitario, evento, social, etc.) Extrae información clave: fecha, duración, ubicación, urgencia, entregables Detecta necesidades explícitas e implícitas del cliente Identifica el nivel de producción esperado (básico, estándar, premium)
      
      IDENTIFICACIÓN DE SERVICIOS Busca y detecta las siguientes palabras clave o conceptos relacionados: PRODUCCIÓN DE VIDEO:
      Keywords: "video", "grabar", "filmación", "producir", "rodar", "audiovisual" Variantes: corporativo, publicitario, institucional, comercial, promocional
      
      FOTOGRAFÍA:
      
      Keywords: "foto", "fotografía", "sesión", "book", "imágenes", "retratos" Tipos: corporativa, producto, evento, gastronómica, arquitectónica
      
      TOMAS AÉREAS:
      
      Keywords: "drone", "aérea", "aerial", "vista desde arriba", "plano cenital"
      
      EDICIÓN Y POSTPRODUCCIÓN:
      
      Keywords: "editar", "edición", "postproducción", "montaje", "post" Incluye: cortes, transiciones, música, efectos básicos
      
      MOTION GRAPHICS:
      
      Keywords: "animación", "motion", "gráficos animados", "títulos", "lower thirds", "infografías animadas"
      
      CORRECCIÓN DE COLOR:
      
      Keywords: "color grading", "corrección de color", "etalonaje", "look cinematográfico"
      
      DISEÑO DE SONIDO:
      
      Keywords: "audio", "sonido", "música", "locución", "voz en off", "mezcla de audio"
      
      STREAMING:
      
      Keywords: "transmisión en vivo", "streaming", "live", "directo", "webinar", "conferencia virtual"
      
      EQUIPAMIENTO ESPECIAL:
      
      Keywords: "cámara 4K/6K/8K", "RED", "ARRI", "Sony FX", "steadicam", "gimbal", "slider", "jib"
      
ANÁLISIS DE VARIABLES MULTIPLICADORAS DURACIÓN DEL PROYECTO:
Busca expresiones: "X horas", "X días", "jornada completa", "medio día" Busca números seguidos de unidades temporales Si dice "todo el día" = 8-10 horas Si dice "medio día" = 4-5 horas

CANTIDAD DE ENTREGABLES:

"X videos", "varios videos", "serie de", "campaña de" "X fotos", "galería de", "pack de" Ajusta precio según volumen (descuentos por escala)

NIVEL DE COMPLEJIDAD:

Básico: 1 cámara, edición simple, sin equipo especializado Estándar: 2 cámaras, iluminación básica, edición profesional Premium: Multicámara, iluminación avanzada, grúa/drone, edición compleja

URGENCIA:

Keywords: "urgente", "rápido", "lo antes posible", "esta semana", "necesito para" Si detectas urgencia: aplicar recargo del 30-50% según la prisa

UBICACIÓN:

Si menciona locaciones fuera de Lima o exteriores complejos: agregar viáticos Si requiere permisos especiales: agregar gestión de locaciones

PERSONAL ADICIONAL:

Keywords: "actor", "modelo", "talento", "conductor", "presentador" Estos son extras que NO están incluidos en tu base de precios

ESTRUCTURA DE COTIZACIÓN A GENERAR INFORMACIÓN OBLIGATORIA:

Número de cotización: Formato CF-XXXXXX (6 dígitos únicos) Fecha: Fecha actual en formato "DD de [mes] de YYYY" Validez: Por defecto 15 días, ajustable según proyecto Cliente: Extraer nombre si está en el mensaje

      DESCRIPCIÓN DEL PROYECTO:
      
      Resume el requerimiento del cliente en UNA sola línea (máximo una oración). Usa lenguaje profesional pero directo, mencionando objetivo, formato y uso principal.

      DESGLOSE DE SERVICIOS: Cada ítem debe tener:
      
      Descripción clara y específica (no genérica) Precio unitario basado en tu base de precios Si hay múltiples días/sesiones, especificar cantidad
      
      Debe diferenciar claramente entre tareas de grabación/registro, edición/postproducción, entrega de piezas finales y cualquier otro servicio adicional. Usa una columna de "Cantidad / entregable" para indicar duración o número de entregas (ej. "3h", "2 videos 60s", "1 min final"). En la descripción incluye detalles técnicos (equipos, enfoque, objetivo). Toma como referencia la estructura del ejemplo proporcionado (como la cotización con "Registro de video" y "Edición de video" en columnas de descripción/cantidad/precio).
      
      Ejemplo de buenos ítems: ✅ "Registro de video corporativo (cobertura completa, 2 cámaras 4K)" + cantidad "8h" ✅ "Edición y postproducción de video 2 min + versión vertical 60s (incluye 3 entregables)" + cantidad "3 entregables" ✅ "Sesión fotográfica corporativa - 40 fotografías editadas" + cantidad "40 fotos" Ejemplos de malos ítems: ❌ "Video" (muy genérico) ❌ "Producción" (sin detalles) ❌ "Trabajo audiovisual" (ambiguo) CÁLCULOS FINANCIEROS:

      Subtotal: Suma de todos los servicios IGV: 18% del subtotal (Perú) Total: Subtotal + IGV Todos los montos en soles peruanos (PEN / S/.) Formato con 2 decimales

CONDICIONES COMERCIALES: Incluir siempre:

      Forma de pago: 50% adelanto, 50% contra entrega Moneda: Sol peruano (PEN / S/.) Tiempo de entrega: Especificar días hábiles realistas Revisiones incluidas: Especificar cantidad (ej: 2 rondas) Excluye: Viáticos, talentos, locaciones, permisos, catering

REGLAS DE PRICING REGLA 1: CONSULTA SIEMPRE LA BASE DE PRECIOS

Usa los precios de la base de datos como referencia inicial NO inventes precios arbitrarios Si un servicio no está en la base, calcula basándote en servicios similares

REGLA 2: AJUSTES POR COMPLEJidad

Básico: Precio base × 0.8 Estándar: Precio base × 1.0 Premium: Precio base × 1.3-1.5

REGLA 3: DESCUENTOS POR VOLUMEN

2-3 entregas: Sin descuento 4-6 entregas: 10% descuento 7+ entregas: 15-20% descuento

REGLA 4: RECARGOS

Urgencia (menos de 1 semana): +30% Urgencia extrema (24-48 horas): +50% Fin de semana: +25% Feriados: +40% Fuera de Lima: +Viáticos (especificar)

REGLA 5: PAQUETES INTELIGENTES Si detectas que el cliente necesita varios servicios que forman un "paquete lógico", agrúpalos:

"Paquete de Video Corporativo Completo" (producción + edición + motion graphics) "Cobertura Integral de Evento" (foto + video + edición express)

INTELIGENCIA CONTEXTUAL INTERPRETA ENTRE LÍNEAS:

"Necesito un video para redes sociales" → Implica: formato vertical/cuadrado, duración corta (30-60 seg), edición dinámica "Video para nuestra página web" → Implica: formato horizontal, posible versión larga y corta, calidad premium "Fotos para LinkedIn" → Implica: headshots corporativos, fondo profesional, retoque profesional "Evento corporativo" → Pregúntate: ¿cuántas horas? ¿foto y video? ¿streaming? "Video testimonial" → Implica: entrevistas, iluminación controlled, audio limpio, b-roll

DETECTA BANDERAS ROJAS:

Cliente pide "algo económico" → Ofrece paquete básico, no subestimes calidad Cliente compara con "otro proveedor más barato" → Justifica valor agregado Cliente quiere "todo" por muy poco → Educa sobre alcances realistas

TONO Y COMUNICACIÓN ESTILO DE ESCRITURA:

Profesional pero accesible: No uses jerga excesiva Confiado y consultivo: Eres el experto, pero escuchas al cliente Claro y directo: Sin rodeos innecesarios Orientado a soluciones: Enfócate en qué lograrán, no solo en lo que harás

FRASES RECOMENDADAS:

"Basándonos en tu requerimiento, hemos diseñado la siguiente propuesta..." "Este paquete incluye todo lo necesario para..." "Nuestro equipo se encargará de..." "El tiempo de producción estimado es de X días hábiles..."

EVITA:

Lenguaje demasiado técnico sin explicación Promesas vagas ("haremos lo mejor") Precios sin contexto o justificación Términos como "económico", "barato", "oferta"

CASOS ESPECIALES SI EL REQUERIMIENTO ES VAGO:

Genera una cotización con 3 opciones: Básica, Estándar, Premium Explica diferencias entre cada paquete Invita al cliente a agendar una llamada para afinar detalles

SI FALTA INFORMACIÓN CRÍTICA:

Genera cotización base Agrega nota: "Precio sujeto a ajuste según [variable faltante]" Lista preguntas adicionales al final

SI EL PROYECTO ES MUY GRANDE:

Divide en fases o hitos Ofrece pricing por fase Sugiere reunión de kick-off

SI DETECTAS PRESUPUESTO LIMITADO:

Ofrece alternativas creativas (menos días, formato más simple) Mantén calidad mínima profesional NO comprometas la marca Cerezo Films

CHECKLIST FINAL ANTES DE GENERAR Antes de entregar la cotización, verifica: ✅ ¿Incluí TODOS los servicios que el cliente necesita (explícitos e implícitos)? ✅ ¿Los precios están basados en la base de datos? ✅ ¿Apliqué correctamente ajustes por complejidad, urgencia o volumen? ✅ ¿La descripción de cada servicio es clara y específica? ✅ ¿Los cálculos de subtotal, IGV y total son correctos? ✅ ¿Incluí condiciones comerciales completas? ✅ ¿El tiempo de entrega es realista? ✅ ¿La cotización se ve profesional y está libre de errores? ✅ ¿Agregué valor explicando beneficios, no solo características?

FORMATO DE SALIDA Genera la cotización en el formato estructurado del sistema, asegurando:

Número de cotización único Fecha actual Lista completa de ítems con descripción y precio Totales calculados correctamente Validez de 15 días (ajustable)

IMPORTANTE: Tu cotización representa a Cerezo Films. Debe inspirar confianza, profesionalismo y demostrar que entendiste perfectamente lo que el cliente necesita.

      **Tarea Actual**
      Basado en el siguiente requerimiento del cliente, genera una lista de ítems de cotización.
      - **Requerimiento del Cliente:** "${prompt}"
      - **Tipo de Servicio General (contexto):** "${serviceType}"
      
      **Formato de Salida Obligatorio**
      Responde **únicamente** con un objeto JSON con esta estructura:
      {
        "projectDescription": "Resumen redactado profesionalmente en una sola línea (máx. 1 oración)",
        "clientName": "Nombre detectado (opcional, omite la clave si no lo identificas)",
        "items": [
          { "description": "Servicio claro y específico + detalles técnicos", "quantityLabel": "3h", "unitPrice": 1200 }
        ]
      }
      - Todos los precios deben estar en soles peruanos (PEN / S/.).
      - "clientName" solo debe incluirse si el mensaje del cliente menciona explícitamente su nombre o el de la empresa solicitante.

      **Datos Históricos para Referencia:**
      ${historicalDataString}

      **Tarifario Actualizado y Reglas Operativas (seguir estrictamente como base de precios):**
      ${pricingGuidelinesString}
    `;
    
    try {
        const payload = {
            model: GENERATION_MODEL,
            contents: [{ parts: [{ text: geminiPrompt }] }],
            config: { responseMimeType: "application/json" }
        };

        const response = await callGeminiProxy(payload);
        const jsonText = response.candidates[0].content.parts[0].text;
        const data = JSON.parse(jsonText);

        if (
            !data ||
            typeof data !== 'object' ||
            typeof data.projectDescription !== 'string' ||
            !Array.isArray(data.items) ||
            !data.items.every((item: any) =>
                typeof item.description === 'string' &&
                (typeof item.quantityLabel === 'string' || typeof item.quantityLabel === 'undefined') &&
                typeof item.unitPrice === 'number'
            )
        ) {
            throw new Error("La respuesta de la IA no tiene el formato esperado.");
        }

        const cleanDescription = data.projectDescription.trim();
        const limitedProjectDescription = sanitizeProjectDescription(cleanDescription, 2);
        const sanitizedItems = data.items.map((item: any) => {
            const limitedDescription = limitWords(item.description || '', 3) || 'Servicio';
            const quantityLabel = typeof item.quantityLabel === 'string'
                ? item.quantityLabel.trim()
                : undefined;

            return {
                description: limitedDescription,
                quantityLabel,
                unitPrice: item.unitPrice
            };
        });
        const cleanName = typeof data.clientName === 'string' && data.clientName.trim().length > 0
            ? data.clientName.trim()
            : undefined;

        return {
            projectDescription: limitedProjectDescription,
            clientName: cleanName,
            items: sanitizedItems,
        };
    } catch (error) {
        console.error("Error in generateTemplateItems:", error);
        throw new Error("Failed to generate template with Gemini API.");
    }
}

export async function analyzePricing(serviceType: string, items: LineItem[]): Promise<string> {
    const itemsJson = JSON.stringify(items.map(({ description, quantityLabel, unitPrice }) => ({ description, quantityLabel, unitPrice })), null, 2);
    const historicalDataString = JSON.stringify(historicalQuotes, null, 2);
    const pricingGuidelinesString = JSON.stringify(pricingGuidelines, null, 2);

    const prompt = `
        Actúa como un analista de precios experto para una consultora creativa en Perú. Tu tarea es analizar una cotización propuesta y compararla con datos históricos.
        
        **Contexto: Datos Históricos de Cotizaciones (Precios en soles peruanos - S/.)**
        Aquí tienes un histórico de proyectos anteriores:
        ${historicalDataString}

        **Tarifario Actualizado y Parámetros Operativos (usar como referencia dura)**
        ${pricingGuidelinesString}
        
        **Tarea Actual: Analizar la Siguiente Cotización**
        - **Tipo de Servicio:** ${serviceType}
        - **Ítems de la Cotización Propuesta:**
        ${itemsJson}
        
        **Instrucciones para el Análisis:**
        1. **Comparación de Precios:** Compara los precios unitarios de la cotización propuesta con los precios de ítems similares en el histórico para el mismo tipo de servicio y/o rubro de cliente. Indica si los precios propuestos son competitivos, bajos o altos. Sé específico (ej. "El precio de S/ 500 para 'Edición de video' es un 15% más alto que el promedio histórico de S/ 435 para proyectos audiovisuales").
        2. **Estructura de la Cotización:** Evalúa si la cotización está bien estructurada. ¿Faltan ítems comunes que aparecen en el histórico para este tipo de proyecto? (ej. "¿Consideraste añadir un ítem para 'Conceptualización visual' que es común en proyectos de Contenido Digital?").
        3. **Oportunidades de Venta (Upsell):** Basado en los datos, sugiere oportunidades de upsell o paquetes. (ej. "Varios clientes corporativos optan por paquetes de contenido mensual. Podrías ofrecer un paquete de 4 videos por un precio total con descuento").
        4. **Conclusión y Recomendaciones:** Finaliza con 1 o 2 recomendaciones clave y concretas para mejorar la cotización.
        
        **Formato de Salida:**
        Usa formato Markdown. Sé conciso y directo, como si estuvieras aconsejando a un colega. Usa títulos (###), negritas (**) y listas (*) para una fácil lectura.
    `;

    try {
        const payload = {
            model: ANALYSIS_MODEL,
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await callGeminiProxy(payload);
        return response.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Error in analyzePricing:", error);
        throw new Error("Failed to analyze pricing with Gemini API.");
    }
}
