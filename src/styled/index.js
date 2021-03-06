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