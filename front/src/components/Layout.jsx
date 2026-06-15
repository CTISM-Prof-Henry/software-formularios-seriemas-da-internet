import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Aside from "./Aside.jsx";
import '../style/Main.css'

function Layout () {

    return (
        <div className="layout-container">
            <Header />

            <div className="menu">
                <Aside />

                <Outlet />
            </div>
        </div>
    )
}


export default Layout