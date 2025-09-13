
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function emptyCond() {
  return { field: 'totalSpend', op: '>', value: 1000 };
}

export default function CampaignBuilder(){
  const [name, setName] = useState('My Campaign');
  const [message, setMessage] = useState("Hi {name}, here's 10% off on your next order!");

  const [operator, setOperator] = useState('AND');
  const [conditions, setConditions] = useState([ emptyCond() ]);
  const [preview, setPreview] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const nav = useNavigate();

  function updateCond(i, k, v){
    const c = [...conditions];
    c[i] = { ...c[i], [k]: v };
    setConditions(c);
    // Clear preview when conditions change
    setPreview(null);
    setShowPreview(false);
  }

  function addCond(){ 
    setConditions([...conditions, emptyCond()]);
  }
  
  function removeCond(i){ 
    setConditions(conditions.filter((_,idx)=>idx!==i));
    // Clear preview when conditions change
    setPreview(null);
    setShowPreview(false);
  }

  async function doPreview(){
    setIsPreviewLoading(true);
    try {
      const rules = { operator, conditions };
      const r = await api.post('/api/segments/preview', { rules });
      setPreview(r.data);
      setShowPreview(true);
    } catch (error) {
      alert('Error previewing audience: ' + error.message);
    } finally {
      setIsPreviewLoading(false);
    }
  }

  async function saveSegment(){
    setIsSaving(true);
    try {
      const rules = { operator, conditions };
      const r = await api.post('/api/segments', { name, rules, messageTemplate: message });
      alert('✅ Campaign created successfully! Audience: ' + r.data.audienceSize);
      nav('/dashboard');
    } catch (error) {
      alert('Error creating campaign: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const fieldOptions = [
    { value: 'totalSpend', label: 'Total Spend (₹)', icon: 'fa-rupee-sign' },
    { value: 'visits', label: 'Visit Count', icon: 'fa-eye' },
    { value: 'lastOrderDate', label: 'Last Order Date', icon: 'fa-calendar' },
    { value: 'email', label: 'Email Address', icon: 'fa-envelope' }
  ];

  const operatorOptions = [
    { value: '>', label: 'Greater than', icon: 'fa-greater-than' },
    { value: '>=', label: 'Greater or equal', icon: 'fa-greater-than-equal' },
    { value: '<', label: 'Less than', icon: 'fa-less-than' },
    { value: '<=', label: 'Less or equal', icon: 'fa-less-than-equal' },
    { value: '==', label: 'Equals', icon: 'fa-equals' },
    { value: '!=', label: 'Not equals', icon: 'fa-not-equal' },
    { value: 'contains', label: 'Contains', icon: 'fa-search' }
  ];

  return (
    <>
      <div className="background-particles">
        {[...Array(30)].map((_, i) => (
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
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <button 
              className="btn btn-secondary"
              onClick={() => nav('/dashboard')}
              style={{ marginBottom: '16px' }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              <i className="fas fa-magic" style={{ marginRight: '12px', color: '#667eea' }}></i>
              Campaign Builder
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Create targeted campaigns with intelligent audience segmentation
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: showPreview ? '1fr 400px' : '1fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Main Form */}
          <div className="card glass-intense fade-in-left">
            <h2 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fas fa-cog"></i>
              Campaign Configuration
            </h2>

            {/* Campaign Name */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                <i className="fas fa-tag" style={{ marginRight: '8px', color: '#667eea' }}></i>
                Campaign Name
              </label>
              <input 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                placeholder="Enter campaign name..."
                style={{ width: '100%' }}
              />
            </div>

            {/* Message Template */}
            
            <div style={{ marginBottom: '24px' }}>
                <label>Message Template</label>
                    <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    style={{ width: "100%" }}
                    />

                <button
                className="btn btn-secondary"
                onClick={async () => {
                const r = await api.post("/api/ai/suggest-messages", {
                objective: "bring back inactive users"
                });
                const suggestions = r.data.suggestions;
                if (suggestions && suggestions.length) {
                    alert("AI Suggestions:\n\n" + suggestions.join("\n\n"));
                    // optional: auto-pick first
                    setMessage(suggestions[0]);
                }
                }}
                style={{ marginTop: "8px" }}
                >
                ✨ Suggest Messages
            </button>
            </div>


            {/* Logical Operator */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                <i className="fas fa-link" style={{ marginRight: '8px', color: '#667eea' }}></i>
                Condition Logic
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className={`btn ${operator === 'AND' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setOperator('AND')}
                  style={{ flex: 1 }}
                >
                  AND (All conditions must match)
                </button>
                <button
                  className={`btn ${operator === 'OR' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setOperator('OR')}
                  style={{ flex: 1 }}
                >
                  OR (Any condition can match)
                </button>
              </div>
            </div>

            {/* Conditions */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <label style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <i className="fas fa-filter" style={{ color: '#667eea' }}></i>
                  Audience Conditions
                </label>
                <button 
                  className="btn btn-success"
                  onClick={addCond}
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                >
                  <i className="fas fa-plus"></i>
                  Add Condition
                </button>
              </div>

              {conditions.map((c, i)=> (
                <div 
                  key={i} 
                  className="stagger-item"
                  style={{
                    marginBottom: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    position: 'relative'
                  }}
                >
                  {/* Condition number indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '16px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}>
                    Condition {i + 1}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '12px',
                    alignItems: 'end',
                    marginTop: '8px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        marginBottom: '4px'
                      }}>Field</label>
                      <select 
                        value={c.field} 
                        onChange={e=>updateCond(i,'field', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {fieldOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        marginBottom: '4px'
                      }}>Operator</label>
                      <select 
                        value={c.op} 
                        onChange={e=>updateCond(i,'op', e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {operatorOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        marginBottom: '4px'
                      }}>Value</label>
                      <input 
                        value={c.value} 
                        onChange={e=>updateCond(i,'value', e.target.value)}
                        placeholder={c.field === 'lastOrderDate' ? 'YYYY-MM-DD' : 'Enter value...'}
                        style={{ width: '100%' }}
                      />
                    </div>

                    <button 
                      onClick={()=>removeCond(i)} 
                      disabled={conditions.length === 1}
                      style={{
                        padding: '12px',
                        background: conditions.length === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(245, 87, 108, 0.2)',
                        color: conditions.length === 1 ? 'rgba(255, 255, 255, 0.3)' : '#f5576c',
                        border: '1px solid ' + (conditions.length === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(245, 87, 108, 0.3)'),
                        borderRadius: '8px',
                        cursor: conditions.length === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                      }}
                      title={conditions.length === 1 ? 'At least one condition is required' : 'Remove this condition'}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button 
                className="btn btn-secondary"
                onClick={doPreview}
                disabled={isPreviewLoading}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                {isPreviewLoading && <div className="loading-spinner"></div>}
                <i className="fas fa-eye"></i>
                Preview Audience
              </button>
              
              <button 
                className="btn btn-success"
                onClick={saveSegment}
                disabled={isSaving || !name.trim()}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                {isSaving && <div className="loading-spinner"></div>}
                <i className="fas fa-rocket"></i>
                Launch Campaign
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && preview && (
            <div className="card glass-intense fade-in-up" style={{ position: 'sticky', top: '24px' }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-users"></i>
                Audience Preview
              </h3>

              <div style={{
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#4facfe',
                  marginBottom: '4px'
                }}>
                  {preview.count}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px'
                }}>
                  Customers match your criteria
                </div>
              </div>

              {preview.sample && preview.sample.length > 0 && (
                <>
                  <h4 style={{
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-search"></i>
                    Sample Customers:
                  </h4>
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    {preview.sample.map((customer, idx) => (
                      <div key={idx} style={{
                        padding: '12px',
                        marginBottom: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <i className="fas fa-user" style={{ color: '#667eea' }}></i>
                          <strong>{customer.name || 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          <div>📧 {customer.email || 'N/A'}</div>
                          <div>💰 Spend: ₹{customer.totalSpend || 0}</div>
                          <div>👀 Visits: {customer.visits || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {preview.count === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '24px',
                  background: 'rgba(245, 87, 108, 0.1)',
                  border: '1px solid rgba(245, 87, 108, 0.3)',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: '24px', color: '#f5576c', marginBottom: '8px' }}></i>
                  <div style={{ fontSize: '14px' }}>
                    No customers match these conditions.
                    <br />
                    Try adjusting your criteria.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="card glass fade-in-up" style={{ marginTop: '24px' }}>
          <h3 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-lightbulb" style={{ color: '#f59e0b' }}></i>
            Pro Tips for Better Campaigns
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#667eea', fontSize: '16px', marginBottom: '8px' }}>
                <i className="fas fa-target"></i>
              </div>
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>Segment Wisely</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', lineHeight: '1.4' }}>
                Target customers based on spending patterns and engagement history for better results.
              </p>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(79, 172, 254, 0.1)',
              border: '1px solid rgba(79, 172, 254, 0.2)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#4facfe', fontSize: '16px', marginBottom: '8px' }}>
                <i className="fas fa-edit"></i>
              </div>
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>Personalize Messages</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', lineHeight: '1.4' }}>
                Use {"{name}"} and {"{spend}"} placeholders to create personalized, engaging messages.
              </p>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#22c55e', fontSize: '16px', marginBottom: '8px' }}>
                <i className="fas fa-clock"></i>
              </div>
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '4px' }}>Test & Optimize</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', lineHeight: '1.4' }}>
                Preview your audience size and sample before launching to ensure optimal reach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
