import type { LegalSection } from '../../components/LegalDocumentLayout';
import { site } from '../../config/site';

export const privacidadeMeta = {
  badge: 'Institucional',
  title: 'Política de Privacidade',
  updatedAt: '22 de agosto de 2026',
  intro:
    'Esta Política descreve como o Conecta Jovem trata dados pessoais de candidatos, empresas parceiras e visitantes, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
};

export const privacidadeSections: LegalSection[] = [
  {
    id: 'controlador',
    title: '1. Quem somos (controlador)',
    paragraphs: [
      `O ${site.contact.orgName} é o responsável pelo tratamento de dados pessoais coletados por meio do site ${site.domain} e de sua plataforma de empregabilidade.`,
      `Endereço: ${site.contact.address}. E-mail para privacidade e titulares de dados: ${site.contact.email}.`,
    ],
  },
  {
    id: 'dados',
    title: '2. Quais dados coletamos',
    paragraphs: ['Dependendo do seu perfil e do uso da plataforma, podemos tratar:'],
    list: [
      'Dados de identificação e contato: nome, e-mail, telefone/WhatsApp, endereço, cidade e foto de perfil.',
      'Links de redes sociais opcionais informados voluntariamente em perfis de candidatos e empresas (LinkedIn, Instagram, GitHub, portfólio etc.).',
      'Dados profissionais: currículo simplificado, habilidades, formação acadêmica, experiências, disponibilidade e mensagens de candidatura.',
      'Dados de empresas: CNPJ, razão social, nome fantasia, logo, contatos comerciais e vagas publicadas.',
      'Dados de escolas parceiras (quando aplicável): indicações de formação certificada vinculadas a perfis de candidatos.',
      'Dados técnicos: endereço IP (apenas em logs transitórios de segurança), data e hora de acesso, logs de segurança, cookies essenciais e preferências (ex.: tema claro/escuro).',
      'Medição de uso do portal (analytics first-party): identificador anônimo gerado no navegador (`cj_visitor_id` em localStorage), páginas visitadas e cliques em compartilhamento de artigos do blog. Não utilizamos Google Analytics nem pixels de terceiros para esse fim; o endereço IP não é armazenado nas tabelas de analytics.',
      'Dados do formulário de contato: nome, e-mail, WhatsApp (opcional), assunto e conteúdo da mensagem.',
      'Comentários no blog: nome de exibição, tipo de perfil (candidato ou empresa), texto do comentário e data, visíveis publicamente no artigo.',
    ],
  },
  {
    id: 'finalidades',
    title: '3. Finalidades do tratamento',
    paragraphs: ['Utilizamos os dados para:'],
    list: [
      'Permitir cadastro, autenticação e uso das funcionalidades da plataforma.',
      'Conectar candidatos a vagas e empresas parceiras, inclusive exibição de perfis e currículos.',
      'Permitir que empresas gerenciem vagas, candidaturas e busca de talentos.',
      'Enriquecer perfis com selo de formação verificada por escolas parceiras, quando aplicável.',
      'Enviar comunicações operacionais (ex.: status de candidatura, aprovação de cadastro).',
      'Responder solicitações enviadas pelo formulário de contato.',
      'Publicar e moderar conteúdo institucional do blog e permitir interação por meio de comentários de usuários logados.',
      'Prevenir fraudes, garantir segurança e cumprir obrigações legais.',
      'Melhorar a experiência e desempenho do site.',
      'Medir tráfego agregado do portal (pageviews, visitantes únicos e compartilhamentos) para relatórios internos, sem perfilamento publicitário.',
    ],
  },
  {
    id: 'bases',
    title: '4. Bases legais (LGPD)',
    paragraphs: ['O tratamento pode se fundamentar em:'],
    list: [
      'Execução de contrato ou procedimentos preliminares (cadastro e uso da plataforma).',
      'Consentimento (quando solicitado de forma específica, ex.: comunicações opcionais).',
      'Legítimo interesse (segurança, melhoria do serviço, prevenção a abusos), respeitados direitos do titular.',
      'Cumprimento de obrigação legal ou regulatória.',
    ],
  },
  {
    id: 'compartilhamento',
    title: '5. Compartilhamento de dados',
    paragraphs: [
      'Dados de candidatos podem ser exibidos a empresas parceiras no contexto de candidaturas, busca de talentos ou vagas compatíveis, conforme configurações e fluxos da plataforma.',
      'Links de redes sociais opcionais podem ser exibidos em currículos, perfis públicos de empresas e demais telas da plataforma quando preenchidos pelo titular.',
      'Podemos compartilhar dados com prestadores de infraestrutura (hospedagem, e-mail, armazenamento) estritamente para operar o serviço, sob confidencialidade.',
      'Não vendemos dados pessoais. Compartilhamentos por ordem judicial ou autoridade competente podem ocorrer quando exigidos por lei.',
    ],
  },
  {
    id: 'retencao',
    title: '6. Retenção e eliminação',
    paragraphs: [
      'Mantemos os dados enquanto a conta estiver ativa ou enquanto necessário para as finalidades descritas, resolução de disputas e cumprimento legal.',
      'Após encerramento de conta ou solicitação válida, adotaremos medidas para eliminar ou anonimizar dados, salvo retenção permitida ou exigida por lei.',
    ],
  },
  {
    id: 'direitos',
    title: '7. Direitos do titular',
    paragraphs: [
      'Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamentos e revogação de consentimento, quando aplicável.',
      `Envie pedidos para ${site.contact.email}, informando seu nome, e-mail cadastrado e descrição do pedido. Responderemos em prazo razoável, conforme a legislação.`,
    ],
  },
  {
    id: 'seguranca',
    title: '8. Segurança',
    paragraphs: [
      'Adotamos medidas técnicas e organizacionais para proteger dados contra acesso não autorizado, perda ou alteração indevida, incluindo controle de acesso, comunicação criptografada (HTTPS) e boas práticas de desenvolvimento.',
      'Nenhum sistema é totalmente imune a riscos; em caso de incidente relevante, adotaremos medidas de mitigação e comunicação conforme exigido pela LGPD.',
    ],
  },
  {
    id: 'cookies',
    title: '9. Cookies e tecnologias similares',
    paragraphs: [
      'Utilizamos cookies essenciais para funcionamento do site (sessão, preferências) e armazenamento local para autenticação, tema visual e identificador anônimo de analytics (`cj_visitor_id`).',
      'Você pode gerenciar cookies no navegador; a desativação de cookies essenciais pode limitar funcionalidades.',
    ],
  },
  {
    id: 'menores',
    title: '10. Crianças e adolescentes',
    paragraphs: [
      'A plataforma destina-se principalmente a jovens em busca de oportunidades profissionais. Quando aplicável, o tratamento de dados de menores observará as exigências legais e o melhor interesse do titular.',
    ],
  },
  {
    id: 'alteracoes',
    title: '11. Alterações desta Política',
    paragraphs: [
      'Podemos atualizar esta Política periodicamente. A data de revisão será indicada no topo da página. Recomendamos consulta regular.',
      'Em alterações relevantes, poderemos informar por meio do site ou por e-mail cadastrado.',
    ],
  },
  {
    id: 'contato-lgpd',
    title: '12. Contato',
    paragraphs: [
      `Dúvidas sobre privacidade ou exercício de direitos: ${site.contact.email}.`,
      `WhatsApp: ${site.contact.whatsappDisplay}. Endereço: ${site.contact.address}.`,
    ],
  },
];
