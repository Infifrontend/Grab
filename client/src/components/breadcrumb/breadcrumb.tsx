import { MenuRoutes } from "@/routes/route";
import { HomeOutlined } from "@ant-design/icons"
import { Breadcrumb } from "antd"
import { Link } from "react-router-dom"

const BreadcrumbNav = (props:any) => {
    const getDefaultRoute:any = MenuRoutes?.admin?.routes?.find(route => route?.default) || "/";

    return (
        <Breadcrumb className="mb-4">
            <Breadcrumb.Item >
                <Link to={getDefaultRoute?.path}>
                <HomeOutlined />
                <span className="ml-1">Home</span>
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{props?.currentMenu}</Breadcrumb.Item>
        </Breadcrumb>
    )
}

export default BreadcrumbNav;