import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;

function App({ children }) {
  return (
    <>
      <Layout>
        <Sider>
          <div className="logo" />
          <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100vh" }}>
            <Menu.Item key="1">
              <Link to="/">Carteira</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/balanceamento">Balanceamento</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "0 16px" }}>{children}</Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
