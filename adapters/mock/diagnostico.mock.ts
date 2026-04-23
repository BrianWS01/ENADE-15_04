import type { Diagnostico, DiagnosticoQueryParams, PaginatedResponse, RiskLevel } from '@/types';

const MOCK_DIAGNOSTICOS: Diagnostico[] = [
  {
    id: 'diag1',
    courseId: 'c1',
    courseName: 'Administração',
    simuladoId: 'sim5',
    simuladoName: '1º Simulado Administração',
    scoreGeral: 3.2,
    riskLevel: 'Baixo',
    trend: 'Crescente',
    strengths: ['Boa fundamentação teórica', 'Alto engajamento nas disciplinas de Exatas'],
    weaknesses: ['Dificuldade em estudos de caso complexos', 'Baixa participação em atividades extracurriculares'],
    recommendations: ['Integrar mais estudos de caso reais nas avaliações', 'Incentivar participação em projetos de extensão'],
    createdAt: new Date('2025-02-15T10:00:00Z').toISOString(),
  },
  {
    id: 'diag2',
    courseId: 'c2',
    courseName: 'Biomedicina',
    simuladoId: 'sim1',
    simuladoName: 'Simulado Diagnóstico 2025.1',
    scoreGeral: 4.1,
    riskLevel: 'Baixo',
    trend: 'Estável',
    strengths: ['Excelência em práticas laboratoriais', 'Domínio de metodologias de pesquisa'],
    weaknesses: ['Conceitos teóricos avançados em Genética'],
    recommendations: ['Manter a qualidade prática', 'Reforçar monitorias em Genética'],
    createdAt: new Date('2025-03-12T14:30:00Z').toISOString(),
  },
  {
    id: 'diag3',
    courseId: 'c4',
    courseName: 'Direito',
    simuladoId: 'sim3',
    simuladoName: 'Simulado Final - Direito',
    scoreGeral: 3.9,
    riskLevel: 'Médio',
    trend: 'Crescente',
    strengths: ['Alta capacidade de argumentação', 'Domínio de Direito Constitucional'],
    weaknesses: ['Dificuldade com peças processuais complexas em Direito Penal'],
    recommendations: ['Aumentar a carga horária de prática simulada em Penal'],
    createdAt: new Date('2025-05-22T09:00:00Z').toISOString(),
  },
  {
    id: 'diag4',
    courseId: 'c7',
    courseName: 'Engenharia Civil',
    simuladoId: 'sim4',
    simuladoName: 'Simulado ENADE - Engenharia Civil',
    scoreGeral: 2.8,
    riskLevel: 'Alto',
    trend: 'Em queda',
    strengths: ['Conhecimento sólido em Física Básica'],
    weaknesses: ['Cálculo Estrutural', 'Mecânica dos Solos'],
    recommendations: ['Implementar nivelamento intensivo em Cálculo', 'Revisar matriz de Mecânica dos Solos'],
    createdAt: new Date('2025-06-12T16:00:00Z').toISOString(),
  },
  {
    id: 'diag5',
    courseId: 'c6',
    courseName: 'Enfermagem',
    simuladoId: 'sim2',
    simuladoName: 'Simulado Geral - Enfermagem',
    scoreGeral: 4.2,
    riskLevel: 'Baixo',
    trend: 'Crescente',
    strengths: ['Cuidado humanizado', 'Protocolos de segurança do paciente'],
    weaknesses: ['Gestão hospitalar'],
    recommendations: ['Incluir módulos práticos de gestão no último ano'],
    createdAt: new Date('2025-04-18T11:00:00Z').toISOString(),
  },
  {
    id: 'diag6',
    courseId: 'c8',
    courseName: 'Psicologia',
    simuladoId: 'sim7',
    simuladoName: 'Simulado Formação Geral',
    scoreGeral: 3.7,
    riskLevel: 'Médio',
    trend: 'Estável',
    strengths: ['Psicologia Clínica', 'Empatia e escuta ativa'],
    weaknesses: ['Psicologia Organizacional e do Trabalho (POT)'],
    recommendations: ['Fomentar estágios na área de POT'],
    createdAt: new Date('2025-04-07T14:00:00Z').toISOString(),
  },
  {
    id: 'diag7',
    courseId: 'c15',
    courseName: 'Medicina Veterinária',
    simuladoId: 'sim10',
    simuladoName: 'Simulado Prático Veterinária',
    scoreGeral: 2.9,
    riskLevel: 'Alto',
    trend: 'Estável',
    strengths: ['Clínica de pequenos animais'],
    weaknesses: ['Clínica de grandes animais', 'Saúde Pública Veterinária'],
    recommendations: ['Firmar convênios com fazendas para aulas práticas', 'Incluir seminários sobre Zoonoses'],
    createdAt: new Date('2025-09-10T10:30:00Z').toISOString(),
  },
  {
    id: 'diag8',
    courseId: 'c11',
    courseName: 'Sistemas de Informação',
    simuladoId: 'sim6',
    simuladoName: 'Avaliação de Conhecimentos Específicos',
    scoreGeral: 4.5,
    riskLevel: 'Baixo',
    trend: 'Crescente',
    strengths: ['Lógica de programação', 'Desenvolvimento Web'],
    weaknesses: ['Governança de TI', 'Engenharia de Software (Documentação)'],
    recommendations: ['Estimular projetos reais com documentação completa', 'Inserir tópicos de ITIL/COBIT'],
    createdAt: new Date('2025-03-22T08:45:00Z').toISOString(),
  },
  {
    id: 'diag9',
    courseId: 'c9',
    courseName: 'Letras - Inglês',
    simuladoId: 'sim8',
    simuladoName: 'Simulado Integrado EaD',
    scoreGeral: 4.0,
    riskLevel: 'Baixo',
    trend: 'Estável',
    strengths: ['Proficiência linguística', 'Didática de ensino de línguas'],
    weaknesses: ['Literatura Inglesa Contemporânea'],
    recommendations: ['Criar grupos de leitura', 'Diversificar o acervo bibliográfico'],
    createdAt: new Date('2025-05-18T13:15:00Z').toISOString(),
  },
  {
    id: 'diag10',
    courseId: 'c14',
    courseName: 'Design Gráfico',
    simuladoId: 'sim11',
    simuladoName: 'Simulado de Revisão',
    scoreGeral: 4.3,
    riskLevel: 'Baixo',
    trend: 'Crescente',
    strengths: ['Criatividade', 'Domínio de ferramentas de edição gráfica'],
    weaknesses: ['História da Arte', 'Gestão de Projetos de Design'],
    recommendations: ['Integrar conceitos teóricos às disciplinas práticas', 'Incluir noções de precificação e relacionamento com clientes'],
    createdAt: new Date('2025-04-28T16:20:00Z').toISOString(),
  }
];

export async function getMockDiagnosticos(params: DiagnosticoQueryParams): Promise<PaginatedResponse<Diagnostico>> {
  let filtered = [...MOCK_DIAGNOSTICOS];

  if (params.courseId && params.courseId !== 'all') {
    filtered = filtered.filter(d => d.courseId === params.courseId);
  }

  if (params.riskLevel && params.riskLevel !== 'all') {
    filtered = filtered.filter(d => d.riskLevel === params.riskLevel);
  }

  if (params.dateStr) {
    const filterDate = new Date(params.dateStr).toISOString().split('T')[0];
    filtered = filtered.filter(d => d.createdAt.startsWith(filterDate));
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const page = params.page || 1;
  const perPage = params.perPage || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);

  const start = (page - 1) * perPage;
  const paginatedData = filtered.slice(start, start + perPage);

  return {
    data: paginatedData,
    meta: {
      total,
      page,
      perPage,
      totalPages,
    },
  };
}

export async function getMockDiagnosticoById(id: string): Promise<Diagnostico | null> {
  const diag = MOCK_DIAGNOSTICOS.find(d => d.id === id);
  return diag || null;
}
