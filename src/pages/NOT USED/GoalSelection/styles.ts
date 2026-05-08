import styled, { css } from 'styled-components';

export const Container = styled.div`

  display:flex;
  flex-direction: column;
  margin:0 auto;
  margin-top:-25px;
  padding-top:25px;
  align-items: center;

  max-width: 550px;
`;


export const Content = styled.div`
  position:relative;
  display: flex;
  width: 95vw;
  background:#FFF;
  box-shadow: 0px 12px 14px rgba(209,212,226,0.4);
  border-radius: 4px;
  padding: 15px;
  margin-bottom:50px;
  flex-direction: column;
  align-items: center;

  >p{
    font-weight: bold;
    font-size: 10px;
    text-align: center;
  }

  > footer {
    p {
      font-size: 12px;
      text-align: center;

      & + p {
        margin-top: 5px;
      }
    }

  }

  @media screen and (min-width: 766px){
    width: 70vw;
    padding: 18px;

    max-width: 550px;

    > p{
      font-size: 12px;

    }

    > footer {
      p {
        font-size: 14px;
        & + p {
          margin-top: 7px;
        }
      }

    }
  }

  @media screen and (min-width: 990px) {
    width: 45vw;
  }
`;

export const Main = styled.main`
  margin: 25px 0px 30px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 8px;

  @media screen and (min-width:766px){
    margin: 30px 0px 35px;
    grid-gap: 12px;
  }
`

interface GoalItemProps {
  isSelected: boolean
}

export const GoalItem = styled.button<GoalItemProps>`
  border-radius: 4px;
  border: unset;
  width:100px;

  ${props => props.isSelected ? css`
    padding: 2px;
    background-image: linear-gradient(${-60 + Math.floor((120) * Math.random())}deg,#FDA10D,#ffc456);
  ` : css`padding: 2px;`
  }

  > div {
    background:#fff;
    width: 96px;
    display: flex;
    padding: 4px;
    align-items: center;
    flex-direction: column;
    border-radius: 4px;
    height: 66px;
    justify-content: space-between;
    img {
      height: 25px;
      max-width:35px;

    }

    span {
      text-align: center;
      font-size: 12px;
      color: #656565;
      height: 30px;
      display: inline-block;
    }
  }
`

export const Arrow = styled.div`
  background:#FFF;
  box-shadow: 0px 12px 14px rgba(209, 212, 226, 0.4);
  height: 12px;
  width: 12px;
  position: absolute;
  top: -6px;
  left: 70px;
  transform: rotate(45deg);
  z-index: -1;

  @media screen and (min-width: 766px){
    height: 14px;
    width: 14px;
    top: -7px;
  }

  @media screen and (min-width: 990px){
    height: 16px;
    width: 16px;
    top: -8px;
  }
`;
