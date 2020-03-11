import axios from "axios";

import Stocks from "./stocks";

describe("Stocks", () => {
  it("adds a new stock", () => {
    const store = [];
    const id = Date.now();

    const newStock = {
      id,
      idt: 376,
      quantity: 100,
      paidPrice: 10.0,
      date: new Date("03/11/2020"),
      category: "acoes-br"
    };

    const result = Stocks.add(store, newStock);

    expect(result).toEqual([
      { ...newStock, code: "ITSA4.SA", currentPrice: 0 }
    ]);
  });

  it("removes a stock", () => {
    const id = Date.now();

    const store = [
      {
        id,
        idt: 376,
        quantity: 100,
        paidPrice: 10.0,
        date: new Date("03/11/2020")
      }
    ];

    const result = Stocks.remove(store, id);

    expect(result).toEqual([]);
  });

  it("updates stocks quotes", async () => {
    const axiosGetMock = jest.spyOn(axios, "get");

    axiosGetMock.mockImplementation(() =>
      Promise.resolve({ data: [{ idt: "376", price: 10.4 }] })
    );

    const store = [
      {
        id: Date.now(),
        idt: 376,
        quantity: 100,
        paidPrice: 10.0,
        date: new Date("03/11/2020")
      }
    ];

    const result = await Stocks.updateStocksQuote(store);

    expect(result).toEqual([{ ...store[0], currentPrice: 10.4, total: 1040 }]);
  });

  it("finds stock by idt", () => {
    expect(Stocks.getStockCodeByIdt(376).code).toEqual("ITSA4.SA");
  });
});
