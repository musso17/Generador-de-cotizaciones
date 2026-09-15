import { ServiceType } from '@/types';

export const historicalQuotes = [
  {
    serviceType: ServiceType.CONTENIDO_DIGITAL,
    projectDescription: "Sesión de producto y video corto para Kaldis",
    items: [
      { description: "Sesión de producto en cafetería", quantity: 1, unitPrice: 266.67 },
      { description: "Reel de producto", quantity: 1, unitPrice: 106.67 }
    ],
    total: 373.34
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Grabación de clase para EP UTEC",
    items: [
      { description: "Grabación de clase presencial", quantity: 1, unitPrice: 426.67 },
      { description: "Adaptación a formato cápsulas", quantity: 1, unitPrice: 160 }
    ],
    total: 586.67
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Producción institucional para UTEL",
    items: [
      { description: "Grabación institucional", quantity: 1, unitPrice: 533.33 },
      { description: "Edición institucional", quantity: 1, unitPrice: 213.33 }
    ],
    total: 746.66
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Producción de video personal para Ricardo",
    items: [
      { description: "Grabación de entrevista", quantity: 1, unitPrice: 186.67 },
      { description: "Edición de entrevista", quantity: 1, unitPrice: 133.33 }
    ],
    total: 320
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Producción institucional para Romex - Cafetal",
    items: [
      { description: "Grabación en planta", quantity: 1, unitPrice: 400 },
      { description: "Edición institucional", quantity: 1, unitPrice: 320 }
    ],
    total: 720
  },
  {
    serviceType: ServiceType.CONTENIDO_DIGITAL,
    projectDescription: "Producción de contenido para SABA Equipamientos",
    items: [
      { description: "Grabación institucional", quantity: 1, unitPrice: 426.67 },
      { description: "Reel de producto", quantity: 1, unitPrice: 106.67 }
    ],
    total: 533.34
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Lanzamiento Chery para GY SERVICE",
    items: [
      { description: "Grabación de evento", quantity: 1, unitPrice: 533.33 },
      { description: "Edición de video resumen", quantity: 1, unitPrice: 160 },
      { description: "Pieza vertical para RRSS", quantity: 1, unitPrice: 106.67 }
    ],
    total: 800
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Testimoniales audiovisuales para Monkeyfit",
    items: [
      { description: "Grabación de testimoniales", quantity: 1, unitPrice: 240 },
      { description: "Edición de testimoniales", quantity: 1, unitPrice: 213.33 }
    ],
    total: 453.33
  },
  {
    serviceType: ServiceType.AUDIOVISUAL,
    projectDescription: "Cobertura audiovisual para Festival del Cafezaso Peruano",
    items: [
      { description: "Registro de video 1 cámara ½ día", quantity: 1, unitPrice: 160 },
      { description: "Registro de video 1 cámara 1 día", quantity: 1, unitPrice: 266.67 },
      { description: "Edición de video resumen 3 min", quantity: 1, unitPrice: 133.33 },
      { description: "Edición de video Aeropress 1-2 min", quantity: 1, unitPrice: 80 }
    ],
    total: 640
  }
];
