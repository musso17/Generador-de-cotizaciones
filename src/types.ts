export interface Client {
  name: string;
  industry: ClientIndustry;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  client: Client;
  serviceType: ServiceType;
  projectDescription: string;
  items: LineItem[];
  igvRate: number;
}

export enum ServiceType {
  AUDIOVISUAL = 'Audiovisual',
  EDICION = 'Edición',
  CONTENIDO_DIGITAL = 'Contenido Digital',
  DESARROLLO_WEB = 'Desarrollo Web',
  DISENO_GRAFICO = 'Diseño Gráfico',
  OTRO = 'Otro',
}

export enum ClientIndustry {
    CAFETERIA = 'Cafetería',
    AGENCIA = 'Agencia',
    CORPORATIVO = 'Corporativo',
    RETAIL = 'Retail',
    STARTUP = 'Startup',
    OTRO = 'Otro',
}