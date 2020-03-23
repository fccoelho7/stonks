import React, { useEffect, useState } from "react";
import { Tabs, Row, Col, Card, Table, Spin } from "antd";

import Rebalancing from "../services/rebalancing";
import Layout from "../components/Layout";
import { toReal } from "../helpers";

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
    currentPrice: null,
    category: "br",
    weight: 1
  },
  {
    symbol: "CVCB3.SA",
    quantity: 100,
    currentPrice: null,
    category: "br",
    weight: 1
  },
  {
    symbol: "IVVB11.SA",
    quantity: 100,
    currentPrice: null,
    category: "us",
    weight: 1
  },
  {
    symbol: "BRCR11.SA",
    quantity: 100,
    currentPrice: null,
    category: "fii",
    weight: 1
  },
  {
    symbol: "Nubank 100% CDI",
    quantity: 1,
    currentPrice: 10000,
    category: "cash",
    weight: 1
  }
];

function App() {
  const [assets] = useState(wallet);
  const [isLoading, setIsLoading] = useState(true);
  const [assetsByCategories, setAssetsByCategories] = useState({});

  useEffect(() => {
    async function fetchWallet() {
      const categories = await Rebalancing.getWallet(assets);

      setAssetsByCategories(categories);
      setIsLoading(false);
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
      title: "Preço Atual",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: value => toReal(value)
    },
    {
      title: "Peso",
      key: "weight",
      dataIndex: "weight"
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: "Tenho (%)",
      key: "currentPercentage",
      dataIndex: "currentPercentage",
      render: value => `${value.toFixed(2)}%`
    },
    {
      title: "Total (R$)",
      key: "currentAmount",
      dataIndex: "currentAmount",
      render: value => toReal(value)
    },
    {
      title: "Ideal (R$)",
      key: "idealAmount",
      dataIndex: "idealAmount",
      render: value => toReal(value)
    },
    {
      title: "Ideal (%)",
      key: "idealPercentage",
      dataIndex: "idealPercentage",
      render: value => `${value.toFixed(2)}%`
    },
    {
      title: "Falta (R$)",
      key: "amountMissing",
      dataIndex: "amountMissing",
      render: value => toReal(value)
    }
  ];

  const categoriesByKey = Object.keys(assetsByCategories);

  return (
    <Layout>
      <Row gutter={30} style={{ marginTop: 30 }}>
        <Col span={24}>
          <Card title="Balanceamento">
            <Spin tip="Carregando..." spinning={isLoading}>
              <Tabs onChange={() => {}} type="card">
                {categoriesByKey.map(category => {
                  const dataSource = assetsByCategories[category].assets.map(stock => ({
                    ...stock,
                    key: stock.symbol
                  }));

                  return (
                    <TabPane
                      tab={`${categories[category].label} - ${assetsByCategories[category].totalCategoryPercentage}%`}
                      key={category}
                    >
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
