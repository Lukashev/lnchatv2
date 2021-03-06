import React, { useState } from 'react'
import debounce from 'lodash/debounce'
import { Spinner } from 'react-bootstrap'
import { SpinnerOverlay, StyledSection } from '../styled'
import SearchInput from '../components/SearchInput'

const Search = ({ asideHeight }) => {
  const [loading] = useState(false)
  const handleSearchValue = () => {

  }

  return (
    <StyledSection>
      <SearchInput handleChange={debounce(handleSearchValue, 1000)} />
      {loading && <SpinnerOverlay height={asideHeight}>
        <Spinner animation='border' role='status' />
      </SpinnerOverlay>}
    </StyledSection>
  )
}

export default Search