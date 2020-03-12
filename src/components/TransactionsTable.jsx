import React from "react";
import { Button, Table } from "antd";

import { toReal } from "../helpers";

const TransactionsTable = ({ transactions, removeTransaction }) => {
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
      title: "Preço",
      dataIndex: "paidPrice",
      key: "paidPrice",
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

  const transactionsData = transactions.map(stock => ({ ...stock, key: stock.idt }));

  return <Table columns={transactionsColumns} dataSource={transactionsData} />;
};

export default TransactionsTable;
