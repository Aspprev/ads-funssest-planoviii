import styled from 'styled-components'
import { transparentize } from 'polished'

interface BtnOptionProps {
  isActive: boolean;
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  max-width: 600px;
  margin: 0 auto;
  padding: 0 5px;

  > strong {
    font-size: 18px;
    font-weight: bold;
    color: #FF612E;
    margin-bottom: 15px;
    text-align: center;
  }

  form {
    width: 100%;
  }

  @media screen and (max-width: 766px) {
    max-width: 550px;
  }
`

export const Content = styled.main`
  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  width: 100%;
  padding: 30px 25px;
  margin: 0 5px;

  strong {
    display: flex;
    text-align: center;
    align-self: center;
    justify-content: center;
    color: #FF612E;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px;

    > small {
      width: 90%;
    }
  }
`

export const Participants = styled.div`
  // border-bottom: 1px solid #EEE;

  h4 {
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    padding-bottom: 8px;
  }

  span {
    font-size: 14px;
    font-weight: bold;
    color: #FF612E;
  }

  small {
    font-size: 12px;
    color: #666360;
  }
  .dependents {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 4px 5px;
    margin-bottom: 10px;
  }

  .titular{
    display: grid;
    padding: 4px 5px;
    margin-bottom: 10px;

    > input {
      padding: 4px 0;
      width: auto;
    }
    >label{
      padding: 8px 0 0 0;
    }
  }

  .infos {
  }

  .planos {
    display: flex;
    flex-direction: column;
    text-align: right;
  }

  button.edit {
    color: ${({ theme }) => theme.colors.text};
    background-color: #FFFFFF;
    box-shadow: 0px 6px 8px rgba(101, 101, 101,0.09);
    border: 1px solid #FF8F61;
    font-size: 12px;
    font-weight: normal;
    padding: 4px 4px;
    border-radius: 30px;
    text-align: center;

    &:focus {
      text-decoration: underline;
    }
  }
`

export const Confirmation = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding-top: 20px;

  strong {
    text-align: center;
    align-self: center;
    color: #FF612E;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  p {
    font-size: 14px;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;

    padding-top: 20px;
  }

  span {
    font-weight: bold;
    font-size: 14px;
    margin-right: 15px;
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
export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #AEAEAE;
  padding: 8px 12px;
  margin-bottom: 12px;

  h4 {
    font-size: 18px;
    color: ${props => props.theme.colors.text};
    margin-bottom: 8px;
  }

  > div {
    display: flex;
    justify-content: space-between;

    width: 100%;
    margin-top: 3px;
    margin-bottom: 8px;

    strong {
      font-size: 16px;
      color: ${props => props.theme.colors.mainColor};
      font-weight: bolder;
    }

    small {
      font-size: 12px;
      display: flex;
      font-weight: bold;
    }
  }

  span {
    font-size: 11px;
    color: ${props => props.theme.colors.placeholder};
    font-style: italic;
    margin-top: 15px;
  }

  @media screen and (max-width: 600px) {
    p {
      text-align: left;
    }

    > div {
      margin-top: 8px;

      small {
        text-align: left;
      }
    }
  }
`

export const Line = styled.div`
  width: 80%;
  height: 1px;
  margin: 15px auto 20px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`

export const RadioButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position:relative;

  width: 100%;
  padding: 16px 12px;
  margin-bottom: 12px;

  background: initial;
  border-radius: 4px;
  border: 1px solid #AEAEAE;
  color: ${props => props.theme.colors.placeholder};
  transition: .2s;

  > label {
    transform: translateY(-12px);
    font-size: 12px;
    font-weight: bold;
  }

  > div {
    width: 100%;;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
    @media screen and (max-width: 540px) {
      display: grid;
      grid-template-columns: 48% 48%;
    }
  }

  svg {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 18px;
    color: ${props => props.theme.colors.mainColor};
    cursor: pointer;
    transform: scale(1);
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }

`


export const BtnOption = styled.button<BtnOptionProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  min-width: 100px;
  background: ${props => props.isActive? 'linear-gradient(15deg, #FF612E, #FF8F61)' : 'transparent'} ;
  color: ${props => props.isActive? '#fff' : props.theme.colors.placeholder} ;
  border-radius: 4px;
  border: ${props => props.isActive ? 'none' : 'solid 1px #AEAEAE'};

  &:focus {
    text-decoration: underline;
  }
  @media screen and (max-width: 540px) {
    font-size: 12px;
  }
  @media screen and (max-width: 360px) {
    font-size: 11px;
  }
`
export const RadioButton2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position:relative;

  width: 100%;
  padding: 16px 12px 0 12px;

  background: initial;
  border-radius: 4px;
  color: ${props => props.theme.colors.placeholder};
  transition: .2s;

  > label {
    transform: translateY(-12px);
    font-size: 12px;
    font-weight: bold;
  }

  > small {
    font-size: 12px;
    color: #666360;
    font-weight: bold;
  }

  > div {
    background-color: ${transparentize(0.8, '#AEAEAE')};
    border-radius: 18px;
    width: 60%;
    height: 32px;
    display: flex;
    flex-direction:row;
    margin: 3px auto;
    align-items: center;
    justify-content: space-evenly;

    &::placeholder {
      color: ${ props => props.theme.colors.placeholder};
    }
  }

  @media screen and (max-width: 600px) {
    > div {
      width: 100%;
    }
  }
`

interface BtnContatoProps {
  isActive: boolean;
}
export const BtnContato = styled.button<BtnContatoProps>`
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: ${props => props.isActive? 'linear-gradient(15deg, #FF612E, #FF8F61)' : 'transparent'} ;
  color: ${props => props.isActive? '#fff' : props.theme.colors.placeholder};

  transition: all .2s ease-in-out;

  &:focus {
    text-decoration: underline;
  }
`

interface BtnModalProps {
  isActive: boolean;
}
export const BtnModal = styled.button<BtnModalProps>`
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  padding: 3px;
  background: ${props => props.isActive ? 'linear-gradient(15deg, #FF612E, #FF8F61)' : 'transparent'} ;
  border: ${props => props.isActive ? 'none' : 'solid 1px #FF612E'};
  color: ${props => props.isActive? '#fff' : props.theme.colors.placeholder} ;
  border-radius: 4px;
  margin: 20px 20px 0 0;
  &:focus {
    text-decoration: underline;
  }
`
