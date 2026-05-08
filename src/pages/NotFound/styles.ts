import styled from 'styled-components';

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
  min-height: 400px;
  padding: 30px 25px;
  margin: 0 5px;

  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
  }

  h3 {
    width: 80%;
    font-size: 20px;
    text-align: center;
    margin: 18px auto;
  }

  @media screen and (max-width: 766px) {
    h1 {
      font-size: 48px;
    }

    h3 {
      font-size: 16px;
    }
  }
`
