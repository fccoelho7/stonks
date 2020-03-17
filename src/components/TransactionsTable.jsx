import React from "react";
import { Button, Table, Tag } from "antd";

import { toReal } from "../helpers";

const TransactionsTable = ({ transactions, removeTransaction }) => {
  const transactionsColumns = [
    {
      title: "Ativo",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "Qntd.",
      dataIndex: "quantity",
      key: "quantity",
      render: (value, record) => {
        const color = record.type === "buy" ? "green" : "red";
        const sign = record.type === "buy" ? "+" : "-";

        return (
          <Tag color={color}>
            {sign}
            {value}
          </Tag>
        );
      }
    },
    {
      title: "Preço",
      dataIndex: "amount",
      key: "amount",
      render: value => toReal(+value)
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: value => new Date(value).toLocaleDateString()
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => removeTransaction(record.id)}>
          Apagar
        </Button>
      )
    }
  ];

  const transactionsData = transactions.map(stock => ({ ...stock, key: stock.code }));

  return <Table columns={transactionsColumns} dataSource={transactionsData} />;
};

export default TransactionsTable;
