import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom'
import '@toast-ui/editor/dist/toastui-editor.css';

const Test = () => {
    return <>
            <Editor
                placeholder="내용을 입력해주세요."
                previewStyle="tab" // 미리보기 스타일 지정
                height="300px" // 에디터 창 높이
                initialEditType="wysiwyg" // 초기 입력모드 설정(디폴트 markdown)
                toolbarItems={[
                  // 툴바 옵션 설정
                  ['heading', 'bold', 'italic', 'strike'],
                  ['hr', 'quote'],
                  ['ul', 'ol', 'task', 'indent', 'outdent'],
                  ['table', 'image', 'link'],
                  ['code', 'codeblock']
                ]}>
            </Editor>
    </>
}

ReactDOM.render(<Test/>, document.querySelector('#main'));

