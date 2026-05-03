import { Navigate }  from  'react-router-dom'

function RotaProtegida({ children })  {
    const token = localStorage.getItem('tokenAcesso')

    if (!token) {
        return <Navigate to="/" />
    }

    console.log(token)
    return children;
}

export default RotaProtegida