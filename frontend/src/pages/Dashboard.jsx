import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCampaigns: 0, totalSent: 0, totalFailed: 0, successRate: 0 });
  const nav = useNavigate();

  useEffect(()=> {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns(){
    try {
      setLoading(true);
      const r = await api.get('/api/campaigns');
      const campaignData = r.data.campaigns || [];
      setCampaigns(campaignData);
      
      // Calculate stats
      const totalSent = campaignData.reduce((sum, c) => sum + (c.stats?.sent || 0), 0);
      const totalFailed = campaignData.reduce((sum, c) => sum + (c.stats?.failed || 0), 0);
      const successRate = totalSent + totalFailed > 0 ? Math.round((totalSent / (totalSent + totalFailed)) * 100) : 0;
      
      setStats({
        totalCampaigns: campaignData.length,
        totalSent,
        totalFailed,
        successRate
      });
    } catch (e) {
      console.error(e);
      alert('Please login first (if redirected, press the Login button).');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="background-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 20 + 's',
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px'
          }}></div>
        ))}
      </div>

      <div style={{ minHeight: '100vh', padding: '24px' }}>
        {/* Header */}
        <div className="fade-in-up" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              <i className="fas fa-tachometer-alt" style={{ marginRight: '12px', color: '#667eea' }}></i>
              Campaign Dashboard
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Manage and track your customer campaigns
            </p>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => nav('/create')}
            style={{ fontSize: '16px', padding: '14px 28px' }}
          >
            <i className="fas fa-plus"></i>
            Create Campaign
          </button>
        </div>

        {/* Stats Cards */}
        <div className="fade-in-left" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div className="card stagger-item" style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                  {stats.totalCampaigns}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Total Campaigns</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#667eea',
                fontSize: '20px'
              }}>
                <i className="fas fa-bullhorn"></i>
              </div>
            </div>
          </div>

          <div className="card stagger-item" style={{
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))',
            border: '1px solid rgba(79, 172, 254, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                  {stats.totalSent}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Messages Sent</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(79, 172, 254, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4facfe',
                fontSize: '20px'
              }}>
                <i className="fas fa-paper-plane"></i>
              </div>
            </div>
          </div>

          <div className="card stagger-item" style={{
            background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2), rgba(240, 147, 251, 0.2))',
            border: '1px solid rgba(245, 87, 108, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                  {stats.totalFailed}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Failed Messages</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(245, 87, 108, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f5576c',
                fontSize: '20px'
              }}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>
          </div>

          <div className="card stagger-item" style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
                  {stats.successRate}%
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Success Rate</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
                fontSize: '20px'
              }}>
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="card glass-intense fade-in-up" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fas fa-list-alt"></i>
              Your Campaigns
            </h2>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} total
            </div>
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '60px',
              color: 'white'
            }}>
              <div className="loading-spinner" style={{ marginRight: '12px' }}></div>
              Loading campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '2px dashed rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#667eea',
                fontSize: '32px'
              }}>
                <i className="fas fa-rocket"></i>
              </div>
              <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '12px' }}>
                Ready to Launch Your First Campaign?
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px', lineHeight: '1.6' }}>
                Create targeted campaigns to engage your customers with personalized messages
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => nav('/create')}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                <i className="fas fa-plus"></i>
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {campaigns.map((c, index) => (
                <div 
                  key={c._id} 
                  className="card stagger-item"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Status indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: c.stats?.sent > 0 ? '#22c55e' : '#f59e0b',
                    boxShadow: `0 0 10px ${c.stats?.sent > 0 ? '#22c55e' : '#f59e0b'}`,
                    animation: 'glow 2s ease-in-out infinite alternate'
                  }}></div>

                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      paddingRight: '24px'
                    }}>
                      <i className="fas fa-bullhorn" style={{ marginRight: '8px', color: '#667eea' }}></i>
                      {c.name}
                    </h3>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fas fa-calendar-alt"></i>
                      {formatDate(c.createdAt)}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>
                        {c.audienceSize || 0}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>
                        Audience
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#4facfe', fontSize: '20px', fontWeight: '700' }}>
                        {c.stats?.sent || 0}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>
                        Sent
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#f5576c', fontSize: '20px', fontWeight: '700' }}>
                        {c.stats?.failed || 0}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>
                        Failed
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    height: '6px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                      height: '100%',
                      width: c.audienceSize > 0 ? `${Math.min(((c.stats?.sent || 0) / c.audienceSize) * 100, 100)}%` : '0%',
                      borderRadius: '6px',
                      transition: 'width 1s ease'
                    }}></div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    <span>
                      {c.audienceSize > 0 ? Math.round(((c.stats?.sent || 0) / c.audienceSize) * 100) : 0}% delivered
                    </span>
                    <span style={{
                      background: c.stats?.sent > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: c.stats?.sent > 0 ? '#22c55e' : '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      {c.stats?.sent > 0 ? 'ACTIVE' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Dashboard Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
          {/* Recent Activity Timeline */}
          <div className="card glass-intense fade-in-up">
            <h2 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fas fa-clock"></i>
              Recent Activity
            </h2>

            {campaigns.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                <i className="fas fa-history" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
                <p>No recent activity. Create your first campaign to get started!</p>
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {campaigns.slice(0, 5).map((campaign, idx) => (
                  <div key={campaign._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    marginBottom: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    animation: `fadeInLeft 0.6s ease-out ${idx * 0.1}s both`
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: campaign.stats?.sent > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      <i className={`fas ${campaign.stats?.sent > 0 ? 'fa-check' : 'fa-clock'}`} 
                         style={{ color: 'white', fontSize: '16px' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>
                        Campaign "{campaign.name}" {campaign.stats?.sent > 0 ? 'completed' : 'created'}
                      </h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                        {formatDate(campaign.createdAt)} • {campaign.audienceSize} customers
                      </p>
                    </div>
                    <div style={{
                      background: campaign.stats?.sent > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: campaign.stats?.sent > 0 ? '#10b981' : '#f59e0b',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {campaign.stats?.sent > 0 ? 'DELIVERED' : 'PENDING'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Actions */}
            <div className="card glass-intense fade-in-up">
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-bolt"></i>
                Quick Actions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => nav('/create')}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <i className="fas fa-plus"></i>
                  Create New Campaign
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.open('/api/docs', '_blank')}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <i className="fas fa-upload"></i>
                  Import Customer Data
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={() => nav('/insights')}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <i className="fas fa-chart-line"></i>
                  View Analytics
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={fetchCampaigns}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <i className="fas fa-sync-alt"></i>
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Performance Summary Card */}
            <div className="card glass-intense fade-in-up">
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-trophy"></i>
                This Month
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                    <i className="fas fa-paper-plane" style={{ marginRight: '8px', color: '#4facfe' }}></i>
                    Messages Sent
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {stats.totalSent.toLocaleString()}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                    <i className="fas fa-users" style={{ marginRight: '8px', color: '#10b981' }}></i>
                    Campaigns
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {stats.totalCampaigns}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                    <i className="fas fa-percentage" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
                    Success Rate
                  </span>
                  <span style={{ 
                    color: stats.successRate >= 90 ? '#10b981' : stats.successRate >= 70 ? '#f59e0b' : '#ef4444', 
                    fontWeight: '600' 
                  }}>
                    {stats.successRate.toFixed(0)}%
                  </span>
                </div>
              </div>

              {stats.successRate < 90 && stats.totalCampaigns > 0 && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px'
                }}>
                  <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    💡 Tip
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', lineHeight: '1.4' }}>
                    Consider refining your audience targeting to improve delivery rates.
                  </div>
                </div>
              )}
            </div>

            {/* Help & Resources */}
            <div className="card glass-intense fade-in-up">
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-question-circle"></i>
                Need Help?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  <i className="fas fa-book"></i>
                  Documentation
                </a>
                
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  <i className="fas fa-video"></i>
                  Video Tutorials
                </a>
                
                <a href="#" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  <i className="fas fa-life-ring"></i>
                  Get Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        {campaigns.length === 0 && (
          <div className="card glass-intense fade-in-up" style={{
            marginTop: '32px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1))',
            border: '1px solid rgba(79, 70, 229, 0.3)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #10b981)',
              marginBottom: '24px'
            }}>
              <i className="fas fa-rocket" style={{ fontSize: '32px', color: 'white' }}></i>
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '12px'
            }}>
              Ready to Launch Your First Campaign?
            </h2>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px'
            }}>
              Create targeted campaigns, reach your customers with personalized messages, and track your success in real-time.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => nav('/create')}
                style={{ fontSize: '16px', padding: '14px 28px' }}
              >
                <i className="fas fa-plus"></i>
                Create Campaign
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => window.open('/api/docs', '_blank')}
                style={{ fontSize: '16px', padding: '14px 28px' }}
              >
                <i className="fas fa-database"></i>
                Import Data
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}