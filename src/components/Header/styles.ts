import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;

  position: relative;
  top: 0;
  padding: 0 100px;

  height: 90px;
  margin-bottom: 35px;

  background-color: #FFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);
  transform: scale(1) ;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: relative;

    width: 100%;
    margin: 0 auto;
    max-width: 500px;

    > div {
      position: absolute;
      left: 30px;
    }
  }

  @media screen and (max-width: 766px) {
    height: 70px;
    margin-bottom: 20px;

    > div {
      transform: scale(0.9)
    }
  }
`
