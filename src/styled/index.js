import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'
import styled from 'styled-components'

export const SpinnerOverlay = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ bgColor }) => bgColor || 'transparent'} !important;
  height: ${({ height }) => `${height}px !important`}
`

export const StyledSearchInput = styled(FormControl)`
  z-index: 1;
  margin-bottom: 25px !important;
`

export const StyledSection = styled.div`
  position: relative;
  & * {
    height: auto;
  }
  & .chat-list {
    &--item {
      max-height: 100%;
      margin-bottom: 25px;
    }
    &--info {
      max-height: 100%;
    }
  }
`

export const StyledLogin = styled(Modal)`
  & * {
    height: auto;
    font-size: 14px;
  }
`

export const StyledSearchItem = styled.div`
  * {
    font-size: 12px;
  }
  & img {
    width: 44px;
    height: 44px;
    border-radius: 100%;
    margin-right: 20px;
  }
  &.offline {
    & img {
      border: 2px solid gray;
    }
  }
  &.online {
    & img {
      border: 2px solid #46d362;;
    }
  }
  &.busy {
    & img {
      border: 2px solid #fd2828;;
    }
  }
  &.away {
    & img {
      border: 2px solid #f3ba4a;
    }
  }
  & .info-block {
    min-width: 220px;
  }
`

export const StyledEditor = styled(Modal)`
  & * {
    height: auto;
    font-size: 14px;
  }
  & img {
    display: block;
    margin: 15px auto;
    border: 1px solid;
  }
  & .modal-dialog {
    position: relative;
  }
`