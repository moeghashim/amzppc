import { useState, useEffect } from 'react';
import { getAllCampaigns, searchCampaigns } from '../services/campaignService';
import CampaignDetails from './CampaignDetails';
import './CampaignsTable.css';

export default function CampaignsTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    const filtered = searchCampaigns(searchQuery, campaigns);
    const sorted = sortCampaigns(filtered, sortField, sortDirection);
    setFilteredCampaigns(sorted);
  }, [searchQuery, campaigns, sortField, sortDirection]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortCampaigns = (campaignsToSort, field, direction) => {
    const sorted = [...campaignsToSort].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'createdAt' || field === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="campaigns-table-container">
        <div className="loading-state">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="campaigns-table-container">
      <div className="results-section">
        <div className="table-header">
          <h2>All Campaigns ({filteredCampaigns.length})</h2>
          <button onClick={loadCampaigns} className="refresh-button">
            🔄 Refresh
          </button>
        </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by ASIN, product slug, or campaign name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="empty-state">
          {searchQuery ? 'No campaigns found matching your search.' : 'No campaigns saved yet.'}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('asin')} className="sortable">
                  ASIN {getSortIcon('asin')}
                </th>
                <th onClick={() => handleSort('productSlug')} className="sortable">
                  Product Slug {getSortIcon('productSlug')}
                </th>
                <th onClick={() => handleSort('createdAt')} className="sortable">
                  Created {getSortIcon('createdAt')}
                </th>
                <th>Campaigns</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <code className="asin-cell">{campaign.asin}</code>
                  </td>
                  <td>{campaign.productSlug}</td>
                  <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                  <td>{campaign.campaigns?.length || 0}</td>
                  <td>
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="view-button"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </div>

      {selectedCampaign && (
        <CampaignDetails
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}
