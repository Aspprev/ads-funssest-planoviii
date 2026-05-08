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
  display: flex;
  flex-direction: column;
  align-items: center;

  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  width: 100%;
  padding: 30px 25px;
  margin-bottom: 10px;
  text-align: center;

  > strong {
    text-align: center;
    font-size: 18px;
    color: #FF612E;

    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  span {
    margin-bottom: 15px;
  }

  small {
    margin-top: 15px;
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px;
  }
`

interface BtnModalProps {
  isActive: boolean;
}
export const BtnModal = styled.button<BtnModalProps>`
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  padding: 3px;
  background: ${props => props.isActive ? 'linear-gradient(15deg, #FF612E, #FF8F61)' : 'transparent'} ;
  border: ${props => props.isActive ? 'none' : 'solid 1px #FF612E'};
  color: ${props => props.isActive? '#fff' : props.theme.colors.placeholder} ;
  border-radius: 4px;
  margin: 20px 20px 0 0;
  &:focus {
    text-decoration: underline;
  }
`
