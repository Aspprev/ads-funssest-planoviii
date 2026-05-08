import styled, { css } from 'styled-components';


interface ContainerProps {
  color?: 'white' | 'green' | 'darkgreen' | 'pink' | 'purple' | 'blue' | 'orange'
  size?: 'large' | 'normal'
  gradientDirection?: 'left' | 'right'
  displayed?: boolean
}

const getGradientAndShadow =
  (color1: string, color2: string, direction: ContainerProps['gradientDirection']) => css`
  ${ direction === 'right' ? css`
    background-image: linear-gradient(60deg,${color1},${color2});
  ` : css`
    background-image: linear-gradient(60deg,${color2},${color1});
  `}
  box-shadow: 0px 6px 8px rgba(101, 101, 101,0.2);
`

const colorTypesVariation = {
  green: {
    left: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#6DE381', '#31D19E', 'left')}
    `,
    right: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#6DE381', '#31D19E', 'right')}
    `
  },
  darkgreen: {
    left: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#28A745', '#228F3C', 'left')}
    `,
    right: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#28A745', '#228F3C', 'right')}
    `
  },
  pink: {
    left: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#FBADB4', '#EB6A9F', 'left')}

    `,
    right: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#FBADB4', '#EB6A9F', 'right')}
    `
  },
  purple: {
    left: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#9C9EFF', '#7A71EF', 'left')}

    `,
    right: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#9C9EFF', '#7A71EF', 'right')}
    `
  },
  blue: {
    left: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#045381', '#0069D9', 'left')}

    `,
    right: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#045381', '#0069D9', 'right')}
    `
  },
  orange: {
    left: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#d96500', '#ff8c29', 'left')}

    `,
    right: css`
      color: ${({ theme }) => theme.colors.textSecondary};
      ${getGradientAndShadow('#d96500', '#ff8c29', 'right')}
    `
  },
  white: {
    left: css`
      color: ${({ theme }) => theme.colors.text};
      background-color: #FFFFFF;
      box-shadow: 0px 6px 8px rgba(101, 101, 101,0.09);
      border: 1px solid #EAEAEA;
    `,
    right: css`
      color: ${({ theme }) => theme.colors.text};
      background-color: #FFFFFF;
      box-shadow: 0px 6px 8px rgba(101, 101, 101,0.09);
      border: 1px solid #EAEAEA;
    `
  },
}

export const Container = styled.div<ContainerProps>`
  ${props => colorTypesVariation[props.color || 'white'][props.gradientDirection || 'right']}

  width: ${props => props.size === 'large' ? '100%' : '160px'};
  min-height: ${props => props.displayed ? '85px' : '0px'};
  height: ${props => props.displayed ? '100%' : '0px'};
  padding: ${props => props.displayed ? '15px' : '0px'};

  position: relative;
  border-radius: 4px;
  opacity: ${props => props.displayed ? 1 : 0};

  pointer-events: ${props => props.displayed ? 'all' : 'none'};
  overflow: none;

  transition: .2s all ease-in-out;

  @media screen and (max-width: 766px){
    width: ${props => props.size === 'large' ? '100%' : '200px'};
  }
`
