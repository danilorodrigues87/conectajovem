import type { LegalSection } from '../../components/LegalDocumentLayout';
import { site } from '../../config/site';

export const termosMeta = {
  badge: 'Institucional',
  title: 'Termos de Uso',
  updatedAt: '26 de agosto de 2026',
  intro:
    'Estes Termos regulam o acesso e uso do Conecta Jovem. Ao utilizar o site ou criar uma conta, você declara ter lido, compreendido e concordado com as condições abaixo.',
};

export const termosSections: LegalSection[] = [
  {
    id: 'aceitacao',
    title: '1. Aceitação dos Termos',
    paragraphs: [
      `Estes Termos constituem acordo entre você e o ${site.contact.orgName} para uso da plataforma disponível em ${site.domain}.`,
      'Se não concordar com qualquer disposição, não utilize o serviço.',
    ],
  },
  {
    id: 'servico',
    title: '2. Descrição do serviço',
    paragraphs: [
      'O Conecta Jovem é uma plataforma de empregabilidade que conecta candidatos a empresas parceiras, com apoio de escolas parceiras que podem enriquecer perfis com formação verificada.',
      'O serviço inclui cadastro de perfis, publicação e busca de vagas, candidaturas, comunicação entre partes e recursos institucionais do portal.',
    ],
  },
  {
    id: 'elegibilidade',
    title: '3. Elegibilidade e cadastro',
    paragraphs: [
      'Para utilizar recursos que exijam conta, você deve fornecer informações verdadeiras, completas e atualizadas.',
      'Candidatos devem ter no mínimo 12 (doze) anos completos para participar da plataforma.',
      'Candidatos menores de 18 anos devem contar com consentimento e dados do responsável legal conforme solicitado no cadastro.',
      'Você é responsável pela confidencialidade de sua senha e por todas as atividades realizadas em sua conta.',
      'Empresas devem possuir legitimidade para representar a organização cadastrada e informar CNPJ válido quando exigido.',
    ],
  },
  {
    id: 'candidatos',
    title: '4. Regras para candidatos',
    paragraphs: ['Ao utilizar o perfil de candidato, você concorda em:'],
    list: [
      'Manter currículo e dados profissionais coerentes com a realidade.',
      'Utilizar a plataforma apenas para fins legítimos de busca de oportunidades.',
      'Não publicar conteúdo ofensivo, discriminatório, falso ou que viole direitos de terceiros.',
      'Compreender que empresas parceiras visualizam informações do perfil conforme fluxo de candidatura ou busca de talentos, incluindo a idade em anos.',
      'Menores de 18 anos só devem usar a plataforma com ciência e autorização do responsável legal.',
    ],
  },
  {
    id: 'empresas',
    title: '5. Regras para empresas parceiras',
    paragraphs: ['Empresas cadastradas concordam em:'],
    list: [
      'Publicar vagas reais e compatíveis com a legislação trabalhista aplicável, inclusive quanto à contratação de menores.',
      'Tratar dados de candidatos exclusivamente para fins de recrutamento e seleção, sem contato inadequado a menores de idade.',
      'Aguardar aprovação cadastral quando aplicável, antes de utilizar recursos restritos.',
      'Não utilizar a plataforma para spam, cobranças indevidas ou práticas abusivas.',
    ],
  },
  {
    id: 'escolas',
    title: '6. Escolas parceiras',
    paragraphs: [
      'Escolas parceiras que indicam formação ou selo certificado declaram possuir base legítima para tal indicação.',
      'A plataforma pode exibir selos e formações conforme integrações autorizadas, sem garantir emprego ou contratação.',
    ],
  },
  {
    id: 'conteudo',
    title: '7. Conteúdo e propriedade intelectual',
    paragraphs: [
      'Marcas, layout, software e conteúdos institucionais do Conecta Jovem pertencem ao operador ou licenciadores, salvo conteúdo enviado por usuários.',
      'Ao publicar conteúdo (textos, imagens, logos, links de redes sociais), você declara possuir direito sobre o material e concede licença não exclusiva para exibição e operação da plataforma, na medida necessária ao serviço.',
      'Comentários no blog podem ser publicados por candidatos e empresas logados; o nome de exibição e o texto ficam públicos no artigo. Você é responsável pelo conteúdo publicado. A equipe do Conecta Jovem pode remover comentários que violem estes Termos.',
    ],
  },
  {
    id: 'moderacao',
    title: '8. Moderação e suspensão',
    paragraphs: [
      'Podemos moderar vagas, perfis, comentários do blog e conteúdos, recusar cadastros, pausar publicações ou suspender contas que violem estes Termos, a lei ou políticas internas.',
      'Decisões de moderação visam proteger candidatos, empresas e a integridade da plataforma.',
    ],
  },
  {
    id: 'limitacao',
    title: '9. Limitação de responsabilidade',
    paragraphs: [
      'O Conecta Jovem atua como intermediador tecnológico entre candidatos e empresas. Não garantimos contratação, compatibilidade plena entre partes ou veracidade absoluta de todas as informações inseridas por usuários.',
      'Na extensão permitida pela lei, não nos responsabilizamos por danos indiretos, lucros cessantes ou decisões de contratação tomadas exclusivamente entre candidato e empresa.',
      'O serviço é fornecido "como disponível", com esforços razoáveis de disponibilidade e segurança.',
    ],
  },
  {
    id: 'privacidade',
    title: '10. Privacidade',
    paragraphs: [
      'O tratamento de dados pessoais é regido pela nossa Política de Privacidade, parte integrante destes Termos.',
    ],
  },
  {
    id: 'alteracoes-termos',
    title: '11. Alterações dos Termos',
    paragraphs: [
      'Podemos alterar estes Termos a qualquer tempo. A versão vigente estará sempre publicada nesta página, com data de atualização.',
      'O uso continuado após alterações implica concordância com a nova versão.',
    ],
  },
  {
    id: 'foro',
    title: '12. Legislação e foro',
    paragraphs: [
      'Estes Termos são regidos pelas leis da República Federativa do Brasil.',
      'Fica eleito o foro da comarca de domicílio do usuário consumidor, ou, para empresas, o foro da comarca de Guapiara-SP, salvo disposição legal em contrário.',
    ],
  },
  {
    id: 'contato-termos',
    title: '13. Contato',
    paragraphs: [
      `Dúvidas sobre estes Termos: ${site.contact.email}.`,
      `Endereço: ${site.contact.address}. WhatsApp: ${site.contact.whatsappDisplay}.`,
    ],
  },
];
