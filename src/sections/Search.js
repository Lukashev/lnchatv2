import React, { useContext, useState, useEffect } from 'react'
import debounce from 'lodash/debounce'
import { Spinner } from 'react-bootstrap'
import { useSnackbar } from 'react-simple-snackbar'
import { SpinnerOverlay, StyledSection } from '../styled'
import SearchInput from '../components/SearchInput'
import { AppContext } from '../store'
import SearchItem from '../components/SearchItem'

const snackOptions = {
  position: 'bottom-left',
  style: {
    zIndex: 9999,
    height: 'auto'
  }
}

const Search = ({ asideHeight, setActiveSection }) => {
  const [loading, setLoading] = useState(false)
  const [open] = useSnackbar(snackOptions)
  const { api, dispatch, state: { searchSection, chatSection, user, activeRoom }} = useContext(AppContext)

  useEffect(() => {
    const fn = async () => {
      try {
        setLoading(true)
        const { data } = await api.searchUsers(null, searchSection.value)
        dispatch({
          payload: {
            searchSection: {
              ...searchSection,
              list: data.result
            }
          }
        })
      } catch(e) {
        open(String(e), 2000)
      } finally {
        setLoading(false)
      }
    }
    fn()
  }, [searchSection.value]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchValue = async (value) => {
    dispatch({
      payload: {
        searchSection: {
          ...searchSection,
          value
        }
      }
    })
  }

  const handleStartChat = (guest) => {
    const newChat = {
      chat_guest: guest,
      chat_owner: user,
      messages: []
    }
    dispatch({
      payload: {
        chatSection: {
          ...chatSection,
          list: [
            ...chatSection.list,
            newChat
          ]
        }
      }
    })
    setActiveSection(1)
  }

  const isDisabled = true

  return (
    <StyledSection>
      <SearchInput handleChange={debounce(handleSearchValue, 1000)} />
      {searchSection.list.map(item => {
        return (
          <SearchItem 
          {...item} 
          key={item._id} 
          disabled={isDisabled}
          handleChatStart={handleStartChat} 
          />
        )
      })}
      {loading && <SpinnerOverlay height={asideHeight}>
        <Spinner animation='border' role='status' />
      </SpinnerOverlay>}
    </StyledSection>
  )
}

export default Search