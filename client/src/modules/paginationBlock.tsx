import { useEffect } from 'react'
import './scss/paginationBlock.scss'

export const PaginationBlock = (props: {page: number, setPage: any, pageCount: number}) => {
    useEffect(() => {
    }, [])
    return <div className="paginationBlock">
    {
        isNaN(props.pageCount) ? null : 
        new Array(props.pageCount - 1).fill(0).map((v, i) => {
            return <div className={(props.page === i + 1) ? "pageButtonChecked" : "pageButton"} id = {i + 1 + ''} onClick={() => props.setPage(i + 1)} key={i}>
            {i + 1}</div>
        })
    }
    </div>
}