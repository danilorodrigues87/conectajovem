/**
 * Marca e conteúdo do portal (Master editará depois via API de branding).
 */
export const site = {
  name: 'Conecta Jovem',
  tagline: 'Seu talento conectado às melhores oportunidades',
  domain: 'conectajovem.com.br',
  description:
    'Plataforma de empregabilidade que conecta jovens talentos a empresas parceiras. Vagas de aprendizagem, estágio, CLT e freelance.',
  hero: {
    eyebrow: 'Empregabilidade · Talentos · Oportunidades',
    title: 'Seu primeiro passo no mercado começa aqui',
    subtitle:
      'Vagas de aprendizagem, estágio e CLT perto de você — com perfil gratuito, selo de formação das escolas parceiras e empresas que contratam na sua região.',
    ctaPrimary: 'Explorar vagas',
    ctaSecondary: 'Sou empresa parceira',
  },
  stats: [
    { value: '500+', label: 'Vagas publicadas' },
    { value: '120+', label: 'Empresas parceiras' },
    { value: '50+', label: 'Cidades atendidas' },
  ],
  jobTypes: [
    { label: 'Jovem Aprendiz', value: 'aprendiz' },
    { label: 'Estágio', value: 'estagio' },
    { label: 'CLT', value: 'clt' },
    { label: 'Freelance', value: 'freelance' },
  ],
  steps: [
    {
      title: 'Crie seu perfil',
      text: 'Cadastro gratuito com currículo simplificado e habilidades em destaque.',
    },
    {
      title: 'Encontre a vaga ideal',
      text: 'Filtre por cidade, empresa parceira e tipo de oportunidade.',
    },
    {
      title: 'Conecte-se',
      text: 'Candidate-se online e acompanhe cada etapa do processo.',
    },
  ],
  valueProps: [
    {
      title: '100% gratuito para candidatos',
      text: 'Crie perfil, candidate-se e acompanhe processos sem pagar nada.',
    },
    {
      title: 'Empresas parceiras locais',
      text: 'Oportunidades reais de quem contrata na sua cidade e região.',
    },
    {
      title: 'Selo das escolas parceiras',
      text: 'Formação verificada enriquece seu perfil e aumenta visibilidade.',
    },
  ],
  audiences: [
    {
      id: 'candidate',
      badge: 'Para jovens talentos',
      title: 'Construa sua trajetória profissional',
      text: 'Monte um perfil que destaca suas habilidades, encontre vagas alinhadas ao seu momento de carreira e candidate-se em poucos cliques.',
      benefits: [
        'Perfil gratuito e currículo simplificado',
        'Filtros por cidade, tipo de vaga e modalidade',
        'Selo de formação quando indicado por escola parceira',
      ],
      cta: 'Criar meu perfil',
      ctaLink: '/cadastro',
      imageKey: 'candidate' as const,
    },
    {
      id: 'company',
      badge: 'Empresas parceiras',
      title: 'Contrate talentos da sua região',
      text: 'Publique vagas, receba candidaturas qualificadas e encontre jovens preparados — com apoio das escolas parceiras da rede.',
      benefits: [
        'Publicação rápida de vagas',
        'Candidatos com perfil e formação verificada',
        'Gestão centralizada no painel da empresa',
      ],
      cta: 'Cadastrar minha empresa',
      ctaLink: '/cadastro/empresa',
      imageKey: 'company' as const,
    },
    {
      id: 'school',
      badge: 'Escolas parceiras',
      title: 'Formação que vira oportunidade',
      text: 'Indique alunos formados e certificados para enriquecer perfis com selo verificado, conectando educação ao mercado de trabalho.',
      benefits: [
        'Selo "Aluno certificado" no perfil',
        'Indicação de talentos formados na instituição',
        'Ponte entre sala de aula e empregabilidade',
      ],
      cta: 'Saiba como funciona',
      ctaLink: '/como-funciona',
      imageKey: 'school' as const,
    },
  ],
  differentials: [
    {
      icon: '🎯',
      title: 'Foco regional',
      text: 'Vagas e empresas parceiras perto de você — empregabilidade com contexto local.',
    },
    {
      icon: '✓',
      title: 'Selo Aluno certificado',
      text: 'Escolas parceiras validam formação e destacam perfis preparados para o mercado.',
    },
    {
      icon: '⚡',
      title: 'Candidatura online',
      text: 'Processo digital, sem burocracia: candidate-se direto pela plataforma.',
    },
    {
      icon: '🔒',
      title: 'Gratuito para candidatos',
      text: 'Sem taxas escondidas. Seu perfil e candidaturas são sempre gratuitos.',
    },
  ],
  testimonials: [
    {
      quote:
        'Encontrei meu primeiro estágio em menos de duas semanas. Os filtros por cidade facilitaram muito a busca.',
      name: 'Mariana S.',
      role: 'Estudante de Administração',
      avatarIndex: 0,
    },
    {
      quote:
        'Publicamos três vagas de aprendiz e recebemos candidatos qualificados com formação verificada pelas escolas parceiras.',
      name: 'Ricardo M.',
      role: 'Gestor de RH — empresa parceira',
      avatarIndex: 1,
    },
    {
      quote:
        'O selo de certificação ajuda nossos alunos a se destacarem. A ponte entre formação e emprego ficou muito mais clara.',
      name: 'Prof. Ana L.',
      role: 'Coordenadora — escola parceira',
      avatarIndex: 2,
    },
  ],
  faq: [
    {
      question: 'O Conecta Jovem é gratuito para candidatos?',
      answer:
        'Sim. Criar perfil, buscar vagas e se candidatar é totalmente gratuito para jovens talentos.',
    },
    {
      question: 'Quais tipos de vaga posso encontrar?',
      answer:
        'Aprendizagem, estágio, CLT e freelance — publicadas por empresas parceiras verificadas na plataforma.',
    },
    {
      question: 'O que é o selo "Aluno certificado"?',
      answer:
        'É um destaque no perfil de candidatos indicados por escolas parceiras, com formação verificada pela instituição.',
    },
    {
      question: 'Como minha empresa publica vagas?',
      answer:
        'Cadastre-se como empresa parceira, aguarde aprovação e acesse o painel para criar e gerenciar vagas.',
    },
    {
      question: 'Como escolas parceiras participam?',
      answer:
        'Escolas parceiras indicam alunos formados e certificados, enriquecendo perfis com selo de formação verificada.',
    },
    {
      question: 'Meus dados estão protegidos?',
      answer:
        'Sim. Seus dados são usados apenas para conectar candidatos a oportunidades e empresas parceiras dentro da plataforma.',
    },
  ],
  partners: {
    schoolsLabel: 'Escolas parceiras',
    schoolsText:
      'Instituições de ensino parceiras indicam alunos formados e certificados, enriquecendo perfis com selo de formação verificada.',
    companiesLabel: 'Empresas parceiras',
    companiesText:
      'Empresas locais publicam vagas, encontram talentos qualificados e contratam com agilidade.',
  },
  featuredJobs: {
    title: 'Vagas em destaque',
    subtitle: 'Oportunidades recentes de empresas parceiras na plataforma.',
    cta: 'Ver todas as vagas',
  },
  finalCta: {
    title: 'Pronto para dar o próximo passo?',
    subtitle:
      'Crie seu perfil gratuitamente e descubra vagas de empresas parceiras perto de você.',
    primary: 'Criar meu perfil',
    secondary: 'Ver vagas abertas',
  },
  footer:
    '© Conecta Jovem — Plataforma de empregabilidade. Escolas e empresas parceiras.',
  badgeCertified: 'Aluno certificado',
  about:
    'O Conecta Jovem é a plataforma que conecta jovens talentos a empresas parceiras, com o apoio de escolas parceiras que enriquecem perfis com formação verificada.',
} as const;
