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

  @media screen and (min-width:766px){
    max-width: 500px;
  }

`;


export const Content = styled.main`

  position:relative;
  display: flex;
  width: 90vw;
  background:#FFF;
  box-shadow: 0px 12px 14px rgba(209,212,226,0.4);
  border-radius: 4px;
  padding: 15px;
  margin-bottom:50px;
  flex-direction: column;
  align-items: center;

  form {
    width: 100%;

  }

  > div{
    height: 25px;
    margin-top: 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    > span{
      flex: 1;
      font-size: 12px;
      margin-right: 15px;
    }
  }

  @media screen and (min-width: 766px){
    width: 70vw;

    max-width: 500px;


  }

`
export const BtnVoltar = styled.button`
  border: none;
  background-color: unset;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid transparent;
  padding: 0px 3px 2px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {

    border-bottom: 1px solid ${({ theme }) => theme.colors.text};

  }
`