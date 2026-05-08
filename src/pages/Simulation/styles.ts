import { transparentize } from 'polished'
import styled from 'styled-components'
import ColoredBox from '../../components/ColoredBox'

interface BtnSelProps {
  selected: boolean
}

interface BoxButtonsProps {
  displayed?: boolean
}

interface BtnProps {
  isSelected?: boolean
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  max-width: 600px;
  margin: 0 auto;
  padding: 0 5px;
  margin-bottom: 10px;

  @media screen and (max-width: 766px) {
    max-width: 500px;
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
  margin: 0 5px 10px;

  strong {
    text-align: center;
    font-size: 18px;
    color: #FF612E;

    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  div.values-box {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    margin: 10px 0 25px;
  }

  > article {
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    p {
      line-height: 18px;
    }
  }

  > small {
      font-style: italic;
      font-size: 11px;
      color: #666360;
      text-align: center;
      width: 75%;
    }

  > small.comment {
    padding-top: 15px;
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px;
  }
`

export const InfoValuesBox = styled(ColoredBox)`
  width: 200px;
  height: 100px;

  padding: 10px;

  span {
    font-weight: bold;
    font-size: 14px;
  }

  h3 {
    font-size: 18px;
    margin-top: 10px;
  }

  small {
    font-size: 11px;
  }

  @media screen and (max-width: 500px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 150px;
    height: 130px;
    padding: 8px;

    span {
      font-size: 14px;
    }

    h3 {
      font-size: 16px;
    }
  }
`

export const GraphWrapper = styled.div`
  height: 300px;
  width:100%;
  margin: 20px 0px 10px;
  font-size: 10px;

  div.tooltip {
    width: 160px;
    height: 100%;
    padding: 5px 10px;

    background-color: #FFF;
    border: 1px solid #DEDEDE;
    box-shadow: 0px 4px 6px rgba(101, 101, 101,0.2);
    border-radius: 4px;

    font-size: 11px;

    h4, p {
      font-weight: normal;
      margin-bottom: 5px;
    }

    span {
      font-weight: bold;
    }
  }
`

export const ReceiveBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 75%;

  & + div {
    margin-top: 15px;
  }

  @media screen and (max-width: 766px) {
    width: 85%;
  }
`

export const ButtonSelectBox = styled.button<BtnSelProps>`
  display: flex;
  align-items: center;
  position: relative;

  width: 100%;
  height: 55px;
  padding: 10px 25px;

  background-color: #FCFCFC;
  border: 1px solid ${props => props.selected ? transparentize(0.4, '#3E3E3E') : '#c1c1c1'};
  border-radius: 4px;

  img {
    position: absolute;
    width: 35px;
    height: 35px;
    align-self: center;
    left: 20px;
  }

  span {
    width: 65%;
    margin: 0 auto;
    font-weight: ${props => props.selected ? 'bold' : 'normal'};
  }

  svg {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    color: ${props => props.selected ? props.theme.colors.success : '#D9DADD'};
  }

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 766px) {
    padding: 10px 10px;

    img {
      left: 15px;
    }

    span {
      width: 43%;
    }
  }
`

export const BoxButtons = styled.div<BoxButtonsProps>`
  height: ${props => props.displayed ? '100%' : '0px'};
  margin-top: ${props => props.displayed ? '10px' : '0px'};

  overflow: none;
  opacity: ${props => props.displayed ? 1 : 0};
  pointer-events: ${props => props.displayed ? 'all' : 'none'};

  transition: .2s all ease-in-out;
  text-align: center;

  small {
    font-style: italic;
    font-size: 11px;
    color: #666360;
    text-align: center;
    width: 75%;

  }
`

export const ButtonSimulationCalc = styled.button<BtnProps>`
  width: 40px;
  height: 40px;
  border-radius: 4px;

  border: 1px solid #c1c1c1;
  background-color: transparent;

  transition: .2s all ease-in-out;

  & + button {
    margin-left: 5px;
  }

  &:hover {
    border: 1px solid  ${props => props.theme.colors.secondaryColor};
    transition: .1s all ease-in-out;
  }

  @media screen and (min-width:766px){
    & + button {
      margin-left: 10px;
    }
  }
`

export const ButtonSimulationValue = styled.button<BtnProps>`
  width: 85px;
  height: 40px;
  padding: 10px auto;
  border-radius: 4px;

  background-color: transparent;
  border: 1px solid ${props => props.isSelected ? props.theme.colors.mainColor : '#c1c1c1'};

  & + button {
    margin-left: 5px;
  }

  @media screen and (max-width:766px){
    & + button {
      margin-left: 10px;
    }
  }
`

export const ColoredBoxInfo = styled(ColoredBox)`
  margin-top: ${props => props.displayed ? '15px' : '0px'};
  margin-bottom: ${props => props.displayed ? '15px' : '0px'};
  height: ${props => props.displayed ? '190px' : '0px'};
  width: 110%;

  display: flex;

  div {
    position: relative;
    width: 60%;

    h3 {
      font-size: 24px;
      font-weight: bold;
    }

    small {
      font-size: 10px;
    }

    p {
      font-size: 14px;
      margin-top: 15px;
      width: 225px;
    }
  }

  img {
    width: 180px;
    position: absolute;
    bottom: -10px;
    right: 0px;
  }

  @media screen and (max-width:766px) {
    height: ${props => props.displayed ? '200px' : '0px'};
    width: 110%;

    div {
      h3 {
        font-size: 20px;
      }
    }

    img {
      height: 165px;
    }
  }

  @media screen and (max-width:500px) {
    height: ${props => props.displayed ? '100%' : '0px'};

    div {
      p {
        width: 130px;
      }
    }

    img {
      height: 165px;
    }
  }
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
  margin: 30px auto 15px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`
