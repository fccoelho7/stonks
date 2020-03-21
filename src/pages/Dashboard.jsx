import React, { useEffect, useState } from "react";
import { Layout, Menu, Card, Row, Col, Button, Drawer, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import useStocks from "../hooks/useStocks";
import TransactionsTable from "../components/TransactionsTable";
import WalletTable from "../components/WalletTable";
import TransactionForm from "../components/TransactionForm";
import CompositionChart from "../components/CompositionChart";

const { Sider, Content } = Layout;

function App() {
  const { transactions, addTransaction, removeTransaction, getWallet, wallet, allCompanies, composition } = useStocks();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const onSubmitTransaction = async values => {
    await addTransaction({ ...values, date: values.date.toDate() });
    setVisible(false);
  };

  return (
    <>
      <Layout>
        <Sider>
          <div className="logo" />
          <Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} style={{ height: "100vh" }}>
            <Menu.Item key="1">Dashboard</Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "0 16px" }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Row gutter={30} style={{ marginBottom: 30 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Rendimento Total"
                      value={wallet?.totalPercentage}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={wallet?.totalPercentage > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      suffix="%"
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={30}>
                <Col span={15}>
                  <Card title="Portfólio">
                    <CompositionChart composition={composition} style={{ marginBottom: 30 }} />
                    <WalletTable wallet={wallet} />
                  </Card>
                </Col>
                <Col span={9}>
                  <Card
                    title="Extrato"
                    extra={
                      <Button type="primary" onClick={() => setVisible(true)}>
                        Adicionar
                      </Button>
                    }
                  >
                    <TransactionsTable transactions={transactions} removeTransaction={removeTransaction} />
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Drawer
        title="Adicionar Compra"
        width={360}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <TransactionForm allCompanies={allCompanies} onSubmit={onSubmitTransaction} onClose={() => setVisible(false)} />
      </Drawer>
    </>
  );
}

export default App;
