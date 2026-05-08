import styled, { css } from 'styled-components'
import { transparentize } from 'polished'
import Tooltip from '../Tooltip'

interface ContainerProps {
  isFocused: boolean
  isFilled: boolean
  isErrored: boolean
  sizeBox?: 'small' | 'large'
}

export const Container = styled.div<ContainerProps>`

  color: ${props => props.theme.colors.placeholder};
  border: 1px solid ${props => props.isFilled
    ? transparentize(0.4, '#3E3E3E')
    : transparentize( 0.4, '#AEAEAE')};
  background: transparent;
  border-radius: 4px;

  display: flex;
  height: 70px;
  width: 100%;
  padding: 16px 12px 8px;
  margin-bottom: 12px;

  position: relative;
  transition: .2s;

  > label {
    position: absolute;
    top: 5px;
    left: 8px;

    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.placeholder} ;
    pointer-events: none;
  }

  > div {
    margin-top: 5px;
    width: 100%;
  }

  ${props => props.isErrored && css`
    border-color: ${props => props.theme.colors.error};
  `}
`
export const Error = styled(Tooltip)`
  flex: 1;
  margin-left: 12px;
  margin-top: 20px;
  color: #fff;

  &::before {
    border-color: ${ props => props.theme.colors.error} transparent;
  }
`
