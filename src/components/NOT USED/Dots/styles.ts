import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
`;

interface DotProps {
  active: boolean;
}
export const Dot = styled.div<DotProps>`
  margin: 0px 8px;
  height:8px;
  width: 8px;
  display: block;
  transform: rotate(45deg);
  background: ${props => props.theme.colors.mainColor};
  opacity: ${props => props.active ? 1 : 0.5};

  transition: opacity 2s ease-in-out;

  @media screen and (min-width:766px){
    margin: 0px 10px;
    height:10px;
    width: 10px;
  }

`
