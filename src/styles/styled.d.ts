import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;

    colors: {
      primary: string;
      secondary: string;
      tertiary: string;

      background: string;
      backgroundSecondary: string;
      backgroundTertiary: string;

      placeholder: string;
      text: string;
      textSecondary: string;

      golden: string;

      mainColor: string;
      secondaryColor: string;

      error: string;
      errorText: string;

      success: string;
      sucessText: string;
    },
  }
}
