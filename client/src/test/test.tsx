import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom'

const Test = () => {
    const onSubmitForm = e => {
        e.preventDefault();
        const file = document.querySelector('#file')?.files[0];
        const fd = new FormData();
        fd.append('photo', file);
        console.log(fd);
    axios.post('/user/profile/image', fd).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
    }

    return <>
        <form onSubmit={e => onSubmitForm(e)}>
            <input type="file" id="file" accept="image/*" />
            <input type="submit" value="전송"/>
        </form>
    </>
}

ReactDOM.render(<Test/>, document.querySelector('#main'));

