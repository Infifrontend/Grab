import React from "react";
import { Layout, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Footer } = Layout;
const navigationItems: any[] = [
    // { key: "home", label: "Home", path: "/" },
    // { key: "manage-booking", label: "Manage Booking", path: "/" },
    // { key: "bids", label: "Bids", path: "/" },
];

export default function AppFooter() {
    return (
        <Footer className="py-2  cls-footer-container bg-white">
            <Row className="max-w-7x flex  justify-between">
                <Col>
                    <ul className="flex">
                        <li className="text-sm ">@ 2025 GroupRM all rights reserved</li>
                        {navigationItems.length > 0 && navigationItems.map((item) => (
                            <li className="text-sm ">
                                <Link
                                    key={item.key}
                                    to={item.path} >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Col>
                <Col>
                    <span>Powered by Infiniti Software Solutions</span>
                </Col>
            </Row>
        </Footer>

    )
}
