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
  margin-bottom: 10px;

  > strong {
    text-align: center;
    font-size: 18px;
    color: #FF612E;

    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  form {
    width: 100%;
  }

  > p {
    text-align: center;
    margin-bottom: 15px;
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px;
  }
`

export const Line = styled.div`
  width: 65%;
  height: 1px;
  margin: 30px auto 15px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    margin: 12px 0 0;

    strong {
      font-size: 16px;
      color: ${props => props.theme.colors.mainColor}
    }

    small {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 600px) {
    > div {
      p {
        width: 70%;
      }
    }
  }
`
