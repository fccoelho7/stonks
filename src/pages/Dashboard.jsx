import React, { useEffect, useState } from "react";
import { Layout, Menu, Card, Row, Col, Button, Drawer } from "antd";

import useStocks from "../hooks/useStocks";
import TransactionsTable from "../components/TransactionsTable";
import WalletTable from "../components/WalletTable";
import TransactionForm from "../components/TransactionForm";

const { Sider, Content } = Layout;

function App() {
  const { transactions, addTransaction, removeTransaction, getWallet, wallet, allCompanies } = useStocks();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getWallet();
  }, [transactions]);

  const onSubmitTransaction = async values => {
    await addTransaction({ ...values, date: values.date.toDate() });
    setVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="logo" />
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1">Dashboard</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Drawer
              title="Adicionar Compra"
              width={360}
              placement="right"
              onClose={() => setVisible(false)}
              visible={visible}
            >
              <TransactionForm
                allCompanies={allCompanies}
                onSubmit={onSubmitTransaction}
                onClose={() => setVisible(false)}
              />
            </Drawer>

            <Row gutter={30}>
              <Col span={14}>
                <Card title="Carteira" style={{ marginBottom: 30 }}>
                  <h3>Rendimento Total: {wallet?.totalPercentage}%</h3>
                  <WalletTable wallet={wallet} />
                </Card>
              </Col>
              <Col span={10}>
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
  );
}

export default App;
