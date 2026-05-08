import styled from 'styled-components';
import ColoredBox from '../../../components/ColoredBox';


export const Container = styled.div`

  // display:flex;
  // flex-direction: column;
  // margin:0 auto;
  // align-items: center;
  // height:100%;
  // min-height:calc(100vh - 95px);
  // max-width: 420px;
  // margin-top:-25px;
  // padding-top:25px;

  display:flex;
  flex-direction: column;
  margin:0 auto;
  align-items: center;
  height:100%;
  width:100%;
  padding: 20px 15px;
  justify-content: space-evenly;
  // min-height:calc(100vh - 95px);
  // max-width: 420px;
  // margin-top: -25px;
  // padding-top:25px;

  @media screen and (min-width: 766px){
    max-width: 500px;
  }
`;

export const LogoContent = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;

/*
  @media screen and (min-width: 766px) {
    width: 500px;
  }*/

`

export const Content = styled.main`

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 10px 15px;

  header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    margin-bottom:30px;
    > div {
      > span {
        font-size: 12px;
      }

      > h3 {
        font-size: 16px;
        font-weight: bold;
        margin:4px 0px;
      }

      > small {
        font-size: 9px;
      }
    }
  }
  article {
    text-align: center;

    max-width:325px;

    p{
      font-size: 12px;
    }
  }

  @media screen and (min-width: 766px){
    header {

      margin-bottom:35px;
      > div {
        > span {
          font-size: 13px;

        }
        > h3 {
          font-size: 17px;
          margin: 5px 0px;
        }
        >small {
          font-size: 10px;
        }
      }
    }
    article {
      max-width: 350px;
      p {
        font-size: 14px;
      }
    }
  }
`

export const GraphWrapper = styled.div`
  display: block;
  height: 285px;
  margin-top:16px;
  margin-bottom:16px;
  width:100%;

  @media screen and (min-width: 766px){
    height: 300px;
    margin: 22px 0px;
  }
`

export const ReceiveTypes = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: center;

  > p{
    text-align: center;
    margin-bottom:12px;
    color: #8A8A8A;
  }

  > small {
    text-align: center;
    margin-top:24px;
  }

  &::after{
    content: '';
    width: 230px;
    height:1px;
    background-color: #C3C3C3;
    margin: 28px auto 18px;

  }

  @media screen and (min-width: 766px){
    > p{
      font-size: 14px;
    }
    >small {
      margin-top: 26px;
    }
    &:after {
      width: 260px;
      margin: 32px auto 24px;
    }
  }

`

export const ReceiveBox = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;

  & + div {
    margin-top: 24px;
  }


`

interface BtnSelProps {
  selected: boolean
}

export const ButtonSelectBox = styled.button<BtnSelProps>`
  width: 95%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid ${({ selected }) => selected ? '#6DE381' : '#c1c1c1'};
  border-radius: 4px;

  > img {
    margin-right: 12px;

  }
  > span {
    display: inline-block;
    flex: 1;
  }

  &:hover {
    cursor: pointer;
  }
`

interface BoxButtonsProps {
  displayed?: boolean
}
export const BoxButtons = styled.div<BoxButtonsProps>`
  pointer-events: ${props => props.displayed ? 'all' : 'none'};
  overflow: none;

  margin-top: ${props => props.displayed ? '10px' : '0px'};

  transition: .2s all ease-in-out;

  min-height: ${props => props.displayed ? '30px' : '0px'};
  height: ${props => props.displayed ? '100%' : '0px'};

  opacity: ${props => props.displayed ? 1 : 0};


`
interface BtnProps {
  isSelected?: boolean
}
export const ButtonSimulationCalc = styled.button<BtnProps>`

  border: unset;
  padding: 10px 15px;
  border-radius: 4px;

  border: 1px solid;
  border-color: ${props => props.isSelected ? '#6DE381' : '#c1c1c1'};
  background-color: ${props => props.isSelected ? 'rgba(109, 227, 129,0.2)' : 'unset'};
  & + button {
    margin-left: 5px;
  }
  @media screen and (min-width:766px){
    & + button {
      margin-left: 10px;
    }
  }
`

export const ColoredBoxInfo = styled(ColoredBox)`

  position: relative;



  margin-top: ${props => props.displayed ? '16px' : '0px'};
  padding: ${props => props.displayed ? '10px' : '0px'};

  height: ${props => props.displayed ? '100%' : '0px'};

  display: flex;
  flex-direction: column;

  > div:first-child {
    > p {
      display: block;
      font-size: 27px;
      font-weight: bold;

    }
    >small {
      margin-top:px;
      font-size: 10px;
      font-weight: normal;
      display:block;
    }
  }
  > small {
    margin-top:18px;
    font-size: 12px;
    display:block;
    width:165px;
  }

  > img {
    position: absolute;
    bottom: -10px;
    right: -20px;
    transition: 0.3s all ease-in-out;

    height: ${props => props.displayed ? '175px' : '0px'};
    opacity: ${props => props.displayed ? '1' : '0'};
  }

  & + div {
    margin-top:35px;
  }
`
export const BtnVoltar = styled.button`
  border: none;
  background-color: unset;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid transparent;
  padding: 0px 3px 2px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {

    border-bottom: 1px solid ${({ theme }) => theme.colors.text};

  }
`
