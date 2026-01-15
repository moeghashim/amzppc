/**
 * Cloudflare Worker to handle saving campaigns to GitHub repository
 * Uses GitHub REST API to read/write data/campaigns.json
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      const { asin, productSlug, campaigns } = await request.json();

      if (!asin || !productSlug || !campaigns) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: asin, productSlug, campaigns' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const repoOwner = env.GITHUB_REPO_OWNER || 'moeghashim';
      const repoName = env.GITHUB_REPO_NAME || 'amzppc';
      const filePath = 'data/campaigns.json';
      const githubToken = env.GITHUB_TOKEN;

      if (!githubToken) {
        return new Response(
          JSON.stringify({ error: 'GitHub token not configured' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Get current file content
      const getFileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
      const getFileResponse = await fetch(getFileUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      let currentData = { campaigns: [] };
      let sha = null;

      if (getFileResponse.ok) {
        const fileData = await getFileResponse.json();
        const content = atob(fileData.content.replace(/\s/g, ''));
        currentData = JSON.parse(content);
        sha = fileData.sha;
      } else if (getFileResponse.status !== 404) {
        const error = await getFileResponse.json();
        return new Response(
          JSON.stringify({ error: `Failed to read file: ${error.message || 'Unknown error'}` }),
          {
            status: getFileResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Check for duplicate ASIN
      const existingCampaign = currentData.campaigns.find((c) => c.asin === asin);
      if (existingCampaign) {
        return new Response(
          JSON.stringify({ error: 'ASIN already exists', existingCampaign }),
          {
            status: 409,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Create new campaign entry
      const newCampaign = {
        id: crypto.randomUUID(),
        asin,
        productSlug,
        campaigns,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to campaigns array
      currentData.campaigns.push(newCampaign);

      // Update file on GitHub
      const updateFileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
      const fileContent = JSON.stringify(currentData, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

      const updatePayload = {
        message: `Add campaign for ASIN: ${asin}`,
        content: encodedContent,
        branch: 'main',
      };

      if (sha) {
        updatePayload.sha = sha;
      }

      const updateResponse = await fetch(updateFileUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        return new Response(
          JSON.stringify({ error: `Failed to save: ${error.message || 'Unknown error'}` }),
          {
            status: updateResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, campaign: newCampaign }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message || 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
