import styled, { css } from 'styled-components';
import { tint } from 'polished'

interface ContainerProps {
  hideInput: boolean
  selectedIndex: number
}

interface CellProps {
  isFocused: boolean
  isFilled: boolean
}

export const Container = styled.div<ContainerProps>`
  > div {
    position: relative;
    display: flex;
    border: none;
    background: unset;
    cursor: default;
    overflow: hidden;

    input {
      position: absolute;
      border: none;
      background-color: transparent;
      outline: none;
      height: 32px;
      width: 40px;
      top: 0px;
      bottom: 0px;
      padding: 8px;
      text-align: center;
      left: ${props => (props.selectedIndex * 40) + ((props.selectedIndex) * 16)}px;
      opacity: ${ props => props.hideInput ? 0 : 1};
      cursor: text;
    }
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type=number] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  }
`

export const Cell = styled.div<CellProps>`
  border-bottom: 2px solid #D2D2D2;
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #555555;
  position: relative;
  padding: 8px;

  & + div{
    margin-left: 16px;
  }

${
  props =>
    props.isFilled &&
    css`
      border-color: ${props => tint(0.4, props.theme.colors.mainColor)};
    `}

${
  props =>
    props.isFocused &&
    css`
      border-color: ${props => props.theme.colors.mainColor};
    `}

`
