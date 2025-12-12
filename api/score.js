import { ImageResponse } from 'next/og';

export const config = {
  runtime: 'edge',
};

function getScoreColor(score) {
  if (score <= 300) return '#E53935';
  if (score <= 500) return '#FF9800';
  if (score <= 700) return '#FDD835';
  return '#43A047';
}

function getScoreLabel(score) {
  if (score <= 300) return 'Baixo';
  if (score <= 500) return 'Regular';
  if (score <= 700) return 'Bom';
  return 'Excelente';
}

function formatCPF(cpf) {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  
  const cpf = searchParams.get('cpf') || '000.000.000-00';
  const nome = searchParams.get('nome') || 'Nome não informado';
  const scoreParam = searchParams.get('score') || '0';
  const score = Math.min(1000, Math.max(0, parseInt(scoreParam) || 0));
  
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: '600px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 30px',
            background: 'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: '700' }}>
              Serasa
            </span>
            <span style={{ color: '#F8BBD9', fontSize: '12px' }}>
              Score de Crédito
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
            }}
          >
            <span style={{ color: '#FFFFFF', fontSize: '12px' }}>
              Consulta Online
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '25px 30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
              <span style={{ color: '#9E9E9E', fontSize: '11px', textTransform: 'uppercase' }}>
                Nome
              </span>
              <span style={{ color: '#212121', fontSize: '18px', fontWeight: '600' }}>
                {nome}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <span style={{ color: '#9E9E9E', fontSize: '11px', textTransform: 'uppercase' }}>
                CPF
              </span>
              <span style={{ color: '#212121', fontSize: '16px', fontWeight: '500' }}>
                {formatCPF(cpf)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#9E9E9E', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Faixa de Score
              </span>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: '30%', backgroundColor: '#E53935', height: '100%' }} />
                <div style={{ width: '20%', backgroundColor: '#FF9800', height: '100%' }} />
                <div style={{ width: '20%', backgroundColor: '#FDD835', height: '100%' }} />
                <div style={{ width: '30%', backgroundColor: '#43A047', height: '100%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#757575', marginTop: '4px' }}>
                <span>0</span>
                <span>300</span>
                <span>500</span>
                <span>700</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '180px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '140px',
                height: '140px',
                borderRadius: '70px',
                border: `8px solid ${scoreColor}`,
                backgroundColor: '#FAFAFA',
              }}
            >
              <span
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: scoreColor,
                }}
              >
                {score}
              </span>
              <span style={{ fontSize: '12px', color: '#757575' }}>
                de 1000
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: '12px',
                padding: '6px 16px',
                backgroundColor: scoreColor,
                borderRadius: '12px',
              }}
            >
              <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '600' }}>
                {scoreLabel}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 30px',
            backgroundColor: '#F5F5F5',
            borderTop: '1px solid #E0E0E0',
          }}
        >
          <span style={{ color: '#9E9E9E', fontSize: '10px' }}>
            Consulta realizada em {new Date().toLocaleDateString('pt-BR')}
          </span>
          <span style={{ color: '#E91E63', fontSize: '10px', fontWeight: '600' }}>
            serasa.com.br
          </span>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}
