/**
 * Generates all Amazon PPC campaign name combinations
 * @param {string} asin - The product ASIN
 * @param {string} productSlug - The product slug/name
 * @returns {Array<string>} Array of formatted campaign names
 */
export function generateCampaignNames(asin, productSlug) {
  if (!asin || !productSlug) {
    return [];
  }

  const campaigns = [];

  // SP Auto (no intent tag)
  campaigns.push(`${asin} | ${productSlug} | SP | AUTO | CLOSE`);
  campaigns.push(`${asin} | ${productSlug} | SP | AUTO | LOOSE`);
  campaigns.push(`${asin} | ${productSlug} | SP | AUTO | SUBS`);
  campaigns.push(`${asin} | ${productSlug} | SP | AUTO | COMP`);

  // SP Keywords (with intent)
  campaigns.push(`${asin} | ${productSlug} | SP | KW | BROAD | EXPAND`);
  campaigns.push(`${asin} | ${productSlug} | SP | KW | PHRASE | CONTROL`);
  campaigns.push(`${asin} | ${productSlug} | SP | KW | EXACT | RANK`);

  // SP Product Targeting (with intent)
  campaigns.push(`${asin} | ${productSlug} | SP | PT | ASIN | CONQUEST`);
  campaigns.push(`${asin} | ${productSlug} | SP | PT | CATEGORY | CONQUEST`);

  // Sponsored Brands
  campaigns.push(`${asin} | ${productSlug} | SB | KW | BRAND | DEFENSE`);

  // Sponsored Brands Video
  campaigns.push(`${asin} | ${productSlug} | SBV | KW | EXACT | SCALE`);

  // Sponsored Display
  campaigns.push(`${asin} | ${productSlug} | SD | VIEW | 7D | RET`);
  campaigns.push(`${asin} | ${productSlug} | SD | VIEW | 14D | RET`);
  campaigns.push(`${asin} | ${productSlug} | SD | VIEW | 30D | RET`);

  return campaigns;
}
