import axios from "axios";
import Rebalancing from "./rebalancing";

describe("Rebalancing", () => {
  it("returns wallet", async () => {
    const store = [
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

    const result = {
      br: {
        assets: [
          {
            amountMissing: -100,
            category: "br",
            currentPercentage: 56.25,
            currentPrice: 9,
            idealAmount: 800,
            idealPercentage: 50,
            quantity: 100,
            symbol: "ITSA4.SA",
            currentAmount: 900,
            weight: 1,
            selected: false
          },
          {
            amountMissing: 100,
            category: "br",
            currentPercentage: 43.75,
            currentPrice: 7,
            idealAmount: 800,
            idealPercentage: 50,
            quantity: 100,
            symbol: "CVCB3.SA",
            currentAmount: 700,
            weight: 1,
            selected: false
          }
        ],
        totalCategoryAmount: 1600,
        totalCategoryPercentage: 4.91
      },
      us: {
        assets: [
          {
            amountMissing: 0,
            category: "us",
            currentPercentage: 100,
            currentPrice: 130,
            idealAmount: 13000,
            idealPercentage: 100,
            quantity: 100,
            symbol: "IVVB11.SA",
            currentAmount: 13000,
            weight: 1,
            selected: false
          }
        ],
        totalCategoryAmount: 13000,
        totalCategoryPercentage: 39.88
      },
      fii: {
        assets: [
          {
            amountMissing: 0,
            category: "fii",
            currentPercentage: 100,
            currentPrice: 80,
            idealAmount: 8000,
            idealPercentage: 100,
            quantity: 100,
            symbol: "BRCR11.SA",
            currentAmount: 8000,
            weight: 1,
            selected: false
          }
        ],
        totalCategoryAmount: 8000,
        totalCategoryPercentage: 24.54
      },
      cash: {
        assets: [
          {
            amountMissing: 0,
            category: "cash",
            currentPercentage: 100,
            currentPrice: 10000,
            idealAmount: 10000,
            idealPercentage: 100,
            quantity: 1,
            symbol: "Nubank 100% CDI",
            currentAmount: 10000,
            weight: 1,
            selected: false
          }
        ],
        totalCategoryAmount: 10000,
        totalCategoryPercentage: 30.67
      }
    };

    const axiosGetMock = jest.spyOn(axios, "get");

    axiosGetMock.mockImplementation(() =>
      Promise.resolve({
        data: {
          "ITSA4.SA": { price: 9 },
          "CVCB3.SA": { price: 7 },
          "IVVB11.SA": { price: 130 },
          "BRCR11.SA": { price: 80 }
        }
      })
    );

    expect(await Rebalancing.getWallet(store)).toEqual(result);

    expect(axiosGetMock).toBeCalledWith(
      "/.netlify/functions/quotes?codes=ITSA4.SA,CVCB3.SA,IVVB11.SA,BRCR11.SA,Nubank 100% CDI"
    );
  });
});
