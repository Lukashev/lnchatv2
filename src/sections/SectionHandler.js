import React, { useEffect, useCallback, useState } from 'react'
import CryptoJS from 'crypto-js'
import ScrollableFeed from 'react-scrollable-feed'
import { Col, Container, Row } from 'react-bootstrap'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import cookies from 'react-cookies'
import { useSnackbar } from 'react-simple-snackbar'
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'
import sections from '../sections'
import ProfilePanel from '../components/ProfilePanel'
import Menu from '../components/Menu'
import SocketListener from '../stateful'
import { useDispatch, useSelector, useStore } from 'react-redux'
import MessageItem from '../components/MessageItem'
import MessageSection from '../components/MessageSection'

const snackOptions = {
  position: 'bottom-left',
  style: {
    zIndex: 9999,
    height: 'auto'
  }
}

const SectionHandler = () => {
  // store
  const { user, activeRoom, authToken, socket, chatSection, api } = useSelector(state => state)
  const dispatch = useDispatch()
  const [open] = useSnackbar(snackOptions)
  const { currentMsg } = chatSection

  // local state
  const [activeSection, setActiveSection] = useState(1)
  const store = useStore()
  const [asideHeight, setAsideHeight] = useState(document.body.scrollHeight - 203)

  // callbacks
  const resizeHandler = useCallback((e) => {
    const asideValue = document.body.scrollHeight
    if (asideValue !== asideHeight) {
      setAsideHeight(asideValue - 203)
    }
  }, []) // eslint-disable-line

  const handleMsgChange = ({ target: { value } }) => {
    dispatch({ type: 'SET_MAIN_STATE', payload: { chatSection: { ...chatSection, currentMsg: value } } })
  }

  // useEffects
  useEffect(() => {
    window.addEventListener('resize', resizeHandler)

    const getUser = async () => {
      try {
        const { data } = await api.getUser()
        dispatch({
          type: 'SET_MAIN_STATE',
          payload: {
            user: data.result
          }
        })
      } catch ({ response }) {
        if (response?.status === 401) {
          dispatch({
            type: 'SET_MAIN_STATE',
            payload: { user: null, authToken: null }
          })
          cookies.remove('Authorization')
        }
        open(response?.data?.message, 2000)
      }
    }
    getUser()

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, []) // eslint-disable-line


  useEffect(() => {
    if (authToken && user) {
      const $token = authToken.split(' ')[1]
      if (!socket) {
        const socketInstance = io('/', {
          query: `auth_token=${$token}`
        })
        dispatch({ type: 'SET_MAIN_STATE', payload: { socket: socketInstance } })
        new SocketListener(socketInstance, store, open)
        return
      }
      socket?.connect({ query: `auth_token=${$token}` })
    }
  }, [authToken, user]) // eslint-disable-line

  const SectionComponent = sections[activeSection]

  const handleSendMsg = () => {
    const currentChat = chatSection.list.find(item => item._id === activeRoom)
    if (currentChat) {
      const { chat_guest, chat_owner } = currentChat
      const cipherMsg = CryptoJS.AES.encrypt(currentMsg, process.env.REACT_APP_CRYPTO_KEY, { mode: CryptoJS.mode.ECB }).toString()
      socket.emit('send_message', {
        from: user._id,
        to: chat_owner._id === user._id ? chat_guest._id : chat_owner._id,
        text: cipherMsg
      })
      dispatch({ type: 'SET_MAIN_STATE', payload: { chatSection: { ...chatSection, currentMsg: '' } } })
    }
  }

  const room = activeRoom && chatSection.list.find(c => {
    return c._id === activeRoom
  })
  const sortedMsgs = sortBy(room?.messages, m => m.created_at)
  const msgSections = groupBy(sortedMsgs || [], msg => moment(msg.created_at).format('LL'))

  return (
    <Container fluid>
      <Row>
        <Col as='aside' md={4}>
          <div className='d-flex flex-column'>
            <ProfilePanel {...user} />
            <div className='chat-list d-flex flex-column' style={{ maxHeight: `${asideHeight}px` }}>
              {user
                ? <SectionComponent setActiveSection={setActiveSection} asideHeight={asideHeight} />
                : 'Please, login to account...'}
            </div>
            <Menu
              setActiveSection={setActiveSection}
              activeSection={activeSection} />
          </div>
        </Col>
        <Col as='main' md={8}>
          <section className="section-switcher mt-2 d-flex">
            <button className="btn mr-2">Chat</button>
            <button className="btn" disabled>Media</button>
          </section>
          <div className="d-flex flex-column justify-content-end" style={{ height: `${asideHeight + 120}px` }}>
            <section className="messages d-flex flex-column">
              <ScrollableFeed
              forceScroll
              className="scrollable-feed">
                {msgSections && user && (
                  <>
                    {Object.keys(msgSections).map(date => {
                      return <MessageSection key={date} date={date}>
                        {msgSections[date].map(msg => (
                          <MessageItem key={msg._id} {...msg} authorId={user._id} />
                        ))}
                      </MessageSection>
                    })}
                  </>
                )}
              </ScrollableFeed>
            </section>
            <section className="toolbar d-flex">
              <div className="toolbar-items d-flex">
                <button className="btn toolbar-items--attach" disabled>
                  <i className="fas fa-paperclip fa-lg"></i>
                </button>
                <button className="btn toolbar-items--audio" disabled>
                  <i className="fas fa-microphone fa-lg"></i>
                </button>
              </div>
              <input type="text" onChange={handleMsgChange} value={currentMsg} className="w-100" placeholder="Type a new message" />
              <Button
                className="toolbar--send-btn"
                disabled={!!!(user && (activeRoom !== null))}
                onClick={handleSendMsg}
              >
                Send
                <i className="fas fa-paper-plane fa-lg"></i>
              </Button>
            </section>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default SectionHandler