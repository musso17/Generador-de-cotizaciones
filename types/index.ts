export enum ServiceType {
  AUDIOVISUAL = 'Producción audiovisual',
  CONTENIDO_DIGITAL = 'Contenido digital',
  FOTOGRAFIA = 'Fotografía',
  EVENTO = 'Cobertura de eventos',
  STREAMING = 'Streaming',
  POSTPRODUCCION = 'Postproducción',
  OTRO = 'Otro',
}

export interface Client {
  name: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantityLabel?: string;
  unitPrice: number;
}

export interface Quote {
  id: string;
  client: Client;
  serviceType: ServiceType;
  projectDescription: string;
  items: LineItem[];
  igvRate: number;
  showIgv?: boolean;
  date: string;
  conditions: string[];
}

export interface Totals {
  subtotal: number;
  igv: number;
  total: number;
}

export interface LoadingState {
  template: boolean;
  analysis: boolean;
  pdf: boolean;
}

export interface TemplateGenerationResult {
  projectDescription: string;
  clientName?: string;
  items: Omit<LineItem, 'id'>[];
}
