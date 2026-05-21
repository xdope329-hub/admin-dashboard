// The storefront only supports two currencies: COP (default base) and USD.
// Both the admin create/edit form and the CurrencySymbol lookup widget read
// from this list, so trimming it here locks the picker to those two codes.
export const AllCurrencyData = [
  {
    "currency_code": "COP",
    "currency_symbol": "$",
  },
  {
    "currency_code": "USD",
    "currency_symbol": "US$",
  },
];
