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
      description: 'In select mode, click to add a node.',
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
    },
    canvas: {
      toolbar: {
        select: 'Select',
        link: 'Add edge',
        delete: 'Delete',
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
      description: '选择模式下点击添加节点。',
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
    },
    canvas: {
      toolbar: {
        select: '选择',
        link: '连边',
        delete: '删除',
      }
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
})