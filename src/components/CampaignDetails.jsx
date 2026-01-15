import { useState } from 'react';
import './CampaignDetails.css';

export default function CampaignDetails({ campaign, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  if (!campaign) return null;

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyAll = async () => {
    if (!campaign.campaigns || campaign.campaigns.length === 0) return;
    try {
      const allText = campaign.campaigns.map((c) => c.name).join('\n');
      await navigator.clipboard.writeText(allText);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy all:', err);
    }
  };

  return (
    <div className="campaign-details-overlay" onClick={onClose}>
      <div className="campaign-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="campaign-details-header">
          <h2>Campaign Details</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            ×
          </button>
        </div>

        <div className="campaign-details-content">
          <div className="campaign-info">
            <div className="info-row">
              <span className="info-label">ASIN:</span>
              <span className="info-value">{campaign.asin}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Product Slug:</span>
              <span className="info-value">{campaign.productSlug}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Created:</span>
              <span className="info-value">
                {new Date(campaign.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Campaigns:</span>
              <span className="info-value">{campaign.campaigns?.length || 0}</span>
            </div>
          </div>

          <div className="campaigns-section">
            <div className="campaigns-header">
              <h3>Campaign Names</h3>
              <button onClick={handleCopyAll} className="copy-all-button">
                {allCopied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="campaigns-list">
              {campaign.campaigns?.map((camp, index) => (
                <div key={index} className="campaign-item">
                  <div className="campaign-label">{camp.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                    <code className="campaign-name">{camp.name}</code>
                    <button
                      onClick={() => handleCopy(camp.name, index)}
                      className="copy-button"
                      aria-label="Copy campaign name"
                    >
                      {copiedIndex === index ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
