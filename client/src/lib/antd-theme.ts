
import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2a0a22',
    colorLink: '#2a0a22',
    colorSuccess: '#52C41A',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 8,
    fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Button: {
      colorPrimary: '#2a0a22',
      algorithm: true,
    },
    Input: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
    },
    DatePicker: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
    },
  },
};
