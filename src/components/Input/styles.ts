import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import Tooltip from '../Tooltip'

interface ContainerProps {
  isFocused: boolean
  isFilled: boolean
  isErrored: boolean
  sizeBox?: 'small' | 'medium' | 'large'
  hasSufix?: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  position:relative;

  color: ${props => props.theme.colors.placeholder};
  border: 1px solid ${props => props.isFilled
    ? transparentize(0.4, '#3E3E3E')
    : transparentize( 0.4, '#AEAEAE')};
  background: transparent;
  border-radius: 4px;

  width: 100%;
  padding: 16px 12px;
  margin-bottom: 12px;

  transition: .2s;

  > label {
    position: absolute;
    top: 16px;
    left: 12px;
    padding-right:12px;

    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.placeholder} ;

    transition: .2s;
    pointer-events: none;
  }

  span {
    color: ${ props => props.theme.colors.text};
    display: inline-block;
    margin-right: 4px;
  }

  input {
    appearance: none;
    color: ${ props => props.theme.colors.text};
    flex: 1; // ${props => !props.hasSufix ? 1 : 0};
    text-align: left; // {props => !props.hasSufix ? 'left' : 'right'};
    border: 0;
    background: transparent;
    & + span{
      margin-right: 24px;
      margin-left: 4px;
    }

    &::placeholder {
      color: ${props => props.theme.colors.placeholder};
    }
  }

  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  svg {
    margin-right: 12px;
    color: ${props => props.isFilled ? props.theme.colors.mainColor : props.theme.colors.placeholder}
  }

  ${({ sizeBox }) => (sizeBox && sizeBox === 'small') && css`
    height: 48px;

    > label {
      font-size: 10px;
    }
  `}

  ${({ sizeBox }) => (sizeBox && sizeBox === 'large') && css`
    height: 70px;

    > label {
      font-size: 12px;
    }
  `}


  ${props =>
    props.isErrored &&
    css`
      border-color: ${props => props.theme.colors.error};
  `}

  ${props =>
    props.isFocused &&
    css`
      border-color: ${transparentize(0.4, '#3E3E3E')};
      color: ${props => props.theme.colors.mainColor};
  `}


  ${props =>
    props.isFilled &&
    css`
      color: ${props => props.theme.colors.secondaryColor};
  `}

  ${props =>
    props.isErrored && (props.sizeBox && props.sizeBox === 'large') &&
    css`
      > label {
        font-size: 10px;
        padding-right: 28px;
      }
  `}

  ${props =>
    props.isErrored && (props.sizeBox && props.sizeBox === 'large') &&
    css`
      > label {
        font-size: 13px;
        padding-right: 30px;
      }
  `}

  ${props => (props.isFilled || props.isFocused) && css`
    padding-top: 24px;

    ${props.sizeBox === 'large' && css`
      padding-top: 33px;
    `}
    ${props.sizeBox === 'small' && css`
      padding-top: 28px;
    `}

    > label {
      transform: translateY(-12px);
      font-size: 12px;
      letter-spacing: 0.1em;
    }
  `}
`

export const Error = styled(Tooltip)`
height: 20px;
margin-left: 12px;
position: absolute;
right: 10px;

svg {
  margin: 0%;
}

span {
  background: ${ props => props.theme.colors.error};
  color: #fff;
  text-align: center;

    &::before {
    border-color: ${ props => props.theme.colors.error} transparent;
  }
}
`
