import './scss/logo.scss';
export const Logo = () => {
    return <div className="logo">
        <div className="logoBlock" onClick={e => location.href='/'}>
            The Reader
        </div>
    </div>
}