import styled from 'styled-components'

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

    small {
      margin-right: 12px;
      font-weight: bold;
    }

    a {
      text-decoration: none;
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

export const Line = styled.div`
  width: 65%;
  height: 1px;
  margin: 30px auto 15px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`
