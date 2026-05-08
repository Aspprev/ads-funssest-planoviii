import styled from 'styled-components';

export const Container = styled.div`
  display:flex;
  flex-direction: column;
  margin:0 auto;
  align-items: center;
  height:100%;
  min-height:100vh;
  max-width: 420px;
  margin-top:-25px;
  padding-top:25px;

  @media screen and (min-width: 766px){
    max-width: 500px;
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
`;
