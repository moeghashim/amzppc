/**
 * Service layer for campaign data operations
 * Handles reading from GitHub raw content and writing via Cloudflare Worker
 */

const CAMPAIGNS_DATA_URL = 'https://raw.githubusercontent.com/moeghashim/amzppc/main/data/campaigns.json';
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Fetch all campaigns from GitHub raw content
 * @returns {Promise<Array>} Array of campaign objects
 */
export async function getAllCampaigns() {
  try {
    const response = await fetch(CAMPAIGNS_DATA_URL, {
      cache: 'no-cache', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
    }

    const data = await response.json();
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

/**
 * Check if an ASIN already exists in the campaigns
 * @param {string} asin - The ASIN to check
 * @returns {Promise<boolean>} True if ASIN exists, false otherwise
 */
export async function checkAsinExists(asin) {
  try {
    const campaigns = await getAllCampaigns();
    return campaigns.some((campaign) => campaign.asin === asin);
  } catch (error) {
    console.error('Error checking ASIN:', error);
    return false;
  }
}

/**
 * Save campaigns to the repository via Cloudflare Worker
 * @param {string} asin - The product ASIN
 * @param {string} productSlug - The product slug
 * @param {Array} campaigns - Array of campaign objects with label and name
 * @returns {Promise<Object>} Response object with success status and campaign data
 */
export async function saveCampaigns(asin, productSlug, campaigns) {
  if (!API_URL) {
    throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
  }

  try {
    const response = await fetch(`${API_URL}/save-campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asin,
        productSlug,
        campaigns,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save campaigns');
    }

    return data;
  } catch (error) {
    console.error('Error saving campaigns:', error);
    throw error;
  }
}

/**
 * Search campaigns by query string
 * @param {string} query - Search query
 * @param {Array} campaigns - Array of campaigns to search
 * @returns {Array} Filtered campaigns
 */
export function searchCampaigns(query, campaigns) {
  if (!query || !query.trim()) {
    return campaigns;
  }

  const lowerQuery = query.toLowerCase().trim();

  return campaigns.filter((campaign) => {
    const asinMatch = campaign.asin?.toLowerCase().includes(lowerQuery);
    const slugMatch = campaign.productSlug?.toLowerCase().includes(lowerQuery);
    const campaignMatch = campaign.campaigns?.some((c) =>
      c.name?.toLowerCase().includes(lowerQuery) || c.label?.toLowerCase().includes(lowerQuery)
    );

    return asinMatch || slugMatch || campaignMatch;
  });
}

/**
 * Delete a campaign by ID (optional - not implemented in worker yet)
 * @param {string} id - Campaign ID to delete
 * @returns {Promise<Object>} Response object
 */
export async function deleteCampaign(id) {
  // TODO: Implement delete functionality in Cloudflare Worker
  throw new Error('Delete functionality not yet implemented');
}
