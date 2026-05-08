import styled from 'styled-components'
import { transparentize } from 'polished'

interface GoalItemProps {
  isSelected: boolean
}

export const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;

  margin: 0 auto;
  margin-bottom: 15px;
  max-width: 600px;
  padding: 0 5px;

  @media screen and (max-width: 766px) {
    max-width: 550px;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  width: 100%;
  padding: 30px 25px;
  margin-bottom: 10px;
  text-align: center;

  > strong {
    text-align: center;
    font-size: 18px;
    color: #FF612E;

    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  span {
    margin-bottom: 15px;
  }

  small {
    margin-top: 15px;
  }

  footer {
    font-size: 11px;
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px;
  }
`

export const InvestorBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  align-items: center;
  justify-content:space-evenly;

  margin: 20px auto;
`

export const GoalItem = styled.button<GoalItemProps>`
  width: 150px;
  height: 65px;

  background: transparent;
  border-radius: 4px;
  border: 1px solid ${props => props.isSelected
    ? transparentize(0.4, props.theme.colors.mainColor)
    : transparentize( 0.4, '#AEAEAE')};

  font-weight: ${props => props.isSelected
    ? 'bold'
    : 'normal'};
`

export const BtnVoltar = styled.button`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  border: none;
  background-color: unset;
  border-bottom: 1px solid transparent;
  color: ${({ theme }) => theme.colors.text};

  margin-bottom: 15px;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }

  &:focus {
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }
`

export const Line = styled.div`
  width: 65%;
  height: 1px;
  margin: 15px auto 20px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`
