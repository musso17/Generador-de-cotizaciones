export const pricingGuidelines = {
  tarifarioActualizado: {
    registroVideo: {
      jornadaCorta1a2h: {
        promedio: 400,
        rango: [400, 400],
        sugeridoBase: 400,
        fuentes: ['da982c14-85e6-4f9a-9df4-4a4d1b8...'],
      },
      tresHorasMixtoVideoFoto: {
        promedio: 400,
        rango: [400, 400],
        sugeridoBase: 450,
        fuentes: ['Cotizacion Cerezo_Registro pop...'],
      },
      diaCompletoLima: {
        promedio: 825,
        rango: [700, 900],
        sugeridoBase: 850,
        fuentes: [
          'Cotizacion Cerezo_JC',
          'COTIZACION M,FILMS - Convencion...',
          'd6589bbe-29da-4d66-a2b0-fbf9c20...',
          'dfacc877-e0c4-40d9-81d5-d73b062...',
        ],
      },
      fueraDeLimaBloque3a4Dias: {
        promedioPaquete: 2000,
        equivalentePorDiaAprox: 667,
        sugeridoBasePaquete: 2100,
        fuentes: ['d6589bbe-29da-4d66-a2b0-fbf9c20...'],
      },
    },
    registroFotografia: {
      dosHoras: {
        promedio: 500,
        rango: [500, 500],
        sugeridoBase: 500,
        fuentes: ['COTIZACION M,FILMS - GY services...'],
      },
    },
    sonidoDirecto: {
      nota: 'No aparece explicito en esta muestra; mantener referencia del tarifario previo si aplica.',
    },
    edicionVideo: {
      treintaSegundos: {
        promedio: 200,
        rango: [112.5, 200],
        sugeridoBase: 200,
        fuentes: ['da982c14-85e6-4f9a-9df4-4a4d1b8...', 'dfacc877-e0c4-40d9-81d5-d73b062...'],
      },
      unMinuto: {
        promedio: 225,
        rango: [200, 250],
        sugeridoBase: 250,
        fuentes: ['Cotizacion Cerezo_Registro pop...', 'COTIZACION M,FILMS - Convencion...'],
      },
      unoAMinutoTreinta: {
        promedio: 700,
        rango: [700, 700],
        sugeridoBase: 700,
        fuentes: ['Cotizacion Cerezo_JC'],
      },
      unoADosMinutos: {
        promedio: 400,
        rango: [400, 400],
        sugeridoBase: 400,
        fuentes: ['Cotizacion Cerezo_Asociacion ...', 'd6589bbe-29da-4d66-a2b0-fbf9c20...'],
      },
    },
    edicionFotografia: {
      loteRetoque: {
        promedio: 400,
        rango: [400, 400],
        sugeridoBase: 400,
        fuentes: ['COTIZACION M,FILMS - GY services...'],
      },
    },
    reels30sUnitario: {
      observadoPromedio: 200,
      rangoObservado: [200, 200],
      pisoSugeridoBase: 200,
      nota: 'En corporativo suele pedirse paquete; valorar por volumen si >4 piezas.',
      fuentes: ['da982c14-85e6-4f9a-9df4-4a4d1b8...'],
    },
    paquetesMensualesReferencia: {
      corporativoMixto: {
        totalReferencia: 4500,
        incluye: ['grabacion en locacion', 'edicion', 'guion', 'sonorizacion'],
        fuentes: ['ec0d6766-3e9c-4e89-b66f-be6b304...'],
      },
      sabaPaquetes: {
        paquete1: 2500,
        paquete2: 2800,
        paquete3: 3000,
        nota: 'Mas entregables y dias de registro no incrementan precio proporcionalmente; cuidar margen.',
        fuentes: ['Propuesta CEREZO_SABA Equipamientos...'],
      },
    },
    viaticos: {
      asignacionReferencia: 200,
      nota: 'Monto fijo observado; cuando haya vuelos/hotel, aplicar tabla real de costos.',
      fuentes: ['dfacc877-e0c4-40d9-81d5-d73b062...'],
    },
  },
  recomendacionesOperativas: {
    margenObjetivo: '>=30%',
    politicaCorrecciones:
      'Incluir hasta 3–4 rondas segun documento; extras facturables (reflejado en varias cotizaciones).',
    minimosSugeridos: {
      grabacionDiaLima: 850,
      edicionUnMinuto: 250,
      reel30s: 200,
      registro3h: 450,
    },
    paquetesSugeridos: [
      {
        nombre: 'Evento_dia_Lima',
        contenido: ['grabacion_dia', 'edicion_1min', '3_reels_30s', 'seleccion_fotos_10'],
        precioBaseAprox: '850 + 250 + (3 x 200) + 0',
      },
      {
        nombre: 'Campana_fuera_de_Lima_bloque',
        contenido: ['bloque_3_4_dias_registro', 'edicion_2x_1_2min', 'viaticos_reales'],
        precioBaseAprox: '2100 + (2 x 400)',
      },
    ],
  },
  reels: {
    treintaSegundosUnitario: {
      observadoPromedio: 85,
      rangoObservado: [55, 100],
      pisoSugeridoBase: 150,
      nota:
        'Los valores observados en paquetes son muy bajos para cubrir tiempo/QA; se propone piso operativo.',
      fuentes: ['7939687e-fcce-45c3-891a-57fee99...', 'bcdfb23c-41cb-4437-b7db-8f28686...'],
    },
  },
  talentoModeloPorPersona: {
    promedio: 600,
    rango: [600, 600],
    sugeridoBase: 600,
    fuentes: ['Cotizacion Cerezo_Chery Tiggo ...'],
  },
  gastosProduccion: {
    mediaJornada4h: {
      promedio: 250,
      rango: [250, 250],
      sugeridoBase: 250,
      fuentes: ['Cotizacion Cerezo_Chery Tiggo ...'],
    },
  },
  locucionYPostAudio: {
    tarifa: 800,
    fuentes: ['bcdfb23c-41cb-4437-b7db-8f28686...'],
  },
  edicionFotografiaExtendida: {
    lote20a30Fotos: 500,
    fuentes: ['Cotizacion Cerezo_Chery Tiggo ...'],
  },
  viaticosBaseFueraDeLima: {
    vuelosIdaVueltaPorPersona: 1330,
    hospedajePorNochePorPersona: 83.33,
    alimentacionPorDiaPorPersona: 80,
    transporteLocalPorDiaPorPersona: 66.67,
    fuentes: ['bcdfb23c-41cb-4437-b7db-8f28686...'],
    nota: 'Valores de una muestra (Madre de Dios). Ajustar por temporada y antelacion.',
  },
  ajustesRecomendados: {
    margenObjetivo: '>=30%',
    politicaCorrecciones: 'Incluye 2–4 rondas; extras se cotizan.',
    paquetesSugeridos: [
      {
        nombre: 'Evento_dia',
        contenido: ['video_dia', 'fotografia_dia', 'edicion_1m', '3_reels'],
        precioBaseAprox: '1000 + 400 + 300 + (3 x 150)',
      },
      {
        nombre: 'Corporativo_media_jornada',
        contenido: [
          'video_media_jornada',
          'sonido_directo',
          'edicion_45s',
          '1_reel',
          'gastos_produccion',
        ],
        precioBaseAprox: '1300 + 500 + 300 + 150 + 250',
      },
    ],
  },
};

export type PricingGuidelines = typeof pricingGuidelines;
