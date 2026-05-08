import styled from 'styled-components';

export const Container = styled.div`
  display:flex;
  flex-direction: column;
  margin:0 auto;
  align-items: center;
  height:100%;
  min-height:calc(100vh - 95px);
  max-width: 420px;
  margin-top: -25px;
  padding-top:25px;
  background-color: #fff;
  position: relative;
  > p {
    text-align: left;
    display:block;
    width: 100%;
    padding-left:15px;
    color: #8A8A8A;
    font-weight: bold;
    font-size: 15px;
  }

  @media screen and (min-width: 766px){
    max-width: 500px;

    > p {
      padding-left: 20px;
      font-size: 17px;
    }
  }
`;

export const Content = styled.main`
  display:block;
  height:calc(100vh - 150px - 95px);
  overflow-y:auto;
  padding:15px 15px 30px;
  margin-top:5px;
  margin-bottom:30px;
  p{
    text-align: justify;
    margin: 0 0 15px 0;
    font-size: 14px;
    color: #8A8A8A;
  }

  @media screen and (min-width: 766px){
    padding: 15px 20px 30px;
    p {
      font-size: 16px;
    }
  }
`


export const Footer = styled.footer`

  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  padding: 16px;
  padding-top:32px;

  position:absolute;
  bottom:0;
  width: 100%;

  background-image: linear-gradient(180deg, transparent,#fff,#fff, #fff);
`

export const ButtonReject = styled.button`

  border: 0px;
  background: unset;
  color: #E27272;
  font-size: 16px;
  font-weight: bold;
  padding:4px 6px;
  &:hover{
    cursor: pointer;
  }
`
