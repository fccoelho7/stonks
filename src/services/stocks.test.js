import axios from "axios";

import Stocks from "./stocks";

describe("Stocks", () => {
  it("adds a new transaction", () => {
    const store = [];
    const id = Date.now();

    const newTransaction = {
      id,
      code: "ITSA4.SA",
      type: "buy",
      quantity: 100,
      amount: 10.0,
      date: new Date("03/11/2020"),
      category: "acoes-br"
    };

    const result = Stocks.addTransaction(store, newTransaction);

    expect(result).toEqual([newTransaction]);
  });

  it("removes a transaction", () => {
    const id = Date.now();

    const store = [
      {
        id,
        code: "ITSA4.SA",
        type: "buy",
        quantity: 100,
        amount: 10.0,
        date: new Date("03/11/2020")
      }
    ];

    const result = Stocks.removeTransaction(store, id);

    expect(result).toEqual([]);
  });

  it("returns composition by category", () => {
    const transactions = [
      {
        code: "ITSA4.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 7,
        date: new Date("10/01/2020")
      },
      {
        code: "ITUB4.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 10,
        date: new Date("10/01/2019")
      },
      {
        code: "IVVB11.SA",
        category: "acoes-us",
        type: "buy",
        quantity: 10,
        amount: 10,
        date: new Date("10/01/2019")
      },
      {
        code: "KNRI11.SA",
        category: "fii",
        type: "buy",
        quantity: 10,
        amount: 11,
        date: new Date("10/02/2018")
      },
      {
        code: "CVCB3.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 11,
        date: new Date("10/02/2018")
      },
      {
        code: "CVCB3.SA",
        category: "acoes-br",
        type: "sell",
        quantity: 10,
        amount: 11,
        date: new Date("10/02/2018")
      }
    ];

    const result = Stocks.getWalletComposition(transactions);

    expect(result).toEqual({ "acoes-br": 2, "acoes-us": 1, fii: 1 });
  });

  it("returns wallet", async () => {
    const axiosGetMock = jest.spyOn(axios, "get");

    axiosGetMock.mockImplementation(() =>
      Promise.resolve({
        data: {
          "ITSA4.SA": { price: 8 },
          "ITUB4.SA": { price: 80 }
        }
      })
    );

    const transactions = [
      {
        code: "ITSA4.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 7,
        date: new Date("10/01/2020")
      },
      {
        code: "ITSA4.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 10,
        date: new Date("10/01/2019")
      },
      {
        code: "ITSA4.SA",
        category: "acoes-br",
        type: "sell",
        quantity: 10,
        amount: 11,
        date: new Date("10/02/2018")
      },
      {
        code: "ITUB4.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 32,
        date: new Date("1/01/2017")
      },
      {
        code: "OIBR3.SA",
        category: "acoes-br",
        type: "buy",
        quantity: 10,
        amount: 32,
        date: new Date("1/01/2017")
      },
      {
        code: "OIBR3.SA",
        category: "acoes-br",
        type: "sell",
        quantity: 10,
        amount: 32,
        date: new Date("1/01/2017")
      }
    ];

    const result = await Stocks.getWallet(transactions);

    expect(result).toEqual({
      data: [
        {
          code: "ITSA4.SA",
          category: "acoes-br",
          totalQuantity: 10,
          currentPrice: 8,
          averagePrice: 6,
          averagePricePercentage: "-25.00",
          total: 60
        },
        {
          code: "ITUB4.SA",
          category: "acoes-br",
          totalQuantity: 10,
          currentPrice: 80,
          averagePrice: 32,
          averagePricePercentage: "-60.00",
          total: 320
        }
      ],
      totalPercentage: "-85.00"
    });
  });
});
