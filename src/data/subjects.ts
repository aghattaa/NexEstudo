import { Calculator, Microscope, PenTool } from 'lucide-react';

export const subjects = [
  {
    id: 'matematica',
    name: 'Matemática',
    icon: Calculator,
    description: 'Álgebra, Geometria e Raciocínio Lógico (6º ao 9º ano)',
    color: 'from-violet-600 to-indigo-600',
    borderColor: 'group-hover:border-violet-500/50',
    progress: 72,
    progressColor: 'bg-gradient-to-r from-violet-500 to-indigo-400',
    glow: 'bg-violet-600/30',
    xpTotal: 1240,
    xpMax: 2000,
    lastTopic: 'Potências e Raízes Quadradas',
    lastTopicId: 'potencias-e-raizes',
    totalTopics: 18,
    completedTopics: 13,
    streak: 5,
    recentActivity: 'Ontem',
    difficulty: 'Intermediário' as const,
    estimatedHours: 24,
    tags: ['BNCC', 'ENEM', 'Lógica'],
    accentColor: '#8B5CF6',
    shadowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    id: 'ciencias',
    name: 'Ciências',
    icon: Microscope,
    description: 'Física, Química e Biologia Essencial (6º ao 9º ano)',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'group-hover:border-emerald-500/50',
    progress: 45,
    progressColor: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    glow: 'bg-emerald-500/30',
    xpTotal: 680,
    xpMax: 1800,
    lastTopic: 'Células e Organismos Vivos',
    lastTopicId: 'celulas-organismos',
    totalTopics: 20,
    completedTopics: 9,
    streak: 2,
    recentActivity: 'Há 3 dias',
    difficulty: 'Iniciante' as const,
    estimatedHours: 28,
    tags: ['BNCC', 'Natureza', 'Biologia'],
    accentColor: '#10B981',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'portugues',
    name: 'Língua Portuguesa',
    icon: PenTool,
    description: 'Gramática, Redação e Interpretação de Textos (6º ao 9º ano)',
    color: 'from-pink-600 to-rose-500',
    borderColor: 'group-hover:border-pink-500/50',
    progress: 90,
    progressColor: 'bg-gradient-to-r from-pink-500 to-rose-400',
    glow: 'bg-pink-500/30',
    xpTotal: 1820,
    xpMax: 2000,
    lastTopic: 'Figuras de Linguagem Avançadas',
    lastTopicId: 'figuras-linguagem',
    totalTopics: 22,
    completedTopics: 20,
    streak: 7,
    recentActivity: 'Hoje',
    difficulty: 'Avançado' as const,
    estimatedHours: 30,
    tags: ['BNCC', 'Redação', 'ENEM'],
    accentColor: '#F43F5E',
    shadowColor: 'rgba(244, 63, 94, 0.4)',
  },
];

export type Subject = typeof subjects[0];

export type QuizOption = {
  text: string;
  isCorrect: boolean;
  feedback: string;
};

export type VideoMeta = {
  videoTitle: string;
  channelName: string;
  videoLink: string;
};

export type TopicContent = {
  id: string;
  title: string;
  bncc: string;
  estimatedMinutes: number;
  videoTitle: string;
  videoDuration: string;
  videoUrls?: string[];
  videoMetas?: VideoMeta[];
  introText: string;
  detailedText: string[];
  practicalExample: {
    title: string;
    text: string;
  };
  quiz: {
    question: string;
    options: QuizOption[];
  };
};

export type YearData = {
  year: number;
  label: string;
  topics: TopicContent[];
};

export type SubjectData = {
  anosFinais: YearData[];
};

const createTopic = (title: string, bncc: string, description: string, videoUrls?: string[], videoMetas?: VideoMeta[]): TopicContent => ({
  id: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
  title,
  bncc,
  estimatedMinutes: 45,
  videoTitle: `Aula: ${title}`,
  videoDuration: '10:00',
  videoUrls,
  videoMetas,
  introText: description,
  detailedText: [
    `Nesta unidade, vamos explorar os conceitos principais sobre ${title.toLowerCase()}. Preste muita atenção aos detalhes, pois eles formam a base para assuntos mais complexos.`,
    `A aplicação prática deste conhecimento pode ser vista em diversas situações do dia a dia, ajudando a resolver problemas de forma lógica e eficiente.`,
  ],
  practicalExample: {
    title: 'Aplicação Prática',
    text: `Pense em como os conceitos de ${title.toLowerCase()} se aplicam à sua rotina diária. Observar a matemática no mundo real torna o aprendizado natural.`,
  },
  quiz: {
    question: `Qual é a ideia principal ao estudar ${title}?`,
    options: [
      { text: 'Compreender os fundamentos lógicos do tema', isCorrect: true, feedback: 'Exato! A base matemática é essencial.' },
      { text: 'Decorar fórmulas sem entender sua origem', isCorrect: false, feedback: 'Decorar não é aprender. O ideal é entender a lógica.' },
      { text: 'Ignorar o contexto e as aplicações reais', isCorrect: false, feedback: 'Contexto é fundamental em exatas.' },
      { text: 'Focar apenas no resultado e não no processo', isCorrect: false, feedback: 'O processo de cálculo é o que desenvolve o raciocínio.' },
    ],
  },
});

const createScienceTopic = (title: string, bncc: string, description: string, videoUrls?: string[], videoMetas?: VideoMeta[]): TopicContent => ({
  id: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
  title,
  bncc,
  estimatedMinutes: 45,
  videoTitle: `Aula: ${title}`,
  videoDuration: '10:00',
  videoUrls,
  videoMetas,
  introText: description,
  detailedText: [
    `Nesta unidade, vamos explorar os conceitos principais sobre ${title.toLowerCase()}. Preste muita atenção aos detalhes, pois eles formam a base para compreender fenômenos naturais e científicos.`,
    `A aplicação prática deste conhecimento pode ser vista em diversas situações do cotidiano, na tecnologia, na saúde e na preservação do nosso planeta.`,
  ],
  practicalExample: {
    title: 'Aplicação no Dia a Dia',
    text: `Pense em como os conceitos de ${title.toLowerCase()} se aplicam ao mundo ao seu redor. Observar a ciência na prática torna o aprendizado muito mais fascinante.`,
  },
  quiz: {
    question: `Qual é o objetivo principal ao estudar ${title}?`,
    options: [
      { text: 'Compreender os princípios e processos científicos do tema', isCorrect: true, feedback: 'Exato! Compreender a ciência nos ajuda a entender o funcionamento da natureza.' },
      { text: 'Apenas memorizar termos sem entender a aplicação', isCorrect: false, feedback: 'O importante é entender os conceitos e sua relação com o mundo, não apenas decorar.' },
      { text: 'Ignorar o método científico e as evidências', isCorrect: false, feedback: 'O método científico e as evidências são as bases das ciências da natureza.' },
      { text: 'Focar em decorar conceitos sem questionar os fenômenos', isCorrect: false, feedback: 'A ciência se constrói com base em perguntas, investigações e observações do mundo.' },
    ],
  },
});

const createFallbackContent = (title: string, year: number, code: string): TopicContent => ({
  id: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
  title,
  bncc: `EF0${year}${code}01`, // Generic BNCC code
  estimatedMinutes: 40,
  videoTitle: `Introdução a ${title}`,
  videoDuration: '10:00',
  introText: `Neste tópico sobre ${title}, você vai aprender os conceitos essenciais da disciplina.`,
  detailedText: [
    `Conteúdo introdutório sobre ${title}. Esta é uma visão geral para ajudar a consolidar os conceitos.`,
  ],
  practicalExample: {
    title: 'Exemplo Prático',
    text: `Como aplicar os conceitos de ${title} no dia a dia.`,
  },
  quiz: {
    question: `Qual a importância principal de estudar ${title}?`,
    options: [
      { text: 'Compreender as bases do assunto', isCorrect: true, feedback: 'Isso mesmo!' },
      { text: 'Apenas decorar', isCorrect: false, feedback: 'Decorar não é o foco.' },
      { text: 'Ignorar as aplicações práticas', isCorrect: false, feedback: 'As aplicações são fundamentais.' },
      { text: 'Pular para o próximo tópico', isCorrect: false, feedback: 'Tudo tem seu tempo.' },
    ],
  },
});

const adicaoESubtracao: TopicContent = {
  id: 'adicao-e-subtracao',
  title: 'Adição e Subtração com Reagrupamento',
  bncc: 'EF02MA05',
  estimatedMinutes: 50,
  videoTitle: 'Dominando a Adição e Subtração',
  videoDuration: '14:20',
  introText: 'Aprender a somar e subtrair é como ganhar superpoderes para lidar com números na vida real. Quando os números ficam maiores, usamos uma técnica chamada "reagrupamento" (ou "vai um").',
  detailedText: [
    'A **adição** é a operação matemática que utilizamos para juntar quantidades. Por exemplo, se você tem figurinhas e ganha mais algumas, você está fazendo uma adição.',
    'A **subtração** é o inverso: usamos para descobrir quanto sobra quando tiramos uma quantidade de outra. Se você tem R$ 20 e gasta R$ 8 na cantina, você faz uma subtração para saber seu troco.',
    'O **reagrupamento** acontece quando a soma de uma coluna (como a das unidades) ultrapassa 9. Nós "mandamos" o valor extra para a próxima coluna (dezenas). Na subtração, quando o número de cima é menor, nós "pegamos emprestado" da coluna vizinha.',
  ],
  practicalExample: {
    title: 'Exemplo Real: A Loja de Doces',
    text: 'Imagine que você quer comprar um chocolate que custa R$ 35 e uma bala que custa R$ 18. Para saber quanto vai gastar, você soma 35 + 18. Primeiro, some as unidades: 5 + 8 = 13. Como 13 tem uma dezena e 3 unidades, você anota o 3 e "vai um" para a coluna das dezenas. Então, soma as dezenas: 3 + 1 + 1 (que subiu) = 5. Total: R$ 53.',
  },
  quiz: {
    question: 'Em uma biblioteca havia 245 livros de aventura. A escola comprou mais 128 livros desse gênero. Quantos livros de aventura a biblioteca tem agora?',
    options: [
      { text: '363 livros', isCorrect: false, feedback: 'Incorreto. Você esqueceu de fazer o reagrupamento ("vai um") na coluna das dezenas.' },
      { text: '373 livros', isCorrect: true, feedback: 'Excelente! Você somou as unidades (5+8=13, sobe 1), dezenas (4+2+1=7) e centenas (2+1=3). A operação está correta!' },
      { text: '117 livros', isCorrect: false, feedback: 'Atenção! Você fez uma subtração em vez de uma adição. O problema diz que a escola "comprou mais" livros.' },
      { text: '383 livros', isCorrect: false, feedback: 'Quase! Você provavelmente somou uma dezena a mais do que deveria.' },
    ],
  },
};

const fracoes: TopicContent = {
  id: 'fracoes',
  title: 'Introdução às Frações',
  bncc: 'EF04MA09',
  estimatedMinutes: 45,
  videoTitle: 'Frações: A Arte de Dividir',
  videoDuration: '12:45',
  introText: 'Você já dividiu uma pizza com seus amigos? Se sim, você já entende de frações! Uma fração nada mais é do que uma forma matemática de representar fatias de um todo.',
  detailedText: [
    'Toda fração tem duas partes essenciais: o **Numerador** (o número de cima) e o **Denominador** (o número de baixo).',
    'O **Denominador** indica em quantas partes iguais o todo foi dividido. Se cortamos uma torta em 8 pedaços iguais, o denominador é 8.',
    'O **Numerador** indica quantas dessas partes estamos considerando. Se comermos 3 fatias dessa torta, o numerador é 3. A fração será 3/8 (lê-se: três oitavos).',
  ],
  practicalExample: {
    title: 'A Divisão do Chocolate',
    text: 'Você tem uma barra de chocolate dividida em 10 quadradinhos (Denominador = 10). Se você der 4 quadradinhos para o seu irmão, você deu a ele 4/10 (quatro décimos) da barra. E sobraram 6/10 (seis décimos) para você!',
  },
  quiz: {
    question: 'Maria dividiu um bolo em 12 pedaços iguais. Seus convidados comeram 7 desses pedaços. Qual fração representa a parte do bolo que FOI COMIDA?',
    options: [
      { text: '5/12', isCorrect: false, feedback: 'Quase! 5/12 representa a parte do bolo que SOBROU. A pergunta pede a parte que foi comida.' },
      { text: '12/7', isCorrect: false, feedback: 'Incorreto. O número total de partes (12) deve ser o denominador (número de baixo).' },
      { text: '7/12', isCorrect: true, feedback: 'Perfeito! O bolo foi dividido em 12 pedaços (denominador) e 7 foram consumidos (numerador). Essa é exatamente a lógica de uma fração.' },
      { text: '1/7', isCorrect: false, feedback: 'Incorreto. A barra de fração representa partes de um todo de 12 pedaços.' },
    ],
  },
};

export const subjectData: Record<string, SubjectData> = {
  matematica: {
    anosFinais: [
      {
        year: 6,
        label: '6º ano',
        topics: [
          createTopic('Sistema de Numeração e Operações', 'EF06MA01, EF06MA05', 'Leitura, escrita e ordenação de números naturais e racionais. Divisibilidade, números primos e compostos.', [
            'https://www.youtube.com/embed/Jf0sA3wBqXE',
            'https://www.youtube.com/embed/e78_5WIssSU',
            'https://www.youtube.com/embed/0UGJRHq2PS4'
          ], [
            { videoTitle: 'Sistema de Numeração e Operações - Vídeo 1', channelName: 'Ferreto', videoLink: 'https://youtu.be/Jf0sA3wBqXE?si=pkKc77CqciO9ox-S' },
            { videoTitle: 'Sistema de Numeração e Operações - Vídeo 2', channelName: 'Ferreto', videoLink: 'https://youtu.be/e78_5WIssSU?si=rQV0CMu3hOZkHz0B' },
            { videoTitle: 'Sistema de Numeração e Operações - Vídeo 3', channelName: 'Ferreto', videoLink: 'https://youtu.be/0UGJRHq2PS4?si=TTUTJUswFjZtfwuZ' }
          ]),
          createTopic('Frações e Decimais', 'EF06MA07, EF06MA11', 'Equivalência, comparação, adição e subtração de frações. Operações (adição, subtração, multiplicação, divisão e potenciação) com racionais decimais.', [
            'https://www.youtube.com/embed/YJyY6A_MOQc',
            'https://www.youtube.com/embed/SgJpB78R7x0',
            'https://www.youtube.com/embed/13jlmVyGrLo'
          ], [
            { videoTitle: 'Frações e Decimais - Vídeo 1', channelName: 'Ferreto', videoLink: 'https://youtu.be/YJyY6A_MOQc?si=sCEHRI5RvCBGRZ5o' },
            { videoTitle: 'Frações e Decimais - Vídeo 2', channelName: 'Ferreto', videoLink: 'https://youtu.be/SgJpB78R7x0?si=Me0H4LgnarzwSw8X' },
            { videoTitle: 'Frações e Decimais - Vídeo 3', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/13jlmVyGrLo?feature=shared' }
          ]),
          createTopic('Porcentagens e Proporcionalidade', 'EF06MA13', 'Cálculo de porcentagens em contexto de educação financeira usando a lógica da proporcionalidade.', [
            'https://www.youtube.com/embed/CERiIwParX4',
            'https://www.youtube.com/embed/GjxEHeAKWAU'
          ], [
            { videoTitle: 'Porcentagens e Proporcionalidade - Vídeo 1', channelName: 'Ferreto', videoLink: 'https://youtu.be/CERiIwParX4?si=3K9XmenW8RggiyP8' },
            { videoTitle: 'Porcentagens e Proporcionalidade - Vídeo 2', channelName: 'Sandrocuriodicasdemat', videoLink: 'https://youtu.be/GjxEHeAKWAU?si=knCE6l5T1c8SbS37' }
          ]),
          createTopic('Igualdade e Partilha', 'EF06MA14, EF06MA15', 'Propriedades da igualdade para determinar valores desconhecidos. Problemas de partilha em partes desiguais (razões entre parte e todo).', [
            'https://www.youtube.com/embed/tfVucbD7WMA',
            'https://www.youtube.com/embed/Jy9sHO2nBUo'
          ], [
            { videoTitle: 'Igualdade e Partilha - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/tfVucbD7WMA?si=NtO7yk2294eZaAP_' },
            { videoTitle: 'Igualdade e Partilha - Vídeo 2', channelName: 'Ricardohemke', videoLink: 'https://youtu.be/Jy9sHO2nBUo?si=dVGhNuKdG-TfBPtT' }
          ]),
          createTopic('Prismas, Pirâmides e Polígonos', 'EF06MA17, EF06MA19, EF06MA20', 'Relações entre vértices, faces e arestas de prismas/pirâmides. Classificação detalhada de triângulos e quadriláteros.', [
            'https://www.youtube.com/embed/QsKnb8Qy5dM',
            'https://www.youtube.com/embed/Kgh93SCaJPw'
          ], [
            { videoTitle: 'Prismas, Pirâmides e Polígonos - Vídeo 1', channelName: 'Anapaulaapaso', videoLink: 'https://youtu.be/QsKnb8Qy5dM?si=YBimcoBCPeuBzupX' },
            { videoTitle: 'Prismas, Pirâmides e Polígonos - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/Kgh93SCaJPw?si=Mk58okE6basvOi6R' }
          ]),
          createTopic('Medidas e Ângulos', 'EF06MA24, EF06MA27', 'Problemas reais com comprimento, massa, tempo, temperatura e área. Medida de ângulos utilizando transferidor e tecnologias.', [
            'https://www.youtube.com/embed/nAvqZSglTmA',
            'https://www.youtube.com/embed/dHr5phd_qL8'
          ], [
            { videoTitle: 'Medidas e Ângulos - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/nAvqZSglTmA?si=vp4QkYZ9g4CifDCa' },
            { videoTitle: 'Medidas e Ângulos - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/dHr5phd_qL8?si=rtkJvb0zgIl6b_Ek' }
          ]),
          createTopic('Perímetro e Área', 'EF06MA29', 'Análise profunda das mudanças de perímetro e área ao ampliar ou reduzir lados de um quadrado.', [
            'https://www.youtube.com/embed/poMf9MQJIgg'
          ], [
            { videoTitle: 'Perímetro e Área - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/poMf9MQJIgg?si=pzNwYHqE1yT5UEJ4' }
          ]),
          createTopic('Probabilidade Aleatória', 'EF06MA30', 'Cálculo da probabilidade de um evento aleatório usando forma fracionária, decimal e percentual.', [
            'https://www.youtube.com/embed/AZH67sWDW5w'
          ], [
            { videoTitle: 'Probabilidade Aleatória - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/AZH67sWDW5w?si=BmHHDaASxYSyyBq5' }
          ]),
          createTopic('Análise de Gráficos e Pesquisas', 'EF06MA32, EF06MA33', 'Leitura, interpretação e planejamento de coleta de dados em pesquisas estatísticas, especialmente com foco ambiental.', [
            'https://www.youtube.com/embed/BrxdHW5ajho'
          ], [
            { videoTitle: 'Análise de Gráficos e Pesquisas - Vídeo 1', channelName: 'Amagiadoaprender', videoLink: 'https://youtu.be/BrxdHW5ajho?feature=shared' }
          ]),
        ],
      },
      {
        year: 7,
        label: '7º ano',
        topics: [
          createTopic('Múltiplos, Divisores e Porcentagens', 'EF07MA01, EF07MA02', 'Resolução de problemas envolvendo MDC, MMC e porcentagens (acréscimos e decréscimos em contexto financeiro).', [
            'https://www.youtube.com/embed/0QZVJFOE4cE',
            'https://www.youtube.com/embed/0IST1fdMnDA'
          ], [
            { videoTitle: 'Múltiplos, Divisores e Porcentagens - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/0QZVJFOE4cE?si=66aT7328cHv8dj07' },
            { videoTitle: 'Múltiplos, Divisores e Porcentagens - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/0IST1fdMnDA?si=U9s-DqqDkBWINP-L' }
          ]),
          createTopic('Números Inteiros', 'EF07MA03', 'Ordenação, representação na reta numérica e as operações de adição e subtração com números negativos e positivos.', [
            'https://www.youtube.com/embed/68CP_MPzXqo'
          ], [
            { videoTitle: 'Números Inteiros - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/68CP_MPzXqo?si=K9J0PCQls0oivx4a' }
          ]),
          createTopic('Operações com Racionais', 'EF07MA11, EF07MA12', 'Domínio da multiplicação e divisão de números racionais (fracionária e decimal) e suas propriedades matemáticas.', [
            'https://www.youtube.com/embed/M9PiRFGbsCs'
          ], [
            { videoTitle: 'Operações com Racionais - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/M9PiRFGbsCs?feature=shared' }
          ]),
          createTopic('Linguagem Algébrica', 'EF07MA13', 'Introdução à álgebra: compreensão do conceito de variável como letra ou símbolo para expressar relação entre grandezas.', [
            'https://www.youtube.com/embed/videoseries?list=PLBmJPikw8kvmouwU8AVCTld8tXy8kapiF'
          ], [
            { videoTitle: 'Linguagem Algébrica - Playlist', channelName: 'Por RA matemática', videoLink: 'https://youtube.com/playlist?list=PLBmJPikw8kvmouwU8AVCTld8tXy8kapiF&si=I_x0ci4WHA8h1CqG' }
          ]),
          createTopic('Equações de 1º Grau e Proporção', 'EF07MA17, EF07MA18', 'Identificação de grandezas proporcionais. Modelagem e resolução de problemas usando equações lineares do tipo ax + b = c.', [
            'https://www.youtube.com/embed/NXb8T626NSo',
            'https://www.youtube.com/embed/SnJzuESRmZU'
          ], [
            { videoTitle: 'Equações de 1º Grau e Proporção - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/NXb8T626NSo?si=YGP9kwNWhL6R2Iml' },
            { videoTitle: 'Equações de 1º Grau e Proporção - Vídeo 2', channelName: 'Sandrocuriodicasdemat', videoLink: 'https://youtu.be/SnJzuESRmZU?si=QHG32h0Xlcs4wX7A' }
          ]),
          createTopic('Simetrias e Transformações', 'EF07MA21', 'Identificação e construção de figuras obtidas por simetrias de translação, rotação e reflexão.', [
            'https://www.youtube.com/embed/HGWAm4wXCY4'
          ], [
            { videoTitle: 'Simetrias e Transformações - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/HGWAm4wXCY4?si=fTXEhVK7V2t-KAR0' }
          ]),
          createTopic('Ângulos e Triângulos', 'EF07MA23, EF07MA24', 'Relações de ângulos formados por retas paralelas cortadas por transversais. Construção de triângulos confirmando que a soma é 180°.', [
            'https://www.youtube.com/embed/Ka3GluTldeY',
            'https://www.youtube.com/embed/nAvqZSglTmA'
          ], [
            { videoTitle: 'Ângulos e Triângulos - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/Ka3GluTldeY?si=tBiJ5LyMrhEz-l1f' },
            { videoTitle: 'Ângulos e Triângulos - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/nAvqZSglTmA?si=377lT7kcUPvipd8V' }
          ]),
          createTopic('Volume, Área e Número Pi', 'EF07MA30, EF07MA31, EF07MA33', 'Cálculo de volume de blocos e expressões de área. Reconhecimento da constante Pi (π) como razão em circunferências.', [
            'https://www.youtube.com/embed/videoseries?list=PLGyv8aUrOlzAPTsfxv27CdubzZg5RW83-',
            'https://www.youtube.com/embed/vdQMamMsPN4',
            'https://www.youtube.com/embed/bHHjMg28BEQ'
          ], [
            { videoTitle: 'Volume, Área e Número Pi - Playlist', channelName: 'Giscomgiz', videoLink: 'https://youtube.com/playlist?list=PLGyv8aUrOlzAPTsfxv27CdubzZg5RW83-&si=VqQHSqFpBVCnK4qP' },
            { videoTitle: 'Volume, Área e Número Pi - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/vdQMamMsPN4?si=IpXxUao7qZzO5bq5' },
            { videoTitle: 'Volume, Área e Número Pi - Vídeo 3', channelName: 'Matematicamarcelobelini', videoLink: 'https://youtu.be/bHHjMg28BEQ?si=wLlVfQ2D4fsTitNd' }
          ]),
          createTopic('Experimentos e Pesquisas Estatísticas', 'EF07MA34, EF07MA35, EF07MA36', 'Estimativa de probabilidade via experimentos. Cálculo de média e amplitude. Criação de relatórios e gráficos de setores.', [
            'https://www.youtube.com/embed/yGk-WazqYx4',
            'https://www.youtube.com/embed/udsHUCuUWAg'
          ], [
            { videoTitle: 'Experimentos e Pesquisas Estatísticas - Vídeo 1', channelName: 'Matemáticaem3minutos', videoLink: 'https://youtu.be/yGk-WazqYx4?si=jRNi_-SY-mCy-Sn3' },
            { videoTitle: 'Experimentos e Pesquisas Estatísticas - Vídeo 2', channelName: 'Euvohaprendermatemática', videoLink: 'https://youtu.be/udsHUCuUWAg?si=mVT7A_RCIRccYPP0' }
          ]),
        ],
      },
      {
        year: 8,
        label: '8º ano',
        topics: [
          createTopic('Potenciação e Notação Científica', 'EF08MA01, EF08MA02', 'Cálculos avançados com potências, notação científica e resolução de problemas utilizando a relação entre potenciação e radiciação.', [
            'https://www.youtube.com/embed/EqSiqXyfaqA',
            'https://www.youtube.com/embed/tMOqp1Rqr0E'
          ], [
            { videoTitle: 'Potenciação e Notação Científica - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/EqSiqXyfaqA?si=gwLqtxTxjmVKnVCI' },
            { videoTitle: 'Potenciação e Notação Científica - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/tMOqp1Rqr0E?si=n1zZ9TwBtjgKNG5I' }
          ]),
          createTopic('Princípio Multiplicativo e Dízimas', 'EF08MA03, EF08MA05', 'Cálculo de combinações pelo princípio multiplicativo da contagem e obtenção da fração geratriz de dízimas periódicas.', [
            'https://www.youtube.com/embed/Lfn5CzoSXkE',
            'https://www.youtube.com/embed/hMmPidxIDiw'
          ], [
            { videoTitle: 'Princípio Multiplicativo e Dízimas - Vídeo 1', channelName: 'Matemática no papel', videoLink: 'https://youtu.be/Lfn5CzoSXkE?si=8DNbl5FeXJMEGpH9' },
            { videoTitle: 'Princípio Multiplicativo e Dízimas - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/hMmPidxIDiw?si=sT1mMTe451savAS0' }
          ]),
          createTopic('Equações e Sistemas de 1º Grau', 'EF08MA07, EF08MA08', 'Associação de equações de 1º grau a retas no plano cartesiano e métodos para a resolução de sistemas de equações.', [
            'https://www.youtube.com/embed/cs0BdQyP7ZY',
            'https://www.youtube.com/embed/oT4k6bhB4Dk'
          ], [
            { videoTitle: 'Equações e Sistemas de 1º Grau - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/cs0BdQyP7ZY?si=1x2DxbK1qtMlVPZk' },
            { videoTitle: 'Equações e Sistemas de 1º Grau - Vídeo 2', channelName: 'Ferreto', videoLink: 'https://youtu.be/oT4k6bhB4Dk?si=iMV9vq0bP5j3MaXR' }
          ]),
          createTopic('Equações do 2º Grau (Simples) e Variações', 'EF08MA09, EF08MA12', 'Introdução a problemas com ax² = b. Representação no plano cartesiano da variação de grandezas (direta, inversa ou não proporcional).', [
            'https://www.youtube.com/embed/luR-qD_R4BM'
          ], [
            { videoTitle: 'Equações do 2º Grau (Simples) e Variações - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/luR-qD_R4BM?si=EPmkBTWDc5XTuhBZ' }
          ]),
          createTopic('Propriedades de Quadriláteros e Construções', 'EF08MA14, EF08MA15', 'Demonstração geométrica de propriedades usando congruência de triângulos. Construção de bissetriz, mediatriz e ângulos exatos.', [
            'https://www.youtube.com/embed/videoseries?list=PLGyv8aUrOlzBy4h8h7gsFStvzEFIEHQuA'
          ], [
            { videoTitle: 'Propriedades de Quadriláteros e Construções - Playlist', channelName: 'Giscomgiz', videoLink: 'https://youtube.com/playlist?list=PLGyv8aUrOlzBy4h8h7gsFStvzEFIEHQuA&si=0eSkR9-TynKaT_gQ' }
          ]),
          createTopic('Mediatriz, Bissetriz e Transformações', 'EF08MA17, EF08MA18', 'Aplicação de lugares geométricos e compreensão avançada de translações, reflexões e rotações.', [
            'https://www.youtube.com/embed/d31QinXPpc8',
            'https://www.youtube.com/embed/rDDC98e0ujw'
          ], [
            { videoTitle: 'Mediatriz, Bissetriz e Transformações - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/d31QinXPpc8?si=x_souXUM1S5ipLQu' },
            { videoTitle: 'Mediatriz, Bissetriz e Transformações - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/rDDC98e0ujw?si=V9YdPOUZqhYGfZqz' }
          ]),
          createTopic('Área e Volume (Aprofundamento)', 'EF08MA19, EF08MA20, EF08MA21', 'Expressões numéricas para áreas de polígonos. Volumes de recipientes retangulares e relação prática entre litro, dm³ e m³.', [
            'https://www.youtube.com/embed/dArATPsuLjM',
            'https://www.youtube.com/embed/TN2zv_vSH70'
          ], [
            { videoTitle: 'Área e Volume (Aprofundamento) - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/dArATPsuLjM?si=UlG5URBezy9n_jax' },
            { videoTitle: 'Área e Volume (Aprofundamento) - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/TN2zv_vSH70?si=8R3xNLIJ7TjzjPwx' }
          ]),
          createTopic('Probabilidades e Análise Estatística', 'EF08MA22, EF08MA25, EF08MA27', 'Cálculo de probabilidade (soma = 1). Determinação de medidas centrais (média, moda, mediana) e execução de pesquisas amostrais completas.', [
            'https://www.youtube.com/embed/4cNV62z08Kc',
            'https://www.youtube.com/embed/mSk2vjGXA90'
          ], [
            { videoTitle: 'Probabilidades e Análise Estatística - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/4cNV62z08Kc?si=Y9RTXas9D0kUIFPf' },
            { videoTitle: 'Probabilidades e Análise Estatística - Vídeo 2', channelName: 'Sandrocuriodemat', videoLink: 'https://youtu.be/mSk2vjGXA90?si=WaHSNESz72TKDxRN' }
          ]),
        ],
      },
      {
        year: 9,
        label: '9º ano',
        topics: [
          createTopic('Números Reais e Irracionais', 'EF09MA01, EF09MA02', 'O conjunto dos reais para medição contínua na reta. Identificação de números irracionais icônicos como √2 e Pi (π).', [
            'https://www.youtube.com/embed/J4vD5RpOqJY'
          ], [
            { videoTitle: 'Números Reais e Irracionais - Vídeo 1', channelName: 'Ferreto', videoLink: 'https://youtu.be/J4vD5RpOqJY?si=5yEuHJjIrr99shmZ' }
          ]),
          createTopic('Cálculos com Radicais', 'EF09MA03', 'Operações fundamentais com raízes quadradas e técnicas matemáticas para simplificação de radicais.', [
            'https://www.youtube.com/embed/M9PiRFGbsCs'
          ], [
            { videoTitle: 'Cálculos com Radicais - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/M9PiRFGbsCs?feature=shared' }
          ]),
          createTopic('Produtos Notáveis e Fatoração', 'EF09MA06', 'Compreensão de trinômio quadrado perfeito, diferença de quadrados e técnicas de fatoração algébrica.', [
            'https://www.youtube.com/embed/C_dLST3fa6s',
            'https://www.youtube.com/embed/hgr3iNJdLzE'
          ], [
            { videoTitle: 'Produtos Notáveis e Fatoração - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/C_dLST3fa6s?si=vxgxaZ1PNLopoIL7' },
            { videoTitle: 'Produtos Notáveis e Fatoração - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/hgr3iNJdLzE?si=_aXpReWW8I6Ax7nQ' }
          ]),
          createTopic('Equação do 2º Grau (Fórmula de Bhaskara)', 'EF09MA07, EF09MA08', 'Resolução de equações quadráticas completas e incompletas, e uso da fórmula de Bhaskara para resolução de problemas reais.', [
            'https://www.youtube.com/embed/LNLvMo1PWok'
          ], [
            { videoTitle: 'Equação do 2º Grau (Fórmula de Bhaskara) - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/LNLvMo1PWok?si=yJb04xRVX2MZDQGO' }
          ]),
          createTopic('Grandezas Proporcionais e Regra de Três', 'EF09MA05', 'Resolução intensiva de problemas usando regra de três simples e composta em grandezas direta e inversamente proporcionais.', [
            'https://www.youtube.com/embed/04EB9dZoBqw',
            'https://www.youtube.com/embed/alLifth7gxE'
          ], [
            { videoTitle: 'Grandezas Proporcionais e Regra de Três - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/04EB9dZoBqw?si=u3wS-PVY57QeALuY' },
            { videoTitle: 'Grandezas Proporcionais e Regra de Três - Vídeo 2', channelName: 'Ferreto', videoLink: 'https://youtu.be/alLifth7gxE?si=VK0pJj-fA8Rb-xKH' }
          ]),
          createTopic('Semelhança e Teorema de Pitágoras', 'EF09MA10, EF09MA13', 'Critérios clássicos de semelhança geométrica e a demonstração formal e prática do Teorema de Pitágoras.', [
            'https://www.youtube.com/embed/JBP0ryUtJmg',
            'https://www.youtube.com/embed/RxfPjqXx-g0'
          ], [
            { videoTitle: 'Semelhança e Teorema de Pitágoras - Vídeo 1', channelName: 'Sandrocuriodicasdemat', videoLink: 'https://youtu.be/JBP0ryUtJmg?si=R-TNBSWMRcR34aRv' },
            { videoTitle: 'Semelhança e Teorema de Pitágoras - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/RxfPjqXx-g0?si=07qK3sxSov_ZkFP6' }
          ]),
          createTopic('Trigonometria e Geometria Analítica Básica', 'EF09MA14, EF09MA15', 'Aplicação de seno, cosseno e tangente no triângulo retângulo. Cálculo de distância entre pontos e equações da reta.', [
            'https://www.youtube.com/embed/lHqTFWNBtmQ',
            'https://www.youtube.com/embed/D-E_A04ReTE'
          ], [
            { videoTitle: 'Trigonometria e Geometria Analítica Básica - Vídeo 1', channelName: 'Sandrocuriodicasdemat', videoLink: 'https://youtu.be/lHqTFWNBtmQ?si=AWNmdQ1xNvNW5Y_b' },
            { videoTitle: 'Trigonometria e Geometria Analítica Básica - Vídeo 2', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/D-E_A04ReTE?si=O1zAAksVfxPkzrxI' }
          ]),
          createTopic('Área e Volume de Cilindros, Cones e Esferas', 'EF09MA19, EF09MA20', 'Modelagem tridimensional de sólidos complexos e unidades práticas em contextos contemporâneos (armazenamento de dados: MB, GB).', [
            'https://www.youtube.com/embed/kSuPous5WPU',
            'https://www.youtube.com/embed/Pk-IOSEQ8sQ',
            'https://www.youtube.com/embed/7WpCm8fH1i8'
          ], [
            { videoTitle: 'Área e Volume de Cilindros, Cones e Esferas - Vídeo 1', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/kSuPous5WPU?si=zbvnRZHTEaspWj9N' },
            { videoTitle: 'Área e Volume de Cilindros, Cones e Esferas - Vídeo 2', channelName: 'Sandrocuriodicasdemat', videoLink: 'https://youtu.be/Pk-IOSEQ8sQ?si=z1i_x9RoZqyqtPq2' },
            { videoTitle: 'Área e Volume de Cilindros, Cones e Esferas - Vídeo 3', channelName: 'Giscomgiz', videoLink: 'https://youtu.be/7WpCm8fH1i8?si=DXpAO9Au0ncNPIZF' }
          ]),
          createTopic('Eventos Compostos e Estatística Crítica', 'EF09MA21, EF09MA22, EF09MA23', 'Cálculo aprofundado de probabilidade composta. Análise do uso ético de dados e distorções de gráficos na mídia e pesquisas.', [
            'https://www.youtube.com/embed/uZo7qSZASGk',
            'https://www.youtube.com/embed/5ctWgFOizkQ'
          ], [
            { videoTitle: 'Eventos Compostos e Estatística Crítica - Vídeo 1', channelName: 'Estudandomatematica', videoLink: 'https://youtu.be/uZo7qSZASGk?si=Y4-Ju4mXg-JvTo99' },
            { videoTitle: 'Eventos Compostos e Estatística Crítica - Vídeo 2', channelName: 'Professora Gisele Ramos', videoLink: 'https://youtu.be/5ctWgFOizkQ?si=HpMhVZesr1dflh5a' }
          ]),
        ],
      },
    ],
  },
  ciencias: {
    anosFinais: [
      {
        year: 6,
        label: '6º ano',
        topics: [
          createScienceTopic('Matéria e Energia', 'EF06CI01 a EF06CI04', 'Misturas homogêneas e heterogêneas, separação de materiais, materiais sintéticos e transformações químicas.', [
            'https://www.youtube.com/embed/XrpPBcXrcMU'
          ], [
            { videoTitle: 'Matéria e Energia', channelName: 'Ciencia Mapeada', videoLink: 'https://youtu.be/XrpPBcXrcMU?si=OUp22RQEL0Zwy5e2' }
          ]),
          createScienceTopic('Vida e Evolução', 'EF06CI05 a EF06CI10', 'Célula como unidade da vida, interação entre os sistemas locomotor e nervoso e lentes corretivas.', [
            'https://www.youtube.com/embed/VASPBcNFCzs'
          ], [
            { videoTitle: 'Vida e Evolução', channelName: 'Descomplica', videoLink: 'https://youtu.be/VASPBcNFCzs?si=idNXn3hQPD89DpK3' }
          ]),
          createScienceTopic('Terra e Universo', 'EF06CI11 a EF06CI14', 'Forma, estrutura e movimentos da Terra, além das camadas do planeta e tipos de rochas.', [
            'https://www.youtube.com/embed/sd9GcZpXZ7k'
          ], [
            { videoTitle: 'Terra e Universo', channelName: 'Smile and Learn Português', videoLink: 'https://youtu.be/sd9GcZpXZ7k?si=ULNqync1f57Ld317' }
          ]),
        ],
      },
      {
        year: 7,
        label: '7º ano',
        topics: [
          createScienceTopic('Máquinas Simples e Térmicas', 'EF07CI01, EF07CI06', 'Estudo das máquinas simples, propagação do calor, equilíbrio termodinâmico e a história dos combustíveis e máquinas térmicas.', [
            'https://www.youtube.com/embed/tvIk729n_rI'
          ], [
            { videoTitle: 'Máquinas Simples e Térmicas', channelName: 'com ciencia', videoLink: 'https://youtu.be/tvIk729n_rI?si=9HGaAhVh8vkuGMv5' }
          ]),
          createScienceTopic('Propagação do Calor e Termodinâmica', 'EF07CI02, EF07CI03, EF07CI04', 'Compreensão de calor, temperatura, sensação térmica, bem como condutores e isolantes térmicos em nosso cotidiano.', [
            'https://www.youtube.com/embed/BiNNerc1e9U',
            'https://www.youtube.com/embed/GYxXCr6HXcw'
          ], [
            { videoTitle: 'Propagação do Calor e Termodinâmica - Com Ciência', channelName: 'com ciencia', videoLink: 'https://youtu.be/BiNNerc1e9U?si=Z0TeGGc5I3_9hxr5' },
            { videoTitle: 'Propagação do Calor e Termodinâmica - Descomplica', channelName: 'descomplica', videoLink: 'https://youtu.be/GYxXCr6HXcw?si=Lgoc_j9tKeKexBWa' }
          ]),
          createScienceTopic('Diversidade de Ecossistemas e Seres Vivos', 'EF07CI07, EF07CI08', 'Exploração dos principais biomas brasileiros e a caracterização e importância dos vírus, bactérias, fungos e protozoários.', [
            'https://www.youtube.com/embed/ZcOdBxnDylM',
            'https://www.youtube.com/embed/Q-hAdfthiS8'
          ], [
            { videoTitle: 'Diversidade de Ecossistemas e Seres Vivos - Aprendendo Ciência', channelName: 'aprendendo ciencia', videoLink: 'https://youtu.be/ZcOdBxnDylM?si=pEYIdc189KC_8JYM' },
            { videoTitle: 'Diversidade de Ecossistemas e Seres Vivos - Descomplica', channelName: 'descomplica', videoLink: 'https://youtu.be/Q-hAdfthiS8?si=QSqBnGl_lfi1PdHK' }
          ]),
          createScienceTopic('Saúde Pública e Vacinas', 'EF07CI09, EF07CI10, EF07CI11', 'Estudo dos programas de saúde pública, saneamento básico, histórico das vacinas e mecanismos de defesa do corpo humano.', [
            'https://www.youtube.com/embed/LbMATf4I0vs',
            'https://www.youtube.com/embed/ak7LF6tg28w'
          ], [
            { videoTitle: 'Saúde Pública e Vacinas - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/LbMATf4I0vs?si=BU0xfeL3n9tv9LaU' },
            { videoTitle: 'Saúde Pública e Vacinas - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/ak7LF6tg28w?si=QvMsl5-Wl7CLw_wp' }
          ]),
          createScienceTopic('Composição do Ar, Efeito Estufa e Clima', 'EF07CI12, EF07CI13', 'Análise da atmosfera terrestre, efeito estufa natural, impacto da atividade humana e preservação da camada de ozônio.', [
            'https://www.youtube.com/embed/-Bb5pkye798',
            'https://www.youtube.com/embed/WrWN3eeN6d0',
            'https://www.youtube.com/embed/D3YQ6zl3-2M'
          ], [
            { videoTitle: 'Composição do Ar, Efeito Estufa e Clima - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/-Bb5pkye798?si=8PJRB_HXtHJZEpnB' },
            { videoTitle: 'Composição do Ar, Efeito Estufa e Clima - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/WrWN3eeN6d0?si=rWEhmZHh9c4GmsVT' },
            { videoTitle: 'Composição do Ar, Efeito Estufa e Clima - Descomplica', channelName: 'descomplica', videoLink: 'https://youtu.be/D3YQ6zl3-2M?si=BDM62qMqg7fhl_n5' }
          ]),
          createScienceTopic('Placas Tectônicas e Deriva Continental', 'EF07CI14, EF07CI15, EF07CI16', 'Investigação da estrutura interna da Terra, teoria da deriva continental, dinâmica de placas tectônicas, terremotos e vulcões.', [
            'https://www.youtube.com/embed/6Ea-OqwuVy8',
            'https://www.youtube.com/embed/VmYLlST-xw0'
          ], [
            { videoTitle: 'Placas Tectônicas e Deriva Continental - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/6Ea-OqwuVy8?si=66xIakg97wPa5BBA' },
            { videoTitle: 'Placas Tectônicas e Deriva Continental - Praticando Geografia', channelName: 'praticando geografia', videoLink: 'https://youtu.be/VmYLlST-xw0?si=mlR82TnWWx_0RgoJ' }
          ]),
        ],
      },
      {
        year: 8,
        label: '8º ano',
        topics: [
          createScienceTopic('Fontes e Tipos de Energia', 'EF08CI01, EF08CI02', 'Classificação de fontes de energia em renováveis e não renováveis, matrizes energéticas e o uso sustentável da energia.', [
            'https://www.youtube.com/embed/6DF3GpAfJOU'
          ], [
            { videoTitle: 'Fontes e Tipos de Energia - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/6DF3GpAfJOU?si=OtTJOAdmzzPEWSlX' }
          ]),
          createScienceTopic('Circuitos Elétricos e Consumo', 'EF08CI03, EF08CI04, EF08CI05', 'Funcionamento de circuitos elétricos residenciais, cálculo de consumo de eletricidade e práticas para o uso seguro de aparelhos.', [
            'https://www.youtube.com/embed/N0DnSlhijOU',
            'https://www.youtube.com/embed/GDT1uVbethI'
          ], [
            { videoTitle: 'Circuitos Elétricos e Consumo - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/N0DnSlhijOU?si=MO46SibteBH9OAFc' },
            { videoTitle: 'Circuitos Elétricos e Consumo - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/GDT1uVbethI?si=1DAym-s2H8_p9pR-' }
          ]),
          createScienceTopic('Mecanismos de Reprodução', 'EF08CI07, EF08CI08', 'Estudo comparativo dos processos de reprodução sexuada e assexuada em plantas, animais e outros seres vivos.', [
            'https://www.youtube.com/embed/xQ9wchie9Pc'
          ], [
            { videoTitle: 'Mecanismos de Reprodução - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/xQ9wchie9Pc?si=ugCwrGLnOTdJgZto' }
          ]),
          createScienceTopic('Sexualidade, Hormônios e Puberdade', 'EF08CI09, EF08CI10, EF08CI11', 'O papel do sistema endócrino e hormônios na puberdade, métodos contraceptivos, prevenção de ISTs e dimensões da sexualidade.', [
            'https://www.youtube.com/embed/oHaVYp4v5NI',
            'https://www.youtube.com/embed/OAtZQll0gM4'
          ], [
            { videoTitle: 'Sexualidade, Hormônios e Puberdade - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/oHaVYp4v5NI?si=PKCWGnq7hikbiNOh' },
            { videoTitle: 'Sexualidade, Hormônios e Puberdade - Minutos Psíquicos', channelName: 'minutos psiquicos', videoLink: 'https://youtu.be/OAtZQll0gM4?si=SfZjIojvEfI2lARO' }
          ]),
          createScienceTopic('Sistema Sol, Terra e Lua', 'EF08CI12, EF08CI13', 'Estudo dos movimentos celestes, fases da Lua, ocorrência de eclipses e a explicação científica para as estações do ano.', [
            'https://www.youtube.com/embed/QTzyluDk_jI'
          ], [
            { videoTitle: 'Sistema Sol, Terra e Lua - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/QTzyluDk_jI?si=3I3eknaUhjQpMaOW' }
          ]),
          createScienceTopic('Clima e Previsão do Tempo', 'EF08CI14, EF08CI15, EF08CI16', 'Variáveis climáticas, dinâmica das massas de ar, circulação atmosférica e a importância da previsão do tempo.', [
            'https://www.youtube.com/embed/ciWTNUeWADA',
            'https://www.youtube.com/embed/debZ-ChunPE'
          ], [
            { videoTitle: 'Clima e Previsão do Tempo - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/ciWTNUeWADA?si=2r6Q0MueJg-B1vCN' },
            { videoTitle: 'Clima e Previsão do Tempo - Canal Futura', channelName: 'canal futura', videoLink: 'https://youtu.be/debZ-ChunPE?si=U-2nv3FQQ7tiINh4' }
          ]),
        ],
      },
      {
        year: 9,
        label: '9º ano',
        topics: [
          createScienceTopic('Estrutura da Matéria e Modelos Atômicos', 'EF09CI01, EF09CI02, EF09CI03', 'Evolução dos modelos atômicos, estrutura básica da matéria, organização da tabela periódica e ligações químicas.', [
            'https://www.youtube.com/embed/fJJFZyau9b0',
            'https://www.youtube.com/embed/lDrKIqubzdw'
          ], [
            { videoTitle: 'Estrutura da Matéria e Modelos Atômicos - Estudai Oficial', channelName: 'Estudai oficial', videoLink: 'https://youtu.be/fJJFZyau9b0?si=5wdNOVg3F-qpNIgc' },
            { videoTitle: 'Estrutura da Matéria e Modelos Atômicos - Descomplica', channelName: 'Descomplica', videoLink: 'https://youtu.be/lDrKIqubzdw?si=vY7sdNzyQCY30hUW' }
          ]),
          createScienceTopic('Leis Ponderais e Reações Químicas', 'EF09CI04, EF09CI05', 'Aspectos quantitativos das transformações químicas, balanceamento de equações e as leis ponderais da conservação da massa.', [
            'https://www.youtube.com/embed/d-5oHTPpS9w',
            'https://www.youtube.com/embed/uMhJmoNlGz8'
          ], [
            { videoTitle: 'Leis Ponderais e Reações Químicas - Brasil Escola Oficial', channelName: 'Brasil escola oficial', videoLink: 'https://youtu.be/d-5oHTPpS9w?si=rvaAfGVCBGfu0mn9' },
            { videoTitle: 'Leis Ponderais e Reações Químicas - Toda Matéria Oficial', channelName: 'Toda matéria oficial', videoLink: 'https://youtu.be/uMhJmoNlGz8?si=2s4HLudaWyIrQwdc' }
          ]),
          createScienceTopic('Radiação Eletromagnética e Tecnologia', 'EF09CI06, EF09CI07', 'Conceito de ondas eletromagnéticas, o espectro eletromagnético e suas aplicações na comunicação e medicina diagnóstica.', [
            'https://www.youtube.com/embed/EuCQ7YdqHjE',
            'https://www.youtube.com/embed/T8UH402P0dM'
          ], [
            { videoTitle: 'Radiação Eletromagnética e Tecnologia - Canal Futura', channelName: 'Canal futura', videoLink: 'https://youtu.be/EuCQ7YdqHjE?si=EpnCjDKQNpyTOmD_' },
            { videoTitle: 'Radiação Eletromagnética e Tecnologia - Canal Futura', channelName: 'Canal futura', videoLink: 'https://youtu.be/T8UH402P0dM?si=vCD9s0NxBAtoH6JJ' }
          ]),
          createScienceTopic('Hereditariedade e Genética', 'EF09CI08, EF09CI09', 'Fundamentos da hereditariedade, estrutura do DNA, cromossomos, as primeiras leis de Mendel e transmissão de características biológicas.', [
            'https://www.youtube.com/embed/ThrqdDzS6To',
            'https://www.youtube.com/embed/-Vv3USW7iRU'
          ], [
            { videoTitle: 'Hereditariedade e Genética - Brasil Escola', channelName: 'Brasil escola', videoLink: 'https://youtu.be/ThrqdDzS6To?si=KS3iYaEEkrZNYzAu' },
            { videoTitle: 'Hereditariedade e Genética - Descomplica', channelName: 'Descomplica', videoLink: 'https://youtu.be/-Vv3USW7iRU?si=23ds1XGlaBjIPK_h' }
          ]),
          createScienceTopic('Evolução e Seleção Natural', 'EF09CI10 a EF09CI13', 'Análise das teorias evolucionistas de Lamarck e Darwin, seleção natural, especiação e a importância da preservação da biodiversidade.', [
            'https://www.youtube.com/embed/4WO-A_GaA1o',
            'https://www.youtube.com/embed/WZ-u3NUMkXc'
          ], [
            { videoTitle: 'Evolução e Seleção Natural - Descomplica', channelName: 'Descomplica', videoLink: 'https://youtu.be/4WO-A_GaA1o?si=A69pp1iHZBl8IpBZ' },
            { videoTitle: 'Evolução e Seleção Natural - Prof. Samuel Cunha', channelName: 'Professorsamuelcunha', videoLink: 'https://youtu.be/WZ-u3NUMkXc?si=gQ9zbvaojstuZ8MZ' }
          ]),
          createScienceTopic('Sistema Solar e Evolução Estelar', 'EF09CI14, EF09CI15, EF09CI16', 'Composição e estrutura do Sistema Solar, o ciclo evolutivo das estrelas e a localização da nossa galáxia no Universo.', [
            'https://www.youtube.com/embed/GFsXnof_N_E'
          ], [
            { videoTitle: 'Sistema Solar e Evolução Estelar - Canal Futura', channelName: 'Canal futura', videoLink: 'https://youtu.be/GFsXnof_N_E?si=jtCYmEK-tY9w0t-g' }
          ]),
          createScienceTopic('Viagem Espacial e Astronomia Cultural', 'EF09CI17, EF09CI18', 'A história da exploração e viagens espaciais, tecnologia de telescópios e a interpretação do céu sob a ótica de diferentes culturas.', [
            'https://www.youtube.com/embed/yQ4XlJaf8Zo',
            'https://www.youtube.com/embed/z6_7TrUUdUE'
          ], [
            { videoTitle: 'Viagem Espacial e Astronomia Cultural - Canal Futura', channelName: 'Canal futura', videoLink: 'https://youtu.be/yQ4XlJaf8Zo?si=gTDKpZ8VBuVWXcuZ' },
            { videoTitle: 'Viagem Espacial e Astronomia Cultural - Tinocando TV', channelName: 'Tinocando tv', videoLink: 'https://youtu.be/z6_7TrUUdUE?si=3v5GxwMWoAw4iG7S' }
          ]),
        ],
      },
    ],
  },
  portugues: {
    anosFinais: [
      {
        year: 6,
        label: '6º ano',
        topics: [
          createTopic('Campo Jornalístico-Midiático', 'EF69LP03, EF06LP01', 'Estudo da estrutura de notícias, distinguindo fatos de opiniões, e a análise de manchetes e lides no ambiente impresso e digital.', [
            'https://www.youtube.com/embed/0Khpnvuya_0'
          ], [
            { videoTitle: 'Campo Jornalístico-Midiático', channelName: 'DAMARIS MAGNUS', videoLink: 'https://youtu.be/0Khpnvuya_0?si=PWMfBEZD3yiuZjHj' }
          ]),
          createTopic('Campo de Atuação na Vida Pública', 'EF69LP20, EF67LP15', 'Compreensão de textos normativos e legais, como regras de convivência escolar, estatutos e a estrutura dos direitos da criança.', [
            'https://www.youtube.com/embed/bsq8VE6cy5g'
          ], [
            { videoTitle: 'Campo de Atuação na Vida Pública', channelName: 'IEL  unicamp', videoLink: 'https://www.youtube.com/live/bsq8VE6cy5g?si=Wxrv5daUBYrYBhjj' }
          ]),
          createTopic('Práticas de Estudo e Pesquisa', 'EF69LP29, EF67LP25', 'Leitura e produção de resumos para sintetizar informações essenciais de textos de divulgação científica e estudos escolares.', [
            'https://www.youtube.com/embed/OanSFguzZJs'
          ], [
            { videoTitle: 'Resumo: Como Fazer?', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/OanSFguzZJs' }
          ]),
          createTopic('Campo Artístico-Literário', 'EF69LP44, EF67LP27', 'Leitura e análise dos gêneros literários clássicos (lírico, épico e dramático) com foco na compreensão de contos e poemas.', [
            'https://www.youtube.com/embed/9T7-gOm0nGk'
          ], [
            { videoTitle: 'Gêneros Literários', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/9T7-gOm0nGk' }
          ]),
          createTopic('Análise Linguística e Semiótica', 'EF69LP55, EF06LP04', 'Identificação e classificação de substantivos, variação de gênero e número, e a sua função na coesão textual.', [
            'https://www.youtube.com/embed/XF6yNsdAIfs',
            'https://www.youtube.com/embed/_ARc8NgM3jo'
          ], [
            { videoTitle: 'Análise Linguística e Semiótica', channelName: 'Aqui tem comunicação eliane', videoLink: 'https://youtu.be/XF6yNsdAIfs?si=dtslc__Y17o9ixHH' },
            { videoTitle: 'Análise Linguística e Semiótica', channelName: 'nicollinha_YT', videoLink: 'https://youtu.be/_ARc8NgM3jo?si=vl7zI6TBl_Q1By_O' }
          ]),
        ],
      },
      {
        year: 7,
        label: '7º ano',
        topics: [
          createTopic('Leitura e Produção de Textos Jornalísticos', 'EF67LP01, EF67LP08', 'Identificação de efeitos de sentido em textos multissemióticos (memes, tirinhas, charges), reconhecimento de ironia e humor crítico em gêneros jornalísticos.', [
            'https://www.youtube.com/embed/Ucjv4LT8CSg'
          ], [
            { videoTitle: 'Gêneros Textuais', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/Ucjv4LT8CSg' }
          ]),
          createTopic('Textos Normativos e Reivindicatórios', 'EF67LP16, EF67LP19', 'Produção de cartas de reclamação, abaixo-assinados e textos de reivindicação coletiva, compreendendo direitos e deveres do cidadão.', [
            'https://www.youtube.com/embed/tNEORwjvIwI'
          ], [
            { videoTitle: 'Carta: Como Fazer em Vestibulares?', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/tNEORwjvIwI' }
          ]),
          createTopic('Pesquisa e Divulgação Científica', 'EF67LP20, EF67LP26', 'Estruturação de relatórios de pesquisa escolar, uso de citações e referências, e produção de resumos e fichamentos de textos científicos.', [
            'https://www.youtube.com/embed/sjflNG4gS_8'
          ], [
            { videoTitle: 'Relatório: Como Escrever?', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/sjflNG4gS_8' }
          ]),
          createTopic('Narrativas e Crônicas Literárias', 'EF67LP27, EF67LP28', 'Leitura de contos, crônicas e HQs, identificando elementos da narrativa (narrador, personagem, tempo, espaço) e efeitos de sentido no texto literário.', [
            'https://www.youtube.com/embed/Oikb9X5tUas'
          ], [
            { videoTitle: 'Crônica: Características do Gênero', channelName: 'Brasil Escola', videoLink: 'https://youtu.be/Oikb9X5tUas' }
          ]),
          createTopic('Morfossintaxe: Estrutura da Oração', 'EF07LP04, EF07LP07', 'Identificação de sujeito e predicado, tipos de sujeito (simples, composto, oculto, indeterminado), e introdução à transitividade verbal.', [
            'https://www.youtube.com/embed/d3n-w6YHwOc'
          ], [
            { videoTitle: 'Sujeito e Predicado', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/d3n-w6YHwOc' }
          ]),
        ],
      },
      {
        year: 8,
        label: '8º ano',
        topics: [
          createTopic('Argumentação e Mídia Digital', 'EF89LP01, EF89LP02', 'Análise de textos opinativos em mídias digitais (blogs, vlogs, podcasts), identificação de estratégias de persuasão, fake news e vieses editoriais.', [
            'https://www.youtube.com/embed/CChmOEkhRDY'
          ], [
            { videoTitle: 'Gêneros Textuais no ENEM', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/CChmOEkhRDY' }
          ]),
          createTopic('Participação em Debates e Assembleias', 'EF89LP12, EF89LP18', 'Planejamento e participação em debates regrados e assembleias escolares, com uso de operadores argumentativos e respeito aos turnos de fala.', [
            'https://www.youtube.com/embed/8053oXdk2Pc'
          ], [
            { videoTitle: 'Debate Regrado em 4 Minutos', channelName: 'Adoro Saber', videoLink: 'https://youtu.be/8053oXdk2Pc' }
          ]),
          createTopic('Resenha Crítica e Seminários', 'EF89LP24, EF89LP25', 'Produção de resenhas críticas sobre obras literárias e filmes, além de apresentações orais em formato de seminário com recursos audiovisuais.', [
            'https://www.youtube.com/embed/zUFccId5eGU'
          ], [
            { videoTitle: 'Resenha Crítica: Como Fazer?', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/zUFccId5eGU' }
          ]),
          createTopic('Romance, Teatro e Poesia de Protesto', 'EF89LP33, EF89LP34', 'Leitura e análise de romances contemporâneos, textos dramáticos e poemas de protesto, explorando o papel social da literatura brasileira.', [
            'https://www.youtube.com/embed/n0e75nRstcU'
          ], [
            { videoTitle: 'Figuras de Linguagem: Aprenda de Vez', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/n0e75nRstcU' }
          ]),
          createTopic('Período Composto e Vozes Verbais', 'EF08LP06, EF08LP08', 'Estudo do período composto por coordenação, orações coordenadas (sindéticas e assindéticas), diferença entre vozes verbais ativa, passiva e reflexiva.', [
            'https://www.youtube.com/embed/XvcRzS7nP6M'
          ], [
            { videoTitle: 'Vozes Verbais', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/XvcRzS7nP6M' }
          ]),
        ],
      },
      {
        year: 9,
        label: '9º ano',
        topics: [
          createTopic('Artigo de Opinião e Editorial', 'EF89LP03, EF89LP04', 'Produção e análise de artigos de opinião e editoriais, identificando tese, argumentos, contra-argumentos e proposta de intervenção social.', [
            'https://www.youtube.com/embed/_S3w9FepIFE'
          ], [
            { videoTitle: 'Artigo de Opinião: Estrutura', channelName: 'Brasil Escola', videoLink: 'https://youtu.be/_S3w9FepIFE' }
          ]),
          createTopic('Legislação, Estatutos e Manifestos', 'EF89LP17, EF89LP19', 'Análise e produção de textos legais (estatutos, manifestos, cartas abertas), compreendendo a função social dos documentos que regem a cidadania.', [
            'https://www.youtube.com/embed/NdsqGqal_FM'
          ], [
            { videoTitle: 'Leitura de Estatutos e Leis', channelName: 'Aula Paraná', videoLink: 'https://youtu.be/NdsqGqal_FM' }
          ]),
          createTopic('Projeto de Pesquisa e Artigo Científico', 'EF89LP25, EF89LP26', 'Elaboração de projetos de pesquisa com introdução, metodologia e conclusão, uso de paráfrase, citação direta e normas ABNT básicas.', [
            'https://www.youtube.com/embed/ALB7mxfZvAs'
          ], [
            { videoTitle: 'Intertextualidade e Paráfrase', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/ALB7mxfZvAs' }
          ]),
          createTopic('Vanguardas e Literatura Brasileira Contemporânea', 'EF89LP35, EF89LP36', 'Estudo das Vanguardas Europeias e do Modernismo brasileiro, análise de poemas de Drummond, Bandeira e Cecília Meireles, e intertextualidade literária.', [
            'https://www.youtube.com/embed/ALB7mxfZvAs'
          ], [
            { videoTitle: 'Intertextualidade e Paráfrase', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/ALB7mxfZvAs' }
          ]),
          createTopic('Orações Subordinadas e Concordância', 'EF09LP04, EF09LP06', 'Estudo das orações subordinadas substantivas, adjetivas e adverbiais, concordância verbal e nominal, e regência para argumentação em redações.', [
            'https://www.youtube.com/embed/_kzTFOzf-_w'
          ], [
            { videoTitle: 'Orações Subordinadas Substantivas', channelName: 'Prof. Noslen', videoLink: 'https://youtu.be/_kzTFOzf-_w' }
          ]),
        ],
      },
    ],
  },
};

