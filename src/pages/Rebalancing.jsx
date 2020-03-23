import React, { useState } from "react";
import { Tabs, Row, Col, Card, Table, Spin } from "antd";
import Rebalancing from "../services/rebalancing";

import Layout from "../components/Layout";
import { useEffect } from "react";

const { TabPane } = Tabs;

const categories = {
  br: {
    label: "Ações BR",
    percentage: 25
  },
  us: {
    label: "Ações US",
    percentage: 25
  },
  fii: {
    label: "FII",
    percentage: 25
  },
  cash: {
    label: "Caixa",
    percentage: 25
  }
};

const wallet = [
  {
    symbol: "ITSA4.SA",
    quantity: 100,
    price: null,
    category: "br",
    weigth: 1
  },
  {
    symbol: "CVCB3.SA",
    quantity: 100,
    price: null,
    category: "br",
    weigth: 1
  },
  {
    symbol: "IVVB11.SA",
    quantity: 100,
    price: null,
    category: "us",
    weigth: 1
  },
  {
    symbol: "IRBR11.SA",
    quantity: 100,
    price: null,
    category: "fii",
    weigth: 1
  },
  {
    symbol: "Nubank 100% CDI",
    quantity: 1,
    price: 10000,
    category: "cash",
    weigth: 1
  }
];

function App() {
  const [assets] = useState(wallet);
  const [assetsByCategories, setAssetsByCategories] = useState({});

  useEffect(() => {
    async function fetchWallet() {
      setAssetsByCategories(await Rebalancing.getWallet(assets));
    }

    fetchWallet();
  }, [assets]);

  const columns = [
    {
      title: "Ativo",
      dataIndex: "symbol",
      key: "symbol"
    },
    {
      title: "Peso",
      key: "weigth",
      dataIndex: "weigth"
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: "Total (R$)",
      key: "total",
      dataIndex: "total"
    }
  ];

  const isLoading = Object.keys(assetsByCategories).length === 0;

  return (
    <Layout>
      <Row gutter={30} style={{ marginTop: 30 }}>
        <Col span={24}>
          <Card title="Balanceamento">
            <Spin tip="Carregando..." spinning={isLoading}>
              <Tabs onChange={() => {}} type="card">
                {Object.keys(assetsByCategories).map(category => {
                  const dataSource = assetsByCategories[category].map(stock => ({ ...stock, key: stock.symbol }));

                  return (
                    <TabPane tab={categories[category].label} key={category}>
                      <Table dataSource={dataSource} columns={columns} />
                    </TabPane>
                  );
                })}
              </Tabs>
            </Spin>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

export default App;
