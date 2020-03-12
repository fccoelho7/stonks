import axios from "axios";

import Stocks from "./stocks";

describe("Stocks", () => {
  it("adds a new transaction", () => {
    const store = [];
    const id = Date.now();

    const newTransaction = {
      id,
      idt: 376,
      type: "buy",
      quantity: 100,
      amount: 10.0,
      date: new Date("03/11/2020"),
      category: "acoes-br"
    };

    const result = Stocks.addTransaction(store, newTransaction);

    expect(result).toEqual([{ ...newTransaction, code: "ITSA4.SA", currentPrice: 0 }]);
  });

  it("removes a transaction", () => {
    const id = Date.now();

    const store = [
      {
        id,
        idt: 376,
        type: "buy",
        quantity: 100,
        amount: 10.0,
        date: new Date("03/11/2020")
      }
    ];

    const result = Stocks.remove(store, id);

    expect(result).toEqual([]);
  });

  it("updates stocks quotes", async () => {
    const axiosGetMock = jest.spyOn(axios, "get");

    axiosGetMock.mockImplementation(() => Promise.resolve({ data: [{ idt: "376", price: 10.4 }] }));

    const store = [
      {
        id: Date.now(),
        idt: 376,
        type: "buy",
        quantity: 100,
        amount: 10.0,
        date: new Date("03/11/2020")
      }
    ];

    const result = await Stocks.updateStocksQuote(store);

    expect(result).toEqual([{ ...store[0], currentPrice: 10.4, total: 1040 }]);
  });

  it("finds stock by idt", () => {
    expect(Stocks.getStockCodeByIdt(376).code).toEqual("ITSA4.SA");
  });

  it("returns wallet", () => {
    const transactions = [
      {
        code: "ITSA4",
        type: "buy",
        currentPrice: 8,
        quantity: 10,
        amount: 7,
        date: new Date("10/01/2020")
      },
      {
        code: "ITSA4",
        type: "buy",
        currentPrice: 8,
        quantity: 10,
        amount: 10,
        date: new Date("10/01/2019")
      },
      {
        code: "ITSA4",
        type: "buy",
        currentPrice: 8,
        quantity: 10,
        amount: 11,
        date: new Date("10/02/2018")
      },
      {
        code: "ITUB4",
        type: "buy",
        currentPrice: 80,
        quantity: 10,
        amount: 32,
        date: new Date("1/01/2017")
      }
    ];

    const result = Stocks.getWallet(transactions);

    expect(result).toEqual({
      data: [
        {
          code: "ITSA4",
          totalQuantity: 30,
          currentPrice: 8,
          averagePrice: "9.33",
          averagePricePercentage: "16.6",
          total: "279.90"
        },
        {
          code: "ITUB4",
          totalQuantity: 10,
          currentPrice: 80,
          averagePrice: "32.00",
          averagePricePercentage: "-60.0",
          total: "320.00"
        }
      ],
      totalPercentage: "-43.40"
    });
  });
});
