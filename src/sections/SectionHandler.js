import React, { useEffect, useCallback, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
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
import classNames from 'classnames'

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

  // check device
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const smallDevice = useMediaQuery({ query: '(max-width: 420px)' })

  // local state
  const [activeSection, setActiveSection] = useState(1)
  const [emojiVisible, setEmojiVisible] = useState(false)
  const store = useStore()
  const [asideHeight, setAsideHeight] = useState(window.innerHeight - 203)

  // callbacks
  const resizeHandler = useCallback((e) => {
    const asideValue = window.innerHeight
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
    setEmojiVisible(false)
    const currentChat = chatSection.list.find(item => item._id === activeRoom)
    if (currentMsg === '') {
      return open('Message field is required!')
    }
    if (currentChat) {
      const { chat_guest, chat_owner } = currentChat
      const cipherMsg = CryptoJS.AES.encrypt(JSON.stringify(currentMsg), process.env.REACT_APP_CRYPTO_KEY, { mode: CryptoJS.mode.ECB }).toString()
      socket.emit('send_message', {
        from: user._id,
        to: chat_owner._id === user._id ? chat_guest._id : chat_owner._id,
        text: cipherMsg
      })
      dispatch({ type: 'SET_MAIN_STATE', payload: { chatSection: { ...chatSection, currentMsg: '' } } })
    }
  }

  const handleKeyPress = ({ key }) => {
    if (key === 'Enter') {
      handleSendMsg()
    }
  }

  const onEmojiClick = (_, { emoji }) => {
    dispatch({
      type: 'SET_MAIN_STATE',
      payload: {
        chatSection: {
          ...chatSection,
          currentMsg: `${currentMsg}${emoji}`
        }
      }
    })
  }

  const handleDeleteMsg = (msgId) => {
    let { list } = Object.assign({}, chatSection)
    const chatIdx = list.findIndex(c => {
      return c._id === activeRoom
    })
    list[chatIdx].messages = list[chatIdx].messages.filter(m => m._id !== msgId)
    socket.emit('delete_message', msgId)
    dispatch({
      type: 'SET_MAIN_STATE',
      payload: {
        chatSection: {
          ...chatSection,
          list
        }
      }
    })
  }

  const room = activeRoom && chatSection.list.find(c => {
    return c._id === activeRoom
  })
  const sortedMsgs = sortBy(room?.messages, m => m.created_at)
  const msgSections = groupBy(sortedMsgs || [], msg => moment(msg.created_at).format('LL'))

  const dialogContainer = (
    <Col as='main' md={8}>
      <section className="section-switcher mt-2 mb-2 d-flex">
        <button className="btn mr-2">Chat</button>
        <button className="btn" disabled>Media</button>
      </section>
      <div className="d-flex flex-column justify-content-end" style={{ height: `${asideHeight + (isTabletOrMobile ? 40 : 120)}px` }}>
        <section className="messages d-flex flex-column" style={{ padding: isTabletOrMobile ? 0 : 'initial' }}>
          <ScrollableFeed
            forceScroll
            className="scrollable-feed">
            {msgSections && user && (
              <>
                {Object.keys(msgSections).map(date => {
                  return <MessageSection key={date} date={date}>
                    {msgSections[date].map(msg => (
                      <MessageItem key={msg._id} {...msg} authorId={user._id} handleDeleteMsg={handleDeleteMsg} />
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
            <button onClick={() => setEmojiVisible(prevState => !prevState)} className="btn toolbar-items--audio">
              <i className="far fa-smile fa-lg"></i>
            </button>
            {emojiVisible && <Picker
              pickerStyle={{
                position: 'absolute',
                bottom: '100%'
              }}
              onEmojiClick={onEmojiClick}
              disableAutoFocus
              skinTone={SKIN_TONE_MEDIUM_DARK}
              groupNames={{ smileys_people: 'PEOPLE' }}
              native
            />}
          </div>
          <input
            type="text"
            onKeyPress={handleKeyPress}
            onChange={handleMsgChange}
            onFocus={() => setEmojiVisible(false)}
            value={currentMsg} className="w-100" placeholder="Type a new message" />
          <Button
            className="toolbar--send-btn"
            disabled={!!!(user && (activeRoom !== null))}
            onClick={handleSendMsg}
          >
            {!smallDevice && 'Send'}
            <i className="fas fa-paper-plane fa-lg"></i>
          </Button>
        </section>
      </div>
    </Col>
  )

  const asideMenu = (
    <Menu
      setActiveSection={setActiveSection}
      activeSection={activeSection} />
  )

  return (
    <Container fluid>
      <Row style={{ margin: isTabletOrMobile ? 0 : 'initial' }}>
        <Col as='aside' md={4} className={classNames({ 'pr-0 pl-0': isTabletOrMobile })}>
          <div className='d-flex flex-column'>
            <ProfilePanel {...user} />
            {activeRoom && isTabletOrMobile
              ? dialogContainer : (
                <div className='chat-list d-flex flex-column' style={{ maxHeight: `${asideHeight + (isTabletOrMobile ? 30 : 0)}px` }}>
                  {user
                    ? <SectionComponent setActiveSection={setActiveSection} asideHeight={asideHeight} />
                    : 'Please, login to account...'}
                </div>
              )}
            {!activeRoom && isTabletOrMobile && asideMenu}
            {!isTabletOrMobile && asideMenu}
          </div>
        </Col>
        {!isTabletOrMobile && dialogContainer}
      </Row>
    </Container>
  )
}

export default SectionHandler