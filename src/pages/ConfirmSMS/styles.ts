import styled from 'styled-components'
import { Link } from 'react-router-dom'

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
  justify-content: center;
  align-items: center;

  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  width: 100%;
  padding: 15px 0;
  margin: 0 5px;

  strong, span {
    text-align: center;
    font-size: 16px;
    color: #333333;
    margin-top: 10px;
    width: 350px;
  }

  form {
    margin: 25px 0;
  }

  p {
    font-size: 14px;
    text-align: center;
    width: 90%;
    line-height: 22px;

    > strong {
      font-size: 14px;;
    }
  }
`

export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  padding: 8px;
  background: ${props => props.theme.colors};
  color: ${props => props.theme.colors.error};
  border-radius: 4px;
  position: relative;
  max-width: 250px;
  font-weight: bold;
  margin-bottom: 12px;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 200px;
    margin-bottom: 5px;
  }

  svg {
    position: absolute;
    font-size: 20px;
  }

  button {
    border: none;
    background-color: transparent;
    font-size: 12px;
    color: #333;
  }
`

export const Timer = styled.span`
  font-size: 12px;
  color: #FF612E;
  margin: 12px 0;

  @media screen and (min-width: 766px){
    font-size: 14px;
  }
`

export const LinkBack = styled(Link)`
  text-decoration: none;
  border: none;
  background-color: unset;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px;
  margin-top: 10px;
  color: #FF612E;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    color: ${ ({ theme }) => theme.colors.text};
    transition: all 0.2s ease;

  }
  &:focus {
    text-decoration: underline;
  }

  @media screen and (min-width: 766px){
    font-size: 14px;
    padding: 8px;
  }
`
