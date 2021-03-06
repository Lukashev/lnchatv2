import React from 'react'
import { func, string } from 'prop-types'
import { InputGroup } from 'react-bootstrap'
import { StyledSearchInput } from '../styled'

const SearchInput = ({ handleChange, placeholder }) => {
  const onChange = (e) => {
    handleChange(e.target.value)
  }
  return (
    <InputGroup className='w-100'>
      <StyledSearchInput
        placeholder={placeholder}
        aria-label='Default'
        aria-describedby='inputGroup-sizing-default'
        onChange={onChange}
      />
    </InputGroup>
  )
}

SearchInput.propTypes = {
  handleChange: func.isRequired,
  placeholder: string
}

SearchInput.defaultProps = {
  handleChange: () => { },
  placeholder: 'Search profile...'
}

export default SearchInput
