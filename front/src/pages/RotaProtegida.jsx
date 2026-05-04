import { Navigate, Outlet }  from  'react-router-dom'

function RotaProtegida()  {
    const uid = localStorage.getItem('uid')

    if (!uid) {
        return <Navigate to="/" />
    }

    console.log(uid)

    return <Outlet />;
}

export default RotaProtegida