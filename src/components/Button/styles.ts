import styled, { css } from 'styled-components';

interface ContainerProps {
  color?: 'green' | 'pink' | 'white' | 'blue' | 'orange'
  fontSize?: 'small' | 'normal' | 'large'
  width?: 'small' | 'medium' | 'large'
}

const buttonTypesVariation = {
  green: css`
    background-image: linear-gradient(60deg,#6DE381,#31D19E);
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(61, 69, 67, 0.08);
  `,
  blue: css`
    background: linear-gradient(15deg, #0060A1, #0093B8);
    /* background: linear-gradient(60deg,#0060A1, #0071BA); */
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(61, 69, 67, 0.08);
  `,
    orange: css`
    background-image: linear-gradient(60deg,#FF612E, #FF8F61);
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(61, 69, 67, 0.08);
  `,
  pink: css`
    background-image: linear-gradient(60deg,#FBADB4,#EB6A9F);
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(61, 69, 67, 0.08);
  `,
  white: css`
    background-color: #FFFFFF;
    color: ${({ theme }) => theme.colors.text};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(61, 69, 67, 0.08);
    border: 1px solid #EAEAEA;
  `,
  disabled: css`
    background-color: #bababa;
    color: ${({ theme }) => theme.colors.textSecondary};
    box-shadow: 0px 6px 8px rgba(101, 101, 101,0.09);
    border: 1px solid #EAEAEA;
  `,
}

const fontSizeVariation = {
  small: css`
    min-height: 40px;
    font-size: 12px;
    font-weight: normal;
  `,
  normal: css`
    min-height: 50px;
    font-size: 16px;
    font-weight: bold;
  `,
  large: css`
    min-height: 50px;
    font-size: 18px;
    font-weight: bold;
  `,
}

const widthVariation = {
  small: css`
    width: 180px;
    padding: 8px 12px;
  `,
  medium: css`
    width: 200px;
    padding: 8px 12px;
  `,
  large: css`
    width: 250px;
    padding: 8px 12px;
  `,
}

export const Container = styled.button<ContainerProps>`
  border: none;
  border-radius: 30px;
  text-align: center;
  margin: 10px 0;

  ${({ fontSize }) => fontSizeVariation[fontSize || 'normal']}
  ${({ width }) => widthVariation[width || 'medium']}
  ${props => !props.disabled ? buttonTypesVariation[props.color || 'white'] : buttonTypesVariation['disabled']}
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  display: flex;
  align-items: center;
  justify-content: space-evenly;

  svg {
    margin-right: 4px;
    max-width: 35px;
  }

  &:focus {
    text-decoration: underline;
  }
`
