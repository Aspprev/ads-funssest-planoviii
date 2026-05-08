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

  > button {
    margin: 0 auto;
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
  padding: 16px 12px;
  margin-bottom: 12px;

  background: initial;
  border-radius: 4px;
  border: 1px solid ${transparentize(0.4, '#3E3E3E')};
  color: ${props => props.theme.colors.placeholder};
  transition: .2s;

  > label {
    transform: translateY(-12px);
    font-size: 12px;
    font-weight: bold;
  }

  > div {
    width: 70%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
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

  @media screen and (max-width: 766px) {
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
  width: 120px;
  height: 50px;
  padding: 3px;
  background: ${props => props.isActive? 'linear-gradient(15deg, #FF612E, #FF8F61)' : 'transparent'} ;
  color: ${props => props.isActive? '#fff' : props.theme.colors.placeholder} ;
  border-radius: 4px;

  &:focus {
    text-decoration: underline;
  }
`

export const BenefBox = styled.div`
  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  position: relative;
  width: 100%;
  margin: 10px 0 10px;
  padding: 15px 25px 10px;
  
  h3 {
    text-align: center;
    font-size: 18px;
    color: #FF612E;

    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  > strong {
    font-size: 18px;
    font-weight: bold;
    color: #FF612E;
    margin-left: 15px;
    text-align: center;
  }

  p {
    text-align: center;
    font-size: 14px;

    > span {
     color: #FF612E;
     font-size: 14px;
     text-decoration: underline;
     cursor: pointer;
    }
  }

  div {
    position: relative;
    margin: 6px 0;
  }

  svg {
    position: absolute;
    width: 20px;
    height: 20px;

    top: 0;
    right: 5px;
    cursor: pointer;
    color: ${props => props.theme.colors.error};
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px 10px;
  }
`

export const ContentBenef = styled.div`
  width: 100%;
  svg {
    z-index: 1;
  }
`

export const Line = styled.main`
  width: 65%;
  height: 1px;
  margin: 20px auto 20px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
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

