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
  const hoje = new Date().toLocaleDateString('pt-BR');

  const svg = `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E91E63"/>
      <stop offset="100%" style="stop-color:#AD1457"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="600" height="400" fill="#FFFFFF"/>
  
  <!-- Header -->
  <rect width="600" height="80" fill="url(#headerGrad)"/>
  <text x="30" y="42" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF">Serasa</text>
  <text x="30" y="62" font-family="Arial, sans-serif" font-size="12" fill="#F8BBD9">Score de Crédito</text>
  <rect x="480" y="25" width="100" height="30" rx="15" fill="rgba(255,255,255,0.2)"/>
  <text x="495" y="45" font-family="Arial, sans-serif" font-size="11" fill="#FFFFFF">Consulta Online</text>
  
  <!-- Nome -->
  <text x="30" y="115" font-family="Arial, sans-serif" font-size="11" fill="#9E9E9E">NOME</text>
  <text x="30" y="138" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#212121">${nome}</text>
  
  <!-- CPF -->
  <text x="30" y="175" font-family="Arial, sans-serif" font-size="11" fill="#9E9E9E">CPF</text>
  <text x="30" y="198" font-family="Arial, sans-serif" font-size="16" font-weight="500" fill="#212121">${formatCPF(cpf)}</text>
  
  <!-- Barra de Score -->
  <text x="30" y="245" font-family="Arial, sans-serif" font-size="11" fill="#9E9E9E">FAIXA DE SCORE</text>
  <rect x="30" y="255" width="90" height="12" rx="2" fill="#E53935"/>
  <rect x="120" y="255" width="60" height="12" fill="#FF9800"/>
  <rect x="180" y="255" width="60" height="12" fill="#FDD835"/>
  <rect x="240" y="255" width="90" height="12" rx="2" fill="#43A047"/>
  <text x="30" y="282" font-family="Arial, sans-serif" font-size="10" fill="#757575">0</text>
  <text x="110" y="282" font-family="Arial, sans-serif" font-size="10" fill="#757575">300</text>
  <text x="170" y="282" font-family="Arial, sans-serif" font-size="10" fill="#757575">500</text>
  <text x="230" y="282" font-family="Arial, sans-serif" font-size="10" fill="#757575">700</text>
  <text x="310" y="282" font-family="Arial, sans-serif" font-size="10" fill="#757575">1000</text>
  
  <!-- Score Circle -->
  <circle cx="480" cy="200" r="70" fill="#FAFAFA" stroke="${scoreColor}" stroke-width="8"/>
  <text x="480" y="195" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="${scoreColor}" text-anchor="middle">${score}</text>
  <text x="480" y="220" font-family="Arial, sans-serif" font-size="12" fill="#757575" text-anchor="middle">de 1000</text>
  
  <!-- Score Label -->
  <rect x="440" y="285" width="80" height="28" rx="14" fill="${scoreColor}"/>
  <text x="480" y="304" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${scoreLabel}</text>
  
  <!-- Footer -->
  <rect y="360" width="600" height="40" fill="#F5F5F5"/>
  <line x1="0" y1="360" x2="600" y2="360" stroke="#E0E0E0"/>
  <text x="30" y="385" font-family="Arial, sans-serif" font-size="10" fill="#9E9E9E">Consulta realizada em ${hoje}</text>
  <text x="520" y="385" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#E91E63">serasa.com.br</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=0',
    },
  });
}
