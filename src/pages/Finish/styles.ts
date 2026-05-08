import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  max-width: 600px;
  margin: 35px auto;
  padding: 0 5px;

  @media screen and (max-width: 766px) {
    max-width: 500px;
  }
`

export const Content = styled.div`
  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  width: 100%;
  padding: 30px 25px;
  margin: 0 5px;

  display:flex;
  flex-direction: column;
  align-items: center;

  strong {
    color: ${props => props.theme.colors.mainColor};
    font-size: 16px;
    text-align: center;
    margin-bottom: 12px;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;

    div {
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  p {
    width: 80%;
    font-size: 14px;
    text-align: center;
    padding: 8px 0;
  }

  span {
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.colors.mainColor};

    a {
      color: ${props => props.theme.colors.mainColor};
      text-decoration: underline;
    }
  }

  @media screen and (max-width: 766px) {
    strong {
      font-size: 16px;
    }
  }
`

export const Line = styled.div`
  width: 65%;
  height: 1px;
  margin: 30px auto 15px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`
