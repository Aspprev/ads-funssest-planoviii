import styled from 'styled-components';
import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


export const Container = styled.div`
  /*display:flex;
  flex-direction: column;
  align-items: center;
  margin:0 auto;
  height:100%;
  width:100%;
  padding: 20px 15px;
  justify-content: space-evenly;

  @media screen and (min-width: 766px){
    height:100%;
    width:100%;
  }*/
  display:flex;
  flex-direction: column;
  margin:0 auto;
  height:100%;
  width:100%;
  align-items: center;
  padding: 20px 15px;
  justify-content: space-evenly;
`;

export const Content = styled.div`

  position:relative;
  display: flex;
  width: 95vw;
  //background:#FFF;
  //box-shadow: 0px 12px 14px rgba(209,212,226,0.4);
  border-radius: 4px;
  padding: 15px;
  margin-bottom:50px;
  flex-direction: column;
  align-items: center;

  > p {
    font-weight: bold;
    font-size: 10px;
    text-align: center;
  }

  > footer {
    p {
      font-size: 12px;
      text-align: center;

      & + p {
        margin-top: 5px;
      }
    }

  }

  @media screen and (min-width: 766px){
    width: 70vw;
    padding: 18px;

    max-width: 550px;

    > p {
      font-size: 12px;
    }

    > footer {
      p {
        font-size: 14px;
        & + p {
          margin-top: 7px;
        }
      }
    }
  }

  @media screen and (min-width: 990px) {
    width: 45vw;
  }
`

export const BoxValueContent = styled.div`
  // background-color:white;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 15px;

  > p {
    font-size: 16px;
  }
`

export const BoxValueCheckContent = styled.div`

  >div {
    margin-top: 10px;
    margin-bottom: 5px;
    justify-content: center;
    align-content: center;
    flex-direction: row;
    //background-color: red;

    input[type=checkbox] {
      height: 14px;
      width: 14px;
      margin-right: 5px;
    }

    > label {
      color: black;
      margin-left: 5px;
      font-size: 16px;
      text-align: center;
    }
  }

`

export const RadioButton = styled.div`
    background: initial;
    border-radius: 4px;
    padding: 16px 0px;
    display: -webkit-box;
    display: -ms-flexbox;
    -ms-flex-align: center;
    width: 100%;
  // background-color:red;

  color: ${props => props.theme.colors.placeholder};

  margin-bottom: 12px;
  transition: .2s;

  > div{
    margin-top: 3px;
    margin-bottom: 3px;
    //font-size: 20px;
    //font: 'Verdana';
    display: flex;
    flex-direction:row;
    //margin: 0 auto;
    align-items: center;
    justify-content: center;

    > div {
      display: flex;
      flex-direction:row;
      //margin: 0 auto;
      //align-items: center;
      //justify-content: center;
      // margin-top: 12px;
      // margin-bottom: 26px;
      //margin-left: 10px;
      margin-right: 10px;
      align-items: center;
    }

    input {
    // appearance: none;
    color: ${ props => props.theme.colors.text};
    flex: 0;
    text-align:  right;
    border: 0;
    background: transparent;
    margin-right: 5px;

    &::placeholder {
      color: ${ props => props.theme.colors.placeholder};
    }

    & + span{
      margin-right: 0px;
      margin-left: 4px;
    }
  }

    & + span{
      margin-right: 0px;
      margin-left: 4px;
    }
  }
  svg {
    margin-right: 12px;
  }
`

export const PercentualContent = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0px 12px 14px rgba(209,212,226, 0.4);

  > div{
    flex-direction: column;
    justify-content: center;
    align-items: center;


    #Texto{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
    }

    #Comp{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
    }

    #Msg{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
      >

      small {
        text-align:center;
        margin-bottom: 5px;
      }
    }
  }

  #Periodo{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;

    >select {
      font-size: 14px;
      width: 80%;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

  @media screen and (min-width: 766px){
    width: 100%;
  }

`

export const ValorContent = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0px 12px 14px rgba(209,212,226, 0.4);

  > div{
    flex-direction: column;
    justify-content: center;
    align-items: center;


    #Texto{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
    }

    #Comp{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
    }

    #Msg{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;
      >small {
        text-align:center;
        margin-bottom: 5px;
      }
    }
  }

    #Perio{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;

      >select {
        font-size: 14px;
        width: 80%;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }

  @media screen and (min-width: 766px){
    width: 100%;
  }

`

export const BoxValue = styled.div`
  width: 100%;
  border-radius: 4px;
  box-shadow: 0px 12px 14px rgba(209,212,226, 0.4);
  background:#FFF;
  flex-direction: column;
  padding: 15px;

  > p {
    font-weight: bold;
    color: #8a8a8a;
  }

  label {
    padding-right: 5px;
  }

  strong {
    font-size: 18px;
    padding-right: 5px;
  }


  > form {
    width: 100%;
  }

  > span {
    color: #ca6048;
    font-size: 12px;
    font: 'Verdana';
  }

  > input {
    margin-left: 15px;
    border: solid 1px #8c8c8c;
    border-radius: 5px;
    height: 25px;
    width: 50px;
  }

  table{
    border-spacing: 16px 12px;
    td {
      width: 70%;
    }
  }
  /*> div:last-child {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > div {
      width: 100%;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 10px;
      text-align: center;

      > p {
        color: #1c1c1c;
        font-size: 12px;
        margin-top:5px;
      }
      > input {
        color: #31D19E;
        font-size: 18px;
        font-weight: bold;
        outline: 0;
        border: solid 1px;
        text-align: right;
        margin-left: 10px;
        border-radius: 5px;
      }
      > select {
        font-family: 'Karla','Roboto',sans-serif;
        color: #333;
        font-size: 14px;
        outline: 0;
        border: solid 1px #31D19E;
        text-align: right;
        margin-left: 10px;
        border-radius: 5px;
      }
      > strong{
        font-size: 18px;
        margin-left: 10px;
        margin-right: 10px;
      }
      >img{
        margin-right: 10px
      }
      > small {
        color: #8a8a8a;
        font-size: 9px;
        width: 100%;
        text-align: center;
      }
    }
  }*/




  @media screen and (min-width: 766px){

    > p {
      margin-bottom: 14px;
    }

    > div:last-child {
      margin-top: 14px;

      > div {

        > p {
          color: #1c1c1c;
          font-size: 13px;
          margin:0;
        }
        > h3 {
          color: #31D19E;
          font-size: 19px;
          font-weight: bold;
        }
        > small {
          color: #8a8a8a;
          font-size: 10px;
        }
      }
    }

  }

`

export const LogoContent = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;

/*
  @media screen and (min-width: 766px) {
    width: 500px;
  }*/

`

export const TitleContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: #D9DADD;
  color: #000;
  margin-top: 20px;
  //margin-bottom: 20px;
  // font-size:20px;
/*
  @media screen and (min-width: 766px) {
    width: 500px;
  }*/

`

export const MainTitleContent = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: #FF8636;
  margin-bottom: 10px;
  font-size: 20px;
  width: 400px;
  /*
  @media screen and (min-width: 766px) {
    width: 420px;
  }*/

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
  &:focus {
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }
`


interface DivC {
  isVisible?: boolean
}
export const DivC = styled.div<DivC>`
text-align: -webkit-center;

  > label {
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    visibility: ${props => props.isVisible ? 'visible' : 'hidden'};

    &:hover {
      border-bottom: 1px solid ${({ theme }) => theme.colors.text};
    }
  }

  > button {
    width: 100%;
    background-image: linear-gradient(60deg,#FDA10D,#ffc456);
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    border: none;
    border-radius: 30px;
    color: #F5F5F5;
    font-size: 16px;
    font-weight: bold;
    min-height: 25px;
    margin-bottom: 15px;

    &:disabled {
      background-image: linear-gradient(60deg,#bababa,#bcbcbc);
    }
  }

`

interface BtnProps {
  isSelected?: boolean
}
export const ButtonSimulationCalc = styled.button<BtnProps>`

  border: unset;
  padding: 10px 15px;
  border-radius: 4px;

  border: 1px solid;
  border-color: ${props => props.isSelected ? '#3469bf' : '#c1c1c1'};
  background-color: ${props => props.isSelected ? 'rgba(255, 196, 86,0.2)' : 'unset'};
  & + button {
    margin-left: 5px;
  }
  @media screen and (min-width:766px){
    & + button {
      margin-left: 10px;
    }
  }
`

interface BtnOpcProps {
  isActive: boolean;
}
export const BtnOpc = styled.button<BtnOpcProps>`
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  padding: 3px;
  background-color: ${props => props.isActive? '#3469bf' : 'transparent'} ;
  color: ${props => props.isActive? '#fff' : '#000'} ;
  border-radius: 4px;
  &:focus{
    text-decoration: underline;
  }
`

export const ButtonController = styled.button<BtnProps>`
  padding: 10px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  width: 40px;
  // background-color: ${props => props.isSelected ? 'rgba(4,103,159,0.05)' : 'unset'};

  > svg {
  color: ${props => props.isSelected ? '#3469bf' : '#D2D2D2'};
  }
`
export const TextController = styled.button`
  padding: 4px;
  width: 50px;
  align-items: center;
  text-align: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
`
