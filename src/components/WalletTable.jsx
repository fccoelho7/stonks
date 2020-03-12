import React from "react";
import { Table } from "antd";

import { toReal } from "../helpers";

const WalletTable = ({ wallet }) => {
  const walletColumns = [
    {
      title: "Cód.",
      dataIndex: "code",
      key: "code",
      render: code => <a href="#">{code}</a>
    },
    {
      title: "Preço Atual",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: value => toReal(+value)
    },
    {
      title: "Preço Médio",
      dataIndex: "averagePrice",
      key: "averagePrice",
      render: value => toReal(+value)
    },
    {
      title: "Rent. Sobre PM",
      dataIndex: "averagePricePercentage",
      key: "averagePricePercentage",
      render: value => `${value}%`
    },
    {
      title: "Saldo Bruto",
      dataIndex: "total",
      key: "total",
      render: value => toReal(+value)
    }
  ];

  const walletData = wallet.data.map((stock, key) => {
    return { ...stock, key };
  });

  return <Table columns={walletColumns} dataSource={walletData} />;
};

export default WalletTable;
