import { useState } from "react";
import { utils } from "ethers";
import { createClient } from "urql";

type Values = {
  value: number | string | any;
  token: string;
};

const wethPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
 }
`;

const aavePriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f"){
	   token0 {
		 derivedETH
	   }
   }
  }
`;

const wmaticPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "0x819f3450da6f110ba6ea52195b3beafa246062de"){
	   token0 {
		 derivedETH
	   }
   }
  }
`;

const oceanPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "0x9b7dad79fc16106b47a3dab791f389c167e15eb0"){
	   token0 {
		 derivedETH
	   }
   }
  }
`

const daiPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"){
	   token0 {
		 derivedETH
	   }
   }
  }
`
const usdcPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"){
	   token0 {
		 derivedETH
	   }
   }
  }
`

export function calculateUSDValue({ value, token }: Values) {

  const client = createClient({
    url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  });

  async function fetchWethPrice() {
    const data = await client.query(wethPriceQuery).toPromise();
    setWethPrice(data.data.bundle.ethPrice);
  }

  async function fetchDaiPrice() {
    const data = await client.query(daiPriceQuery).toPromise();
    setWmaticPrice(data.data.pair.token0.derivedETH * data.data.bundle.ethPrice);
  }

  async function fetchUsdcPrice() {
    const data = await client.query(usdcPriceQuery).toPromise();
    setUsdcPrice(data.data.pair.token0.derivedETH * data.data.bundle.ethPrice);
  }

  async function fetchWmaticPrice() {
    const data = await client.query(wmaticPriceQuery).toPromise();
    setDaiPrice(data.data.pair.token0.derivedETH * data.data.bundle.ethPrice);
  }

  async function fetchAavePrice() {
    const data = await client.query(aavePriceQuery).toPromise();
    setAavePrice(data.data.pair.token0.derivedETH * data.data.bundle.ethPrice);
  }

  async function fetchOceanPrice() {
    const data = await client.query(oceanPriceQuery).toPromise();
    setOceanPrice(data.data.pair.token0.derivedETH * data.data.bundle.ethPrice);
  }

  const [wethPrice, setWethPrice] = useState<number>();
  const [usdcPrice, setUsdcPrice] = useState<number>();
  const [daiPrice, setDaiPrice] = useState<number>();
  const [aavePrice, setAavePrice] = useState<number>();
  const [wmaticPrice, setWmaticPrice] = useState<number>();
  const [oceanPrice, setOceanPrice] = useState<number>();

  if (token === "WMATIC") {
    fetchWmaticPrice();
  }

  if (token === "AAVE") {
    fetchAavePrice();
  }

  if (token === "WETH") {
    fetchWethPrice()
  }

  if (token === "OCEAN") {
    fetchOceanPrice()
  }

  if (token === "DAI") {
    fetchUsdcPrice()
  }

  if (token === "USDC") {
    fetchDaiPrice()
  }

  return
      token === "WETH" &&
      utils.commify(((wethPrice ?? 0) * (value ?? 0)).toString())

      token === "DAI" &&
      utils.commify(((daiPrice ?? 0) * (value ?? 0)).toString())

      token === "USDC" &&
      utils.commify(((usdcPrice ?? 0) * (value ?? 0)).toString())

      token === "AAVE" &&
      utils.commify(((aavePrice ?? 0) * (value ?? 0)).toString())

      token === "WMATIC" &&
        utils.commify(
          ((wmaticPrice ?? 0) * (value ?? 0)).toString()
        )

      token === "OCEAN" &&
        utils.commify(
          ((oceanPrice ?? 0) * (value ?? 0)).toString()
        )
}
