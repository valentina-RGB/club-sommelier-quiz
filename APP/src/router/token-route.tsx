import { getAuthStorage } from "@/common/storage/permission-store"
import { useAutoLogout } from "@/common/utils/token"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
    const {token} = getAuthStorage()
    
     useAutoLogout()
    if(!token){
        return <Navigate to="/" replace />
    }
    return <Outlet />
}

export default PrivateRoute