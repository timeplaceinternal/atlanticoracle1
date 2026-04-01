import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface OfferData {
  legalName: string;
  channelName: string;
  audience: string;
  email: string;
  language: 'English' | 'Portuguese';
}

export const generateDealerOffer = (data: OfferData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const isPT = data.language === 'Portuguese';

  // Colors
  const bgColor = [253, 251, 247]; // #FDFBF7 (Light Beige)
  const textColor = [51, 51, 51];   // #333333 (Dark Grey)
  const accentColor = [197, 160, 89]; // #C5A059 (Cosmic Gold)

  // Page Background
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.rect(0, 0, 210, 297, 'F');

  // Header
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  const title = isPT 
    ? 'ATLANTIC ORACLE' 
    : 'ATLANTIC ORACLE';
  doc.text(title, 105, 25, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const subtitle = isPT
    ? 'TECNOLOGIA EUROPEIA PARA MAXIMIZAR A RENTABILIDADE DO SEU PÚBLICO'
    : 'EUROPEAN TECHNOLOGY TO MAXIMIZE YOUR AUDIENCE PROFITABILITY';
  doc.text(subtitle, 105, 32, { align: 'center' });

  // Divider
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Content
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  const greeting = isPT 
    ? `Olá ${data.legalName}!` 
    : `Hello ${data.legalName}!`;
  doc.text(greeting, 20, 55);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const intro = isPT
    ? `Meu nome é Oleg Sugrobov e sou o fundador do Atlantic Oracle, um serviço de análise de alta tecnologia com sede em Portugal (UE). Selecionamos o seu perfil devido à sua estética refinada e à alta qualidade do seu público, que acreditamos ter uma sinergia perfeita com a nossa plataforma.`
    : `My name is Oleg Sugrobov, and I am the founder of Atlantic Oracle, a high-tech analytics service based in Portugal (EU). We have selected your profile due to your refined aesthetic and the high quality of your audience, which we believe has perfect synergy with our platform.`;
  
  const splitIntro = doc.splitTextToSize(intro, 170);
  doc.text(splitIntro, 20, 65);

  let y = 65 + (splitIntro.length * 5) + 5;

  const sections = isPT ? [
    {
      title: '1. O QUE É O ATLANTIC ORACLE?',
      content: 'O Atlantic Oracle é um ecossistema abrangente projetado para fornecer relatórios personalizados de alta precisão nas áreas de Astrologia e Numerologia.\n\nProduto Premium: Combinamos algoritmos complexos de análise de dados com Design de Alto Nível. Entregamos relatórios detalhados (15+ páginas) com uma estética profissional.\n\nFoco na Monetização: Nossa plataforma foi construída como uma ferramenta profissional para criadores que desejam monetizar seus canais com produtos de alta demanda.'
    },
    {
      title: '2. POR QUE ESTA PARCERIA É IDEAL PARA VOCÊ?',
      content: 'Status e Fidelidade: Oferecemos um cupom exclusivo de 50% de desconto para seus seguidores. Você entrega um benefício de elite para sua comunidade.\n\nAlta Conversão via PIX: Com nosso design premium e integração perfeita com o PIX (Brasil), garantimos a conversão máxima.\n\nSinergia de Marca: Automatizamos a entrega de relatórios complexos enquanto você se concentra em seu conteúdo.'
    },
    {
      title: '3. NOSSA FILOSOFIA: O PRINCÍPIO GANHA-GANHA',
      content: 'Nosso valor fundamental é o Ganha-Ganha. Acreditamos firmemente que uma parceria justa e lucrativa para ambos os lados é a única chave para a prosperidade a longo prazo.'
    },
    {
      title: '4. ESTIMATIVAS DE LUCRO (Exemplo: 100 mil seguidores)',
      content: 'Vendas: 500 relatórios/mês (Taxa de 0.5%).\nSeu Lucro Líquido: Média de €4,50 a €14,00 por venda.\nTotal Mensal Estimado: ~€3.500,00 (aprox. R$ 21.500,00).'
    }
  ] : [
    {
      title: '1. WHAT IS ATLANTIC ORACLE?',
      content: 'Atlantic Oracle is a comprehensive ecosystem designed to provide high-precision, personalized reports in the fields of Astrology and Numerology.\n\nPremium Product: We combine complex data analysis algorithms with High-End Design. We deliver in-depth reports (15+ pages) with a professional aesthetic.\n\nMonetization Focus: Our platform was built as a professional tool for creators who want to monetize their SMM channels.'
    },
    {
      title: '2. WHY IS THIS PARTNERSHIP IDEAL FOR YOU?',
      content: 'Status and Loyalty: We provide an exclusive 50% OFF coupon for your followers. You deliver an elite benefit to your community.\n\nHigh Conversion via PIX: With our premium design and seamless PIX integration (Brazil), we ensure maximum conversion.\n\nBranding Synergy: We automate the delivery of complex reports while you focus on your creative content.'
    },
    {
      title: '3. OUR PHILOSOPHY: THE WIN-WIN PRINCIPLE',
      content: 'Our core value is Win-to-Win. We firmly believe that a fair and profitable partnership for both sides is the only key to long-term prosperity.'
    },
    {
      title: '4. PROFIT ESTIMATES (Example: 100k Followers)',
      content: 'Sales: 500 reports/month (0.5% conversion).\nYour Net Profit: Average of €4.50 to €14.00 per sale.\nEstimated Monthly Total: ~€3,500.00 (approx. R$ 21,500.00).'
    }
  ];

  sections.forEach(section => {
    if (y > 260) {
      doc.addPage();
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(0, 0, 210, 297, 'F');
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 20, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content, 170);
    doc.text(lines, 20, y);
    y += (lines.length * 5) + 10;
  });

  // Footer / Next Steps
  if (y > 240) {
    doc.addPage();
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(0, 0, 210, 297, 'F');
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.text(isPT ? 'PRÓXIMOS PASSOS' : 'NEXT STEPS', 20, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  const finalMsg = isPT
    ? 'Gostaria de revisar uma amostra de nossos relatórios? Basta responder a esta mensagem ou contactar-me diretamente através do meu WhatsApp pessoal: +351 926 160 750.'
    : 'Would you like to review a sample of our reports? Simply reply to this message or contact me directly via my personal WhatsApp: +351 926 160 750.';
  
  const finalLines = doc.splitTextToSize(finalMsg, 170);
  doc.text(finalLines, 20, y);
  
  y += (finalLines.length * 5) + 15;
  doc.text(isPT ? 'Atenciosamente,' : 'Best regards,', 20, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Oleg Sugrobov', 20, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(isPT ? 'Fundador, Equipe Atlantic Oracle' : 'Founder, Atlantic Oracle Team', 20, y);

  // Save the PDF
  doc.save(`Atlantic_Oracle_Offer_${data.legalName.replace(/\s+/g, '_')}.pdf`);
};
