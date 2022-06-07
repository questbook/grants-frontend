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

	let amount = 0;

  async function fetchWethPrice() {
    const data = await client.query(wethPriceQuery).toPromise();
    amount = data.data.bundle.ethPrice * value
  }

  async function fetchDaiPrice() {
    const data = await client.query(daiPriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice * value
  }

  async function fetchUsdcPrice() {
    const data = await client.query(usdcPriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice * value
  }

  async function fetchWmaticPrice() {
    const data = await client.query(wmaticPriceQuery).toPromise();
  	amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice * value
  }

  async function fetchAavePrice() {
    const data = await client.query(aavePriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice * value
  }

  async function fetchOceanPrice() {
    const data = await client.query(oceanPriceQuery).toPromise();
    amount = data.data.pair.token0.derivedETH * data.data.bundle.ethPrice * value
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

export const useTimeDifference = (current: number, previous: number) => {
	let msPerMinute = 60 * 1000;
	let msPerHour = msPerMinute * 60;
	let msPerDay = msPerHour * 24;
	let msPerWeek = msPerDay * 7;
	let msPerMonth = msPerDay * 30;
	let msPerYear = msPerDay * 365;

	let elapsed = current - previous;

	if (elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + 's';
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + 'min';
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + 'h';
	} else if (elapsed < msPerWeek) {
		return Math.round(elapsed / msPerDay) + 'd';
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerWeek) + 'w';
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + 'm';
	} else {
		return Math.round(elapsed / msPerYear) + 'y';
	}
};
