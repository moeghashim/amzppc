import { useState } from 'react';
import { generateCampaignNames } from '../utils/campaignGenerator';
import './CampaignGenerator.css';

export default function CampaignGenerator() {
  const [asin, setAsin] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleGenerate = () => {
    if (asin.trim() && productSlug.trim()) {
      const generated = generateCampaignNames(asin.trim(), productSlug.trim());
      setCampaigns(generated);
      setCopiedIndex(null);
      setAllCopied(false);
    }
  };

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
    if (campaigns.length === 0) return;
    try {
      const allText = campaigns.join('\n');
      await navigator.clipboard.writeText(allText);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy all:', err);
    }
  };

  return (
    <div className="campaign-generator">
      <div className="generator-container">
        <header className="generator-header">
          <h1>Amazon PPC Campaign Name Generator</h1>
          <p className="subtitle">Generate campaign names for all ad types</p>
        </header>

        <div className="input-section">
          <div className="input-group">
            <label htmlFor="asin">ASIN</label>
            <input
              id="asin"
              type="text"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              placeholder="B08XYZ1234"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="productSlug">Product Slug</label>
            <input
              id="productSlug"
              type="text"
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value)}
              placeholder="wireless-headphones"
              className="input-field"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!asin.trim() || !productSlug.trim()}
            className="generate-button"
          >
            Generate Campaign Names
          </button>
        </div>

        {campaigns.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>Generated Campaign Names ({campaigns.length})</h2>
              <button
                onClick={handleCopyAll}
                className="copy-all-button"
              >
                {allCopied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="campaigns-list">
              {campaigns.map((campaign, index) => (
                <div key={index} className="campaign-item">
                  <code className="campaign-name">{campaign}</code>
                  <button
                    onClick={() => handleCopy(campaign, index)}
                    className="copy-button"
                    aria-label="Copy campaign name"
                  >
                    {copiedIndex === index ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
