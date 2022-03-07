import './scss/header.unlogined.scss'
import React from 'react'

export const Header = React.memo(() => {
    return <>
        <header>
            <h1 onClick={e => location.href = '/'}>The Reader</h1>
        </header>
    </>
})
