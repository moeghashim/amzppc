/**
 * Generates all Amazon PPC campaign name combinations
 * @param {string} asin - The product ASIN
 * @param {string} productSlug - The product slug/name
 * @returns {Array<{label: string, name: string}>} Array of campaign objects with labels and names
 */
export function generateCampaignNames(asin, productSlug) {
  if (!asin || !productSlug) {
    return [];
  }

  const campaigns = [];

  // SP Auto (no intent tag)
  campaigns.push({ label: 'SP Auto - CLOSE', name: `${asin} | ${productSlug} | SP | AUTO | CLOSE` });
  campaigns.push({ label: 'SP Auto - LOOSE', name: `${asin} | ${productSlug} | SP | AUTO | LOOSE` });
  campaigns.push({ label: 'SP Auto - SUBS', name: `${asin} | ${productSlug} | SP | AUTO | SUBS` });
  campaigns.push({ label: 'SP Auto - COMP', name: `${asin} | ${productSlug} | SP | AUTO | COMP` });

  // SP Keywords (with intent)
  campaigns.push({ label: 'SP Keywords - BROAD | EXPAND', name: `${asin} | ${productSlug} | SP | KW | BROAD | EXPAND` });
  campaigns.push({ label: 'SP Keywords - PHRASE | CONTROL', name: `${asin} | ${productSlug} | SP | KW | PHRASE | CONTROL` });
  campaigns.push({ label: 'SP Keywords - EXACT | RANK', name: `${asin} | ${productSlug} | SP | KW | EXACT | RANK` });

  // SP Product Targeting (with intent)
  campaigns.push({ label: 'SP Product Targeting - ASIN | CONQUEST', name: `${asin} | ${productSlug} | SP | PT | ASIN | CONQUEST` });
  campaigns.push({ label: 'SP Product Targeting - CATEGORY | CONQUEST', name: `${asin} | ${productSlug} | SP | PT | CATEGORY | CONQUEST` });

  // Sponsored Brands
  campaigns.push({ label: 'Sponsored Brands - BRAND | DEFENSE', name: `${asin} | ${productSlug} | SB | KW | BRAND | DEFENSE` });

  // Sponsored Brands Video
  campaigns.push({ label: 'Sponsored Brands Video - EXACT | SCALE', name: `${asin} | ${productSlug} | SBV | KW | EXACT | SCALE` });

  // Sponsored Display
  campaigns.push({ label: 'Sponsored Display - VIEW | 7D | RET', name: `${asin} | ${productSlug} | SD | VIEW | 7D | RET` });
  campaigns.push({ label: 'Sponsored Display - VIEW | 14D | RET', name: `${asin} | ${productSlug} | SD | VIEW | 14D | RET` });
  campaigns.push({ label: 'Sponsored Display - VIEW | 30D | RET', name: `${asin} | ${productSlug} | SD | VIEW | 30D | RET` });

  return campaigns;
}
