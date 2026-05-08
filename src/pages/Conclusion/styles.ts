import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  max-width: 600px;
  margin: 0 auto;
  padding: 0 5px;

  > strong {
    font-size: 18px;
    font-weight: bold;
    color: #FF612E;
    margin-bottom: 15px;
    text-align: center;
  }

  @media screen and (max-width: 766px) {
    max-width: 500px;
  }
`

// export const Content = styled.main`
//   background: #FFF;
//   border-radius: 8px;
//   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

//   width: 100%;
//   padding: 30px 25px;
//   margin: 0 5px;

//   strong {
//     display: flex;
//     text-align: center;
//     align-self: center;
//     justify-content: center;
//     color: #FF612E;
//     font-size: 18px;
//     font-weight: bold;
//     padding-bottom: 15px;
//   }

//   @media screen and (max-width: 766px) {
//     padding: 20px 15px;
//   }
// `

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  width: 100%;
  padding: 15px 0;
  margin: 0 5px;

  span {
    text-align: center;
    font-size: 16px;
    color: #333333;
    margin-top: 10px;
    padding: 0 24px;
    // width: 350px;
  }
  strong {
    text-align: center;
    align-self: center;
    color: #FF612E;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  form {
    margin: 25px 0;
  }

  p {
    font-size: 14px;
    text-align: center;
    width: 90%;
    line-height: 22px;

    > strong {
      font-size: 14px;;
    }
  }
`

export const Participants = styled.div`
  // border-bottom: 1px solid #EEE;

  h3 {
    font-size: 18px;
    color: ${props => props.theme.colors.text}
  }

  span {
    font-size: 14px;
    font-weight: bold;
    color: #FF612E;
  }

  small {
    font-size: 12px;
    color: #666360;
  }

  .titular,
  .dependents {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 4px 5px;
    margin-bottom: 10px;
  }

  .infos {
  }

  .planos {
    display: flex;
    flex-direction: column;
    text-align: right;
  }
`

export const Confirmation = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 20px 0 40px 0;

  strong {
    text-align: center;
    align-self: center;
    color: #FF612E;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  p {
    font-size: 14px;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;

    padding-top: 20px;
  }

  span {
    font-weight: bold;
    font-size: 14px;
    margin-right: 15px;
  }
`

export const BtnVoltar = styled.button`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  border: none;
  background-color: unset;
  border-bottom: 1px solid transparent;
  color: ${({ theme }) => theme.colors.text};

  margin: 16px;

  &:hover {
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }

  &:focus {
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }
`
export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  > div {
    display: flex;
    justify-content: space-between;

    width: 100%;
    margin-top: 3px;
    margin-bottom: 8px;

    strong {
      font-size: 16px;
      color: ${props => props.theme.colors.mainColor};
      font-weight: bolder;
    }

    small {
      font-size: 12px;
      display: flex;
      font-weight: bold;
    }
  }

  span {
    font-size: 11px;
    color: ${props => props.theme.colors.placeholder};
    font-style: italic;
    margin-top: 15px;
  }

  @media screen and (max-width: 600px) {
    p {
      text-align: left;
    }

    > div {
      margin-top: 8px;

      small {
        text-align: left;
      }
    }
  }
`
export const Line = styled.div`
  width: 80%;
  height: 1px;
  margin: 15px auto 20px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`

export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  padding: 8px;
  background: ${props => props.theme.colors};
  color: ${props => props.theme.colors.error};
  border-radius: 4px;
  position: relative;
  max-width: 250px;
  font-weight: bold;
  margin-bottom: 12px;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 200px;
    margin-bottom: 5px;
  }

  svg {
    position: absolute;
    font-size: 20px;
  }

  button {
    border: none;
    background-color: transparent;
    font-size: 12px;
    color: #333;
  }
`

export const Timer = styled.span`
  font-size: 12px;
  color: #FF612E;
  margin: 12px 0;

  @media screen and (min-width: 766px){
    font-size: 14px;
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
