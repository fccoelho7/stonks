import React from "react";
import { Button, Form, Select, DatePicker, InputNumber } from "antd";

const TransactionForm = ({ onSubmit, allCompanies, onClose }) => {
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

  const dateFormat = "DD/MM/YYYY";

  return (
    <Form layout="vertical" name="basic" initialValues={{ remember: true }} onFinish={onSubmit} {...formLayout}>
      <Form.Item label="Operação" name="type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="buy">Aporte</Select.Option>
          <Select.Option value="sell">Resgate</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Ativo" name="idt" rules={[{ required: true }]}>
        <Select showSearch optionFilterProp="children" autoFocus>
          {allCompanies.map(stock => (
            <Select.Option value={stock?.idt} key={stock?.idt}>
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
      <Form.Item label="Valor" name="amount" rules={[{ required: true }]}>
        <InputNumber
          formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={value => value.replace(/R\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Data" name="date" rules={[{ required: true }]}>
        <DatePicker format={dateFormat} />
      </Form.Item>
      <Form.Item {...buttonsLayout}>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
        <Button type="link" onClick={onClose}>
          Cancelar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
