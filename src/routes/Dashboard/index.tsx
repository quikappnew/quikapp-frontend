import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout"

const Dashboard = () => {
    return (
        <SidebarLayout>
            <Navbar title="Dashboard" subTitle="Dashboard" />
            <div>Dashboard</div>
        </SidebarLayout>
    )
}
export default Dashboard;
