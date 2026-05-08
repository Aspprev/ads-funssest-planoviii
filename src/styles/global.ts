import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #F7F8FE;
    background-image: linear-gradient(180deg, #CDDFF3 0%, #F7F8FE 40%);
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;

    -webkit-font-smoothing: antialiased;
    color: ${props => props.theme.colors.text};
  }

  body, input, button, textarea {
    font-family: 'Verdana', 'Roboto', sans-serif;
    font-size: 14px;
  }

  button {
    cursor: pointer;
    color: ${props => props.theme.colors.text};
  }

  .react-modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;

    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    z-index: 2;
    background: rgba(0, 0, 0, .55);
  }

  .react-modal-content {
    position: relative;
    padding: 35px 24px;
    width: 500px;

    background: #F4F6F5;
    border-radius: 4px;

    > svg {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 20px;
      height: 20px;
      color: ${props => props.theme.colors.error};
      cursor: pointer;
    }

    > h3 {
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      padding-bottom: 20px;
      color: ${props => props.theme.colors.mainColor};
    }

    div {
      strong {
        display: block;
        font-size: 14px;
        margin-bottom: 5px;
      }

      ul {
        margin: 10px 25px 15px;
        font-size: 13px;

        li {
          margin-bottom: 5px;
          list-style: circle;
        }
      }
    }

    @media screen and (max-width: 766px) {
      width: 400px;
    }
  }
`
