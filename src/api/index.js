const options = {method: 'GET'};

export const getAssets = async (address) => {
  try {
    const response = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=50`,
      options,
    );
    const response_1 = await response.json();
    return response_1;
  } catch (err) {
    return err;
  }
};

export const getCollections = async (address) => {
  try {
    const response = await fetch(
      `https://api.opensea.io/api/v1/collections?asset_owner=${address}&offset=0&limit=300`,
      options,
    );
    const response_1 = await response.json();
    return response_1;
  } catch (err) {
    return err;
  }
};

export const getEthPrice = async () => {
  const etherScanUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=UJPNRQME4IE8P9V3VZNKEM6M971QDWPKM1`;
  try {
    const response = await fetch(etherScanUrl);
    const res1 = await response.json();
    return res1;
  } catch (err) {
    console.error('fetch failed', err);
  }
};
