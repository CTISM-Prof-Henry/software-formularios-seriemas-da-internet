import React from 'react';
import {NavLink} from 'react-router-dom';
import '../style/components/Aside.css';
import {
    FiGrid,
    FiTarget,
    FiList,
    FiPlusCircle,
    FiDownload
} from "react-icons/fi";
import {MdOutlineSpaceDashboard} from "react-icons/md";

function Sidebar() {
    return (
        <aside className="sidebar-container">

            <div className="sidebar-top">
                <NavLink to="/painel" className="nav-item">
                    <MdOutlineSpaceDashboard className="nav-icon"/>
                    <span>Painel</span>
                </NavLink>

                <NavLink to="/desafios" className="nav-item">
                    <FiTarget className="nav-icon"/>
                    <span>Desafios estratégicos</span>
                </NavLink>

                <NavLink to="/todos-riscos" className="nav-item">
                    <FiList className="nav-icon"/>
                    <span>Todos os riscos</span>
                </NavLink>

                <NavLink to="/registrar-risco" className="nav-item">
                    <FiPlusCircle className="nav-icon"/>
                    <span>Registrar riscos</span>
                </NavLink>
            </div>


            <div className="sidebar-bottom">
                <hr className="sidebar-divider"/>

                <NavLink to="/matriz-riscos" className="nav-item">
                    <FiGrid className="nav-icon"/>
                    <span>Matriz de Risco</span>
                </NavLink>


                <NavLink to="/exportar"  className="nav-item">
                    <FiDownload className="nav-icon"/>
                    <span>Exportar</span>
                </NavLink>
            </div>
        </aside>
    );
}

export default Sidebar;