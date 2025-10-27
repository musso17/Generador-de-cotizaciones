import { LineItem, ServiceType, ClientIndustry } from '../types';
import { historicalQuotes } from './historicalData';

interface GeminiProxyResponse {
    text: string;
}

async function callGeminiProxy(payload: object): Promise<GeminiProxyResponse> {
    const response = await fetch('/.netlify/functions/gemini-proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Proxy error:", errorBody);
        throw new Error(`Failed to call Gemini proxy: ${response.status} ${errorBody.error || 'Unknown error'}`);
    }

    return response.json();
}

export async function classifyProject(description: string, serviceTypes: ServiceType[], clientIndustries: ClientIndustry[]): Promise<{ serviceType: string, clientIndustry: string }> {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analiza la siguiente descripción de un proyecto y clasifícala.
      Descripción: "${description}"
      
      Categorías de Servicio Válidas: ${serviceTypes.join(', ')}.
      Categorías de Rubro de Cliente Válidas: ${clientIndustries.join(', ')}.
      
      Responde únicamente con un objeto JSON con las claves "serviceType" y "clientIndustry", usando los valores exactos de las listas proporcionadas. Si no puedes determinar una categoría, usa "Otro".
    `;

    try {
        const response = await callGeminiProxy({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        serviceType: { type: 'STRING' },
                        clientIndustry: { type: 'STRING' },
                    },
                    required: ['serviceType', 'clientIndustry']
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error in classifyProject:", error);
        throw new Error("Failed to classify project with Gemini API.");
    }
}


export async function generateTemplateItems(prompt: string, serviceType: string, clientIndustry: string): Promise<Omit<LineItem, 'id'>[]> {
    const model = 'gemini-2.5-pro';
    const historicalDataString = JSON.stringify(historicalQuotes, null, 2);
    
    const geminiPrompt = `
      Eres un asistente experto para una empresa de servicios creativos en Perú. Tu tarea es generar una plantilla de cotización inteligente basada en un requerimiento específico.
      
      **Contexto: Datos Históricos de Cotizaciones (Precios en USD)**
      Aquí tienes ejemplos de cotizaciones pasadas para guiarte en los precios y estructura:
      ${historicalDataString}
      
      **Tarea Actual**
      Basado en el siguiente requerimiento del cliente, genera una lista de ítems de cotización.
      - **Requerimiento del Cliente:** "${prompt}"
      - **Tipo de Servicio General (contexto):** "${serviceType}"
      - **Rubro del Cliente (contexto):** "${clientIndustry}"
      
      **Instrucciones:**
      1. Interpreta el **Requerimiento del Cliente** para identificar los entregables y servicios principales.
      2. Utiliza los **Datos Históricos** para proponer precios unitarios promedio y realistas para cada ítem.
      3. Crea una lista de ítems que cubra completamente el requerimiento. Sé específico en las descripciones.
      4. Para cada ítem, sugiere una descripción clara, una cantidad numérica, y un precio unitario.
      5. Si la cantidad se refiere a tiempo (horas, días), indica la unidad en la descripción y usa un número para la cantidad (ej. para "medio día" la descripción sería "Grabación media jornada (4 horas)" y la cantidad sería 1).
      6. Si el requerimiento es vago, crea una propuesta estándar y lógica para el tipo de servicio y rubro indicados.
      
      **Formato de Salida ObligatorIO**
      Responde **únicamente** con un array de objetos JSON. Cada objeto debe tener las claves "description" (string), "quantity" (number), y "unitPrice" (number). No incluyas explicaciones adicionales, solo el JSON.
    `;
    
    try {
        const response = await callGeminiProxy({
            model: model,
            contents: geminiPrompt,
            config: {
                 responseMimeType: "application/json",
                 responseSchema: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        description: {
                          type: 'STRING',
                        },
                        quantity: {
                          type: 'NUMBER',
                        },
                        unitPrice: {
                            type: 'NUMBER',
                        }
                      },
                      required: ["description", "quantity", "unitPrice"],
                    },
                  },
            }
        });
        
        const jsonText = response.text.trim();
        const items = JSON.parse(jsonText);
        
        if (Array.isArray(items) && items.every(item => 'description' in item && 'quantity' in item && 'unitPrice' in item)) {
            return items;
        }
        return [];

    } catch (error) {
        console.error("Error in generateTemplateItems:", error);
        throw new Error("Failed to generate template with Gemini API.");
    }
}

export async function analyzePricing(serviceType: string, clientIndustry: string, items: LineItem[]): Promise<string> {
    const model = 'gemini-2.5-pro';
    const itemsJson = JSON.stringify(items.map(({ description, quantity, unitPrice }) => ({ description, quantity, unitPrice })), null, 2);
    const historicalDataString = JSON.stringify(historicalQuotes, null, 2);

    const prompt = `
        Actúa como un analista de precios experto para una consultora creativa en Perú. Tu tarea es analizar una cotización propuesta y compararla con datos históricos.
        
        **Contexto: Datos Históricos de Cotizaciones (Precios en USD)**
        Aquí tienes un histórico de proyectos anteriores:
        ${historicalDataString}
        
        **Tarea Actual: Analizar la Siguiente Cotización**
        - **Tipo de Servicio:** ${serviceType}
        - **Rubro del Cliente:** ${clientIndustry}
        - **Ítems de la Cotización Propuesta:**
        ${itemsJson}
        
        **Instrucciones para el Análisis:**
        1. **Comparación de Precios:** Compara los precios unitarios de la cotización propuesta con los precios de ítems similares en el histórico para el mismo tipo de servicio y/o rubro de cliente. Indica si los precios propuestos son competitivos, bajos o altos. Sé específico (ej. "El precio de $500 para 'Edición de video' es un 15% más alto que el promedio histórico de $435 para proyectos audiovisuales").
        2. **Estructura de la Cotización:** Evalúa si la cotización está bien estructurada. ¿Faltan ítems comunes que aparecen en el histórico para este tipo de proyecto? (ej. "¿Consideraste añadir un ítem para 'Conceptualización visual' que es común en proyectos de Contenido Digital?").
        3. **Oportunidades de Venta (Upsell):** Basado en los datos, sugiere oportunidades de upsell o paquetes. (ej. "Varios clientes corporativos optan por paquetes de contenido mensual. Podrías ofrecer un paquete de 4 videos por un precio total con descuento").
        4. **Conclusión y Recomendaciones:** Finaliza con 1 o 2 recomendaciones clave y concretas para mejorar la cotización.
        
        **Formato de Salida:**
        Usa formato Markdown. Sé conciso y directo, como si estuvieras aconsejando a un colega. Usa títulos (###), negritas (**) y listas (*) para una fácil lectura.
    `;

    try {
        const response = await callGeminiProxy({
            model: model,
            contents: prompt
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error in analyzePricing:", error);
        throw new Error("Failed to analyze pricing with Gemini API.");
    }
}