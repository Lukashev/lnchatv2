import React, { useContext } from 'react'
import { number, func, arrayOf, shape, string } from 'prop-types'
import classnames from 'classnames'
import { AppContext } from '../store'

const Menu = ({ activeSection, setActiveSection, menuItems }) => {
  const { dispatch } = useContext(AppContext)

  const handleClick = id => () => {
    dispatch({ payload: { activeRoom: null } })
    setActiveSection(id)
  }

  return (
    <nav className='aside-menu d-flex justify-content-around'>
      {menuItems.map(({ id, slug }) => (
        <i
          key={id}
          className={classnames('fas', slug, 'fa-2x', 'aside-menu--item')}
          style={{ color: activeSection === id ? '#6588de' : 'initial' }}
          onClick={handleClick(id)}
        />
      ))}
    </nav>
  )
}

Menu.propTypes = {
  activeSection: number.isRequired,
  setActiveSection: func.isRequired,
  menuItems: arrayOf(
    shape({
      id: number.isRequired,
      slug: string.isRequired
    })
  )
}

Menu.defaultProps = {
  menuItems: [
    {
      id: 1,
      slug: 'fa-user'
    },
    {
      id: 2,
      slug: 'fa-search'
    }
  ]
}

export default Menu