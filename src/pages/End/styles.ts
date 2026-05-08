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
    color: #FF612E;
    font-size: 16px;
    text-align: center;
    margin-bottom: 12px;
  }

  img {
    height:185px;
    width: auto;
    margin: 30px 0px;
  }

  p {
    width: 80%;
    font-size: 14px;
    text-align: center;
    line-height:18px;
    padding-bottom: 20px;
    > a {
      color: #333333;
      display: flex;
      align-items: center;
      position: relative;

      &:focus, &:hover{
        color: #FF612E;
      }
    }
  }


  div {
    display: flex;
    flex-direction: column;
    align-items: center;

    > a {
      color: #333333;
      text-decoration: none;
      display: flex;
      align-items: center;
      position: relative;

      &:focus, &:hover{
        text-decoration: underline;
      }
    }
 }

  @media screen and (max-width: 766px) {
    strong {
      font-size: 18px;
    }
    > img {
      height: 200px;
    }
    > p {
      width: 90%;
      font-size: 17px;
      line-height:19px;
    }
  }
`

export const Line = styled.div`
  width: 65%;
  height: 1px;
  margin: 20px 15px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`
