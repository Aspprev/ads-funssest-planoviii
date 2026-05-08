import styled from 'styled-components';

export const Container = styled.div`
  display:flex;
  flex-direction: column;
  margin:0 auto;
  align-items: center;
  height:100%;
  max-width: 420px;
  margin-top:-25px;
  padding-top:25px;

  @media screen and (min-width: 766px){
    max-width: 500px;
  }

  h2 {
    text-align: start;
    margin-top: 20px;
    margin-bottom: 20px;
    color: #FF612E;
  }
  strong {
    text-align: start;
    margin-bottom: 10px;
  }
  span {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const BtnVoltar = styled.button`
  border: none;
  background-color: unset;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  border-bottom: 1px solid transparent;
  padding: 0px 3px 2px;
  color: ${({ theme }) => theme.colors.text};

  &:hover {

    border-bottom: 1px solid ${({ theme }) => theme.colors.text};

  }
`
