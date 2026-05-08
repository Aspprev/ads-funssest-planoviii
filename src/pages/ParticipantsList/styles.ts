import styled from 'styled-components';

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

export const Content = styled.div`
  width: 100%;
  margin: 0 5px;

  h3 {
    text-align: center;
    font-size: 18px;
    color: #FF612E;

    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  > strong {
    font-size: 18px;
    font-weight: bold;
    color: #FF612E;
    margin-left: 15px;
    text-align: center;
  }
`

export const ContentBenef = styled.div`
  width: 100%;
  svg {
    z-index: 1;
  }
`

export const InfoBox = styled.div`
  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  position: relative;
  width: 100%;
  margin: 10px 0 10px;
  padding: 15px 25px 10px;

  > div {
    margin: 6px 0;
  }

  > svg {
    position: absolute;
    width: 20px;
    height: 20px;

    top: 10px;
    right: 10px;
    cursor: pointer;
    color: ${props => props.theme.colors.error};
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px 10px;
  }
`

export const BenefBox = styled.div`
  background: #FFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(61, 69, 67, 0.05);

  position: relative;
  width: 100%;
  margin: 10px 0 10px;
  padding: 15px 25px 10px;

  > strong {
    font-size: 18px;
    font-weight: bold;
    color: #FF612E;
    margin-left: 15px;
    text-align: center;
  }

  p {
    text-align: center;
    font-size: 14px;

    > span {
     color: #FF612E;
     font-size: 14px;
     text-decoration: underline;
     cursor: pointer;
    }
  }

  div {
    position: relative;
    margin: 6px 0;
  }

  svg {
    position: absolute;
    width: 20px;
    height: 20px;

    top: 0;
    right: 5px;
    cursor: pointer;
    color: ${props => props.theme.colors.error};
  }

  @media screen and (max-width: 766px) {
    padding: 20px 15px 10px;
  }
`

export const Line = styled.main`
  width: 65%;
  height: 1px;
  margin: 25px auto 20px;
  background-color: ${props => props.theme.colors.backgroundTertiary};
`
