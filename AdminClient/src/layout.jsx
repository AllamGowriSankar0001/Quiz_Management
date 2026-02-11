import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar"
function Layout(){
    return(
        <>
        <div className="layout-container">
            <Sidebar/>
            <main>
                <Outlet/>
            </main>
        </div>
        </>
    )
}
export default Layout