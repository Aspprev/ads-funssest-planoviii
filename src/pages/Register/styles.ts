import styled from 'styled-components'
import { transparentize } from 'polished'

interface BtnContatoProps {
  isActive: boolean;
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

  > div {
    display: flex;
    justify-content: right;
    align-items: center;
    margin-top: 25px;
    text-align: right;

    small {
      margin-right: 12px;
      font-weight: bold;
    }

    a {
      text-decoration: none;
      &:focus, &:hover {
        text-decoration: underline;
      }
    }
  }

  > small {
    display: flex;
    width: 70%;
    margin: 5px auto 0;
    font-size: 11px;
    font-style: italic;
    text-align: center;
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px;

    > small {
      width: 90%;
    }
  }
`

export const RadioButton = styled.div`
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

export const Line = styled.div`
  width: 65%;
  height: 1px;
  margin: 30px auto 15px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
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
