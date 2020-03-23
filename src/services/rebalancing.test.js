import axios from "axios";
import Rebalancing from "./rebalancing";

describe("Rebalancing", () => {
  it("returns wallet", async () => {
    const store = [
      {
        symbol: "ITSA4.SA",
        quantity: 100,
        price: null,
        category: "br",
        weigth: 1
      },
      {
        symbol: "CVCB3.SA",
        quantity: 100,
        price: null,
        category: "br",
        weigth: 1
      },
      {
        symbol: "IVVB11.SA",
        quantity: 100,
        price: null,
        category: "us",
        weigth: 1
      },
      {
        symbol: "BRCR11.SA",
        quantity: 100,
        price: null,
        category: "fii",
        weigth: 1
      },
      {
        symbol: "Nubank 100% CDI",
        quantity: 1,
        price: 10000,
        category: "cash",
        weigth: 1
      }
    ];

    const result = {
      br: [
        {
          symbol: "ITSA4.SA",
          quantity: 100,
          price: 9,
          category: "br",
          weigth: 1,
          total: 900,
          selected: false
        },
        {
          symbol: "CVCB3.SA",
          quantity: 100,
          price: 7,
          category: "br",
          weigth: 1,
          total: 700,
          selected: false
        }
      ],
      us: [
        {
          symbol: "IVVB11.SA",
          quantity: 100,
          price: 130,
          category: "us",
          weigth: 1,
          total: 13000,
          selected: false
        }
      ],
      fii: [
        {
          symbol: "BRCR11.SA",
          quantity: 100,
          price: 80,
          category: "fii",
          weigth: 1,
          total: 8000,
          selected: false
        }
      ],
      cash: [
        {
          symbol: "Nubank 100% CDI",
          quantity: 1,
          price: 10000,
          category: "cash",
          weigth: 1,
          total: 10000,
          selected: false
        }
      ]
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
