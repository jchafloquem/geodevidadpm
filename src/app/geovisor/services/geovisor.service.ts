import { ElementRef, Injectable } from '@angular/core';
import { LayerConfig } from '../interface/layerConfig';

//*Libreria de ArcGIS 4.30
import * as projection from '@arcgis/core/geometry/projection';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Home from '@arcgis/core/widgets/Home.js';
import Legend from '@arcgis/core/widgets/Legend.js';
import Locate from "@arcgis/core/widgets/Locate.js";
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import Point from '@arcgis/core/geometry/Point';
import Search from "@arcgis/core/widgets/Search.js";
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import Zoom from '@arcgis/core/widgets/Zoom.js';

//* Popup y Clusters
const popAcuicola = new PopupTemplate({  title: 'CULTIVO DE: {PRODUCCIÓ}',
  outFields: ["*"],
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'APELLIDO_P',
          label: '<b><font>Nombre Completo</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },

      ],
    },
  ],
});
const popObservaciones = new PopupTemplate({
  title: 'DISTRITO:{DISTRITO}',
  outFields: ["*"],
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'NOMBRES',
          label: '<b><font>Nombre Completo</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'DNI',
          label: '<b><font>DNI</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'OBS',
          label: '<b><font>Observaciones</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'ORG',
          label: '<b><font>Oficina Zonal / Cultivo</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'Shape__Area',
          label: '<b><font>Area (m2)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 2, // Solo dos decimales
            digitSeparator: true // Activa separadores de miles
          }
        },
        {
          fieldName: 'Shape_Leng',
          label: '<b><font>Perimetro (ml.)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 2, // Solo dos decimales
            digitSeparator: true // Activa separadores de miles
          }
        },


      ],
    },
  ],
});
const dosenvio = new PopupTemplate({
  title: 'CULTIVO:{CUTIVO}',
  outFields: ["*"],
  content: [
    {
      type: 'fields',
      fieldInfos: [

        {
          fieldName: 'DNI',
          label: '<b><font>DNI</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'OZ',
          label: '<b><font>Oficina Zonal</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },

        {
          fieldName: 'Shape__Area',
          label: '<b><font>Area (m2)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 2, // Solo dos decimales
            digitSeparator: true // Activa separadores de miles
          }
        },
      ],
    },
  ],
});

const tresenvio = new PopupTemplate({
  title: 'DISTRITO:{DISTRITO}',
  outFields: ["*"],
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'NOMBRES',
          label: '<b><font>Nombre Completo</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'DNI_PART',
          label: '<b><font>DNI</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'CULTIVO',
          label: '<b><font>Cultivocls</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'OZ',
          label: '<b><font>Oficina Zonal / Cultivo</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'Shape__Area',
          label: '<b><font>Area (m2)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 2, // Solo dos decimales
            digitSeparator: true // Activa separadores de miles
          }
        },
        {
          fieldName: 'Shape__Length',
          label: '<b><font>Perimetro (ml.)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 2, // Solo dos decimales
            digitSeparator: true // Activa separadores de miles
          }
        },


      ],
    },
  ],
});

const cuestionario = new PopupTemplate({
  title: '{nombre_pta}',
  outFields: ["*"],
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'tecnico',
          label: '<b><font>Tecnico DEVIDA</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'nombre_participante',
          label: '<b><font>Participante:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'area_total',
          label: '<b><font>Area (ha):</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
      ],
    },
  ],
});

@Injectable({
  providedIn: 'root',
})

export class GeovisorSharedService {
  public mapa = new Map({ basemap: 'satellite' });
  public view!: MapView;


  //*DATOS_GEOESPACIALES DE IDEP
  public layerUrls = {
    baseService: 'https://www.idep.gob.pe/geoportal/rest/services',
    limits: {
      departamentos: 'DATOS_GEOESPACIALES/LÍMITES/FeatureServer/3',
      provincias: 'DATOS_GEOESPACIALES/LÍMITES/FeatureServer/4',
      distritos: 'DATOS_GEOESPACIALES/LÍMITES/FeatureServer/5',
    }
  }
  //*Servicio de DEVIDA
  public layerUrlDevida = {
    baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/Mapa_Muestra/FeatureServer',
    capasdevida: {
      observaciones: '0',
      acuicola: '1',
      segundoEnvio: '2',
    }
  };
  public urldevidaacuicola = {
    baseService: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services',
    capas: {
      ambitoOzZonales: 'ambitosZonales/FeatureServer0',

    }
  }
  //*Servicio de DEVIDA
  public layerUrlDevida2 = {
    baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/Map_Service/FeatureServer',
    capasdevida: {
      parcelas3: '5',
      parcelas2: '6',
    }
  };
  public layerUrlSurveyCacao = {
    baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/Cuestionario_Ubicacion/FeatureServer',
    capasdevida: {
      cacao: '5',
    }
  };

  public layerUrlEnvioMdagri = {
    baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/poligonos/FeatureServer',
    poligonos: {
      cafe: '0',
      cacao: '1',
    }
  };

  public layers: LayerConfig[] = [

    //*Capas de Limites Politicos
    {
      title: 'DISTRITOS',
      url: `${this.layerUrls.baseService}/${this.layerUrls.limits.distritos}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      group: 'LIMITES POLITICOS',
    },
    {
      title: 'PROVINCIAS',
      url: `${this.layerUrls.baseService}/${this.layerUrls.limits.provincias}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      labelsVisible: false,
      group: 'LIMITES POLITICOS',
    },
    {
      title: 'DEPARTAMENTOS',
      url: `${this.layerUrls.baseService}/${this.layerUrls.limits.departamentos}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: true,
      labelsVisible: true,
      group: 'LIMITES POLITICOS',
    },


     //*Servicios de capas base
     {
      title:'POLIGONOS DE CULTIVO - CAFE',
      url:`${this.layerUrlEnvioMdagri.baseServicio}/${this.layerUrlEnvioMdagri.poligonos.cafe}`,
      renderer: undefined,
      popupTemplate: cuestionario,
      visible: true,
      group: 'CARTOGRAFIA DEVIDA'
     },
     {
      title:'POLIGONOS DE CULTIVO - CACAO',
      url:`${this.layerUrlEnvioMdagri.baseServicio}/${this.layerUrlEnvioMdagri.poligonos.cacao}`,
      renderer: undefined,
      popupTemplate: cuestionario,
      visible: true,
      group: 'CARTOGRAFIA DEVIDA'
     },
     {
      title:'CUESTIONARIO DE PERCEPCION',
      url:`${this.layerUrlSurveyCacao.baseServicio}/${this.layerUrlSurveyCacao.capasdevida.cacao}`,
      renderer: undefined,
      popupTemplate: cuestionario,
      visible: true,
      group: 'CARTOGRAFIA DEVIDA'
    },
    {
      title: 'OFICINA ZONAL',
      url: `${this.urldevidaacuicola.baseService}/${this.urldevidaacuicola.capas.ambitoOzZonales}`,
      labelingInfo: undefined,
      //popupTemplate: popCultivo,
      renderer: undefined,
      visible: true,
      labelsVisible: true,
      group: 'CARTOGRAFIA DEVIDA',
    },


  ];

  public lis: [] = [];
  public searchTerm = '';
  public filteredArray: [] = [];
  //* Footer coordenadas
  public gcsLongitude = '--';
  public gcsLatitude = '--';
  public utmZone = '--';
  public utmEast = '--';
  public utmNorth = '--';
  public scale = '--';
  public legend!: Legend;

  constructor() { }

  initializeMap(mapViewEl: ElementRef): Promise<void> {
    const container = mapViewEl.nativeElement;
    this.layers.forEach((layerConfig) => {
      let featureLayer;
      if (layerConfig.popupTemplate == undefined) {
        featureLayer = new FeatureLayer({
          url: layerConfig.url,
          title: layerConfig.title,
          visible: layerConfig.visible,
          outFields: layerConfig.outFields,
          featureReduction: layerConfig.featureReduction
        });
      }
      else if (layerConfig.popupTemplate && layerConfig.renderer == undefined) {
        featureLayer = new FeatureLayer({
          url: layerConfig.url,
          title: layerConfig.title,
          popupTemplate: layerConfig.popupTemplate,
          labelsVisible: layerConfig.labelsVisible,
          visible: layerConfig.visible,
          featureReduction: layerConfig.featureReduction
        });
      }
      else if (layerConfig.popupTemplate && layerConfig.renderer && layerConfig.labelingInfo == undefined) {
        featureLayer = new FeatureLayer({
          url: layerConfig.url,
          title: layerConfig.title,
          popupTemplate: layerConfig.popupTemplate,
          renderer: layerConfig.renderer,
          visible: layerConfig.visible,
          labelsVisible: layerConfig.labelsVisible,
          featureReduction: layerConfig.featureReduction
        });
      }
      else {
        featureLayer = new FeatureLayer({
          url: layerConfig.url,
          title: layerConfig.title,
          popupTemplate: layerConfig.popupTemplate,
          labelingInfo: layerConfig.labelingInfo,
          outFields: layerConfig.outFields,
          visible: layerConfig.visible,
          renderer: layerConfig.renderer,
          maxScale: layerConfig.maxScale,
          minScale: layerConfig.minScale,
          labelsVisible: layerConfig.labelsVisible,
          featureReduction: layerConfig.featureReduction
        });
      }
      this.mapa.add(featureLayer);
    });
    //*Creacion de la Vista del Mapa
    const view = new MapView({
      container: container,
      map: this.mapa,
      center: [-74.00000, -10.00000],
      zoom: 6,
      rotation: 0,
      constraints: {
        maxZoom: 25,
        minZoom: 6,
        snapToZoom: false,
      },
      padding: { top: 0 },
      ui: {
        components: [],
      },
    });
    //*Escala del Mapa
    view.watch('scale', (scale) => {
      this.scale = this.formatScale(scale);
    });

    //CONTROLES DE FUNCION DEL MAPA (LADO DERECHO)
    const sourceDEVIDA = [
      {
        layer: new FeatureLayer({
          url: `${this.urldevidaacuicola.baseService}/${this.urldevidaacuicola.capas.ambitoOzZonales}`
        }),
        searchFields: ["OZ_DEVIDA"],
        displayField: "OZ_DEVIDA",
        exactMatch: false,
        outFields: ["*"],
        name: "Oficina Zonal",
        placeholder: "Ingrese la Oficina Zonal",
        maxResults: 8,
        maxSuggestions: 8,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.layerUrlSurveyCacao.baseServicio}/${this.layerUrlSurveyCacao.capasdevida.cacao}`
        }),
        searchFields: ["nombre_participante"],
        displayField: "nombre_participante",
        exactMatch: false,
        outFields: ["*"],
        name: "Cuestionario",
        placeholder: "Ingrese participante",
        maxResults: 8,
        maxSuggestions: 8,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
    ]

    const buscar = new Search({
      view: view,
      sources: sourceDEVIDA,
      includeDefaultSources: false, // desactiva el World Geocoding Service
      allPlaceholder: 'Buscar dirección o lugar',
      label: 'Buscar',
      locationEnabled: true,
      maxResults: 10,
      popupEnabled: false,
      container: "searchDiv"
    });

    buscar.on("select-result", async (event) => {
      const result = event.result;

      if (result && result.feature && result.feature.geometry) {
        const geometry = result.feature.geometry;

        try {
          if (geometry.type === "point") {
            await view.goTo({
              target: geometry,
              zoom: 17, // Aplica zoom al punto
            });
          } else if (geometry.extent) {
            await view.goTo({
              target: geometry.extent.expand(1.5), // Aplica zoom a entidades de área
            });
          } else {
            console.warn("La geometría no tiene un 'extent' válido.");
          }
        } catch (error) {
          console.error("Error al aplicar el zoom:", error);
        }
      } else {
        console.error("No se encontró geometría en el resultado.");
      }
    });

    //{position:'top-right', index:0})
    view.ui.add(new Zoom({ view }), { position: 'top-right', index: 1 });
    view.ui.add(new Home({ view }), { position: 'top-right', index: 2 });
    view.ui.add(new Locate({ view, icon: 'gps-on-f' }), { position: 'top-right', index: 3 });
    view.ui.add(new Expand({ view, expandTooltip: 'Galeria de Mapas Base', content: new BasemapGallery({ view, icon: 'move-to-basemap' }) }), { position: 'top-right', index: 4 });


    this.legend = new Legend({ view, container: document.createElement('div') });
    new CoordinateConversion({ view });
    view.when(() => {
      view.on('pointer-move', (event) => {
        const point: any = view.toMap({ x: event.x, y: event.y });
        if (point) this.updateCoordinates(point.latitude, point.longitude);
      });
    }); this.view = view;
    return this.view.when();
  } //*Fin <initializeMap>

  //*Inicio del Toogle
  toggleLayerVisibility(layerTitle: string, visibility: boolean): void {
    const layer = this.mapa.layers.find((layer) => layer.title === layerTitle);
    if (layer) {
      layer.visible = visibility;
    }
  } //*Fin de toggleLayerVisibility

  //*Inicio carga de capa
  getLayerVisibility(layerTitle: string): boolean {
    const layer = this.mapa.layers.find((layer) => layer.title === layerTitle);
    return layer ? layer.visible : false;
  }

  private capas: Record<string, FeatureLayer> = {};
  getActiveLayers(): FeatureLayer[] {
    return Object.values(this.capas).filter((layer) => layer.visible);
  }

  updateCoordinates(lat: number, lon: number): void {
    this.gcsLongitude = lon.toFixed(5);
    this.gcsLatitude = lat.toFixed(5);
    // Calculate UTM Zone
    const zoneNumber = Math.floor((lon + 180) / 6) + 1;
    const utmBand = this.getUtmBand(lat);
    this.utmZone = `${zoneNumber} ${utmBand}`;

    // Convert to UTM
    const pointUTM = new Point({
      latitude: lat,
      longitude: lon,
      spatialReference: SpatialReference.WGS84,
    });
    const utmWkid = lat >= 0 ? 32600 + zoneNumber : 32700 + zoneNumber; // WKID for UTM zone
    const projected = projection.project(pointUTM, new SpatialReference({ wkid: utmWkid })) as Point;

    const utmPoint = projected as Point;
    this.utmEast = `${utmPoint.x.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;
    this.utmNorth = `${utmPoint.y.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;
  }

  getUtmBand(latitude: number): string {
    const bands = 'CDEFGHJKLMNPQRSTUVWX'; // Bands from 80S to 84N
    const index = Math.floor((latitude + 80) / 8);
    return bands.charAt(index);
  }

  formatScale(scale: number): string {
    return scale.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
