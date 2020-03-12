import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import {
  Layout,
  Menu,
  PageHeader,
  Table,
  Card,
  Row,
  Col,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber
} from "antd";
import { useForm } from "react-hook-form";

import StockService from "./services/stocks";

import "./App.css";

const { Sider, Content } = Layout;

function App() {
  const [stocks, setStocks] = useLocalStorage("stocks", []);
  const [visible, setVisible] = useState(false);
  const { handleSubmit, register } = useForm();

  useEffect(() => {
    async function updateStocks() {
      await StockService.updateStocksQuote(stocks);
    }

    updateStocks();
  }, []);

  const onSubmitStock = async values => {
    console.log(values);
    // const updatedStocks = await StockService.updateStocksQuote(StockService.add(stocks, values));

    // setStocks(updatedStocks);
  };

  const toReal = price => price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const transactionsColumns = [
    {
      title: "Cód.",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "Qntd.",
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: value => new Date(value).toLocaleDateString()
    }
  ];

  const transactionsData = stocks;

  const walletColumns = [
    {
      title: "Cód.",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "PM (R$)",
      dataIndex: "averagePrice",
      key: "averagePrice",
      render: value => toReal(+value)
    },
    {
      title: "%PM",
      dataIndex: "averagePercentage",
      key: "averagePercentage",
      render: value => `${value}%`
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: value => toReal(+value)
    }
  ];

  const wallet = StockService.getWallet(stocks);

  const walletData = wallet.data.map((stock, key) => {
    return { ...stock, key };
  });

  const formLayout = {
    labelCol: {
      span: 24
    },
    wrapperCol: {
      span: 24
    }
  };

  const buttonsLayout = {
    wrapperCol: {
      span: 24
    }
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
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">Carteira</Menu.Item>
          <Menu.Item key="3">Extratos</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <PageHeader title="Minhas Ações" />
            <Drawer
              title="Adicionar Compra"
              width={300}
              placement="right"
              onClose={() => setVisible(false)}
              visible={visible}
            >
              <Form
                layout="vertical"
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onSubmitStock}
                // onFinishFailed={onFinishFailed}
                {...formLayout}
              >
                <Form.Item label="Ativo" name="idt" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="children">
                    {StockService.getAllStocks().map(stock => (
                      <Select.Option value={stock?.idt}>
                        {stock?.code} - {stock?.companyAbvName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Categoria" name="category" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="acoes-br">Ações BR</Select.Option>
                    <Select.Option value="acoes-us">Ações US</Select.Option>
                    <Select.Option value="fii">FII</Select.Option>
                    <Select.Option value="caixa">Caixa</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Quantidade" name="quantity" rules={[{ required: true }]}>
                  <InputNumber />
                </Form.Item>
                <Form.Item label="Preço" name="paidPrice" rules={[{ required: true }]}>
                  <InputNumber
                    formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={value => value.replace(/R\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item label="Data" name="date" rules={[{ required: true }]}>
                  <DatePicker />
                </Form.Item>
                <Form.Item {...buttonsLayout}>
                  <Button type="primary" htmlType="submit">
                    Salvar
                  </Button>
                  <Button type="link" onClick={() => setVisible(false)}>
                    Cancelar
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>

            <Row gutter={30}>
              <Col span={12}>
                <Card title="Carteira" style={{ marginBottom: 30 }}>
                  <h3>Rendimentos: {wallet?.totalPercentage}%</h3>
                  <Table column columns={walletColumns} dataSource={walletData} />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Extrato"
                  extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                      Adicionar
                    </Button>
                  }
                >
                  <Table columns={transactionsColumns} dataSource={transactionsData} />
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
