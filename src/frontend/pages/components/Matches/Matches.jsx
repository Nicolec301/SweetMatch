import React, { useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import Header from '../Header';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ApiService.getMatches();
        setMatches(res.data || res.matches || []);
      } catch (e) {
        setError(e.message || 'Error cargando matches');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="matches-page">
      <Header />
      <div className="matches-container">
        <h1>Mis Matches</h1>
        {loading && <p>Cargando...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        {!loading && matches.length === 0 && !error && <p>Aún no tienes matches.</p>}
        <div className="matches-grid">
          {matches.map(m => (
            <div key={m.id} className="match-card">
              <div className="match-avatar">
                <img src={m.foto_principal || m.foto || '/images/default-avatar.png'} alt={m.nombre} />
              </div>
              <div className="match-info">
                <h3 className="match-name">{m.nombre}</h3>
                {m.intereses && Array.isArray(m.intereses) && (
                  <div className="match-interests">
                    {m.intereses.slice(0,4).map((i,idx)=>(
                      <span key={idx} className="interest-tag">{typeof i==='string'?i:i.nombre||i.id}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
