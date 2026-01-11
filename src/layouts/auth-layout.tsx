import { Outlet } from "react-router-dom";
 
const AuthenticationLayout = () => {
  return (
    <div className="w-screen h-screen overflow-auto flex items-center justify-center relative p-4">
        <img src="/assets/img/bg.png" className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="" />
        <div className="relative z-10 w-full max-w-2xl">
          <Outlet />
        </div>
    </div>
  )
}

export default AuthenticationLayout;