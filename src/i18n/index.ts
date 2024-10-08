import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    header: {
      title: 'Giraphe'
    },
    footer: {
      by: 'Giraphe by'
    },
    sidepanel: {
      description: 'This is a work in progress. Somehow usable.',
    },
    panel: {
      globalSettings: 'Global',
      globalSettingsFull: 'Global Settings',
      defaultStyles: 'Styles',
      defaultStylesFull: 'Default Styles',
      vertexSettings: 'Vertex',
      vertexSettingsFull: 'Vertex Settings',
      edgeSettings: 'Edge',
      edgeSettingsFull: 'Edge Settings',
      position: 'Position',
      positionX: 'X',
      positionY: 'Y',
      text: 'Text',
      size: 'Size',
      fillColor: 'Fill Color',
      strokeColor: 'Stroke Color',
      strokeWidth: 'Stroke Width',
      textSize: 'Text Size',
      widthScale: 'Width Scale',
      shape: 'Shape',
      circle: 'Circle',
      square: 'Square',
      export: 'Export',
      exportSvg: 'Export SVG',
      directed: 'Directed',
      strokeStyle: 'Stroke Style',
      solid: 'Solid',
      dashed: 'Dashed',
      label: 'Label',
      labelText: 'Text',
      labelTextColor: 'Color',
      labelTextFontSize: 'Font Size',
      labelTextStrokeColor: 'Stroke Color',
      labelTextStrokeWidth: 'Stroke Width',
      coordinateSystems: 'Grids',
      offsetAngle: 'Offset angle',
      curve: 'Curve',
      saveLoad: 'Save/Load',
      saveGraph: 'Save Graph',
      loadGraph: 'Load Graph',
      defaultStyleSettingsFull: 'Default Style Settings',
      vertexDefaults: 'Vertex Defaults',
      edgeDefaults: 'Edge Defaults',
    },
    canvas: {
      toolbar: {
        select: 'Select',
        link: 'Add edge',
        delete: 'Delete',
        directedEdge: 'Directed',
        cleanGraph: 'Clear the whole graph',
        confirmClear: 'Clear the graph? All the data will be lost.'
      }
    }
  },
  zh: {
    header: {
      title: 'Giraphe'
    },
    footer: {
      by: 'Giraphe by'
    },
    sidepanel: {
      description: '目前还是个半成品，但已经能用了。',
    },
    panel: {
      globalSettings: '全局',
      globalSettingsFull: '全局设置',
      defaultStyles: '样式',
      defaultStylesFull: '默认样式',
      vertexSettings: '点',
      vertexSettingsFull: '节点设置',
      edgeSettings: '边',
      edgeSettingsFull: '边设置',
      position: '位置',
      positionX: 'X坐标',
      positionY: 'Y坐标',
      text: '文本',
      size: '大小',
      fillColor: '填充颜色',
      strokeColor: '描边颜色',
      strokeWidth: '描边宽度',
      textSize: '文本大小',
      widthScale: '宽度缩放',
      shape: '形状',
      circle: '圆形',
      square: '方形',
      export: '导出',
      exportSvg: '导出SVG',
      directed: '有向',
      strokeStyle: '连线样式',
      solid: '实线',
      dashed: '虚线',
      label: '标签',
      labelText: '文本',
      labelTextColor: '颜色',
      labelTextFontSize: '字号',
      labelTextStrokeColor: '描边颜色',
      labelTextStrokeWidth: '描边宽度',
      coordinateSystems: '网格',
      offsetAngle: '偏移角度',
      curve: '曲边',
      saveLoad: '保存/加载',
      saveGraph: '保存',
      loadGraph: '加载',
      defaultStyleSettingsFull: '默认样式设置',
      vertexDefaults: '节点默认值',
      edgeDefaults: '边默认值',
    },
    canvas: {
      toolbar: {
        select: '选择',
        link: '连边',
        delete: '删除',
        directedEdge: '边有向',
        cleanGraph: '清空全图',
        confirmClear: '清空全图？所有数据将会丢失。'
      }
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
})