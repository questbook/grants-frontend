import { utils } from "ethers";
import { createClient } from "urql";

export const calculateUSDValue = async(value: number | string | any, token: string) => {

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

  const client = createClient({
    url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  });

	let amount

  async function fetchWethPrice() {
    const data = await client.query(wethPriceQuery).toPromise();
    amount = data.data.bundle.ethPrice
  }

  async function fetchDaiPrice() {
    const data = await client.query(daiPriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice * value
  }

  async function fetchUsdcPrice() {
    const data = await client.query(usdcPriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice
  }

  async function fetchWmaticPrice() {
    const data = await client.query(wmaticPriceQuery).toPromise();
  	amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice
  }

  async function fetchAavePrice() {
    const data = await client.query(aavePriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice
  }

  async function fetchOceanPrice() {
    const data = await client.query(oceanPriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice
  }

  if (token === "WMATIC") {
    await fetchWmaticPrice();
  }

  if (token === "AAVE") {
    await fetchAavePrice();
  }

  if (token === "WETH") {
  	await fetchWethPrice()
  }

  if (token === "OCEAN") {
    await fetchOceanPrice()
  }

  if (token === "DAI") {
    await fetchDaiPrice()
  }

  if (token === "USDC") {
    await fetchUsdcPrice()
  }

  return amount
}
