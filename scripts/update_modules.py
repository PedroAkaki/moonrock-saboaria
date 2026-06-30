import json

with open('data/learning-modules.json', 'r', encoding='utf-8') as f:
    modules = json.load(f)

# Level 1
modules[0]['studyCards'] = [
    {
        'title': 'Base Glicerinada (M&P)',
        'definition': 'Sabão já saponificado industrialmente. Composto por sais de ácidos graxos, glicerol, água e solventes.',
        'whyItMatters': 'Elimina o risco de manipular soda cáustica, mas introduz desafios térmicos e de compatibilidade química com aditivos.',
        'commonMistake': 'Achar que base transparente pode ferver. Acima de 70°C, a água evapora e a base perde transparência permanentemente.',
        'practicalSignal': 'Base turva ou com bolhas após resfriamento = superaquecimento ou agitação excessiva.'
    },
    {
        'title': 'Higroscopia da Glicerina',
        'definition': 'A glicerina atrai água do ar. Em ambientes úmidos (>60% UR), a superfície do sabão acumula gotículas.',
        'whyItMatters': 'Sabonetes mal embalados suam e perdem qualidade estética e durabilidade.',
        'commonMistake': 'Deixar o sabão sem embalagem após o preparo. Filme PVC não é opcional — é barreira física.',
        'practicalSignal': 'Gotículas na superfície após alguns dias = sinérese por alta umidade.'
    }
]
modules[0]['quickReview'] = [
    'A base já está saponificada — não há reação química nova, apenas fusão e moldagem.',
    'Temperatura máxima: 70°C. Acima disso, perde transparência.',
    'Glicerina é higroscópica: embalar em filme PVC imediatamente.',
    'Aditivos líquidos acima de 10% podem impedir a solidificação.',
    'Bolhas se eliminam com borrifada de álcool antes de despejar.',
    'Fragrância deve ser adicionada quando a base estiver líquida, não fervendo.'
]
modules[0]['quiz'] = [
    {
        'id': 'mp1',
        'type': 'multiple-choice',
        'question': 'O que acontece se a base glicerinada for aquecida acima de 75-80°C?',
        'options': [
            'Ela derrete mais rápido e fica mais transparente.',
            'A água evapora, a base perde transparência e pode caramelizar.',
            'Ela se transforma em sabão líquido.',
            'Nada — a base é resistente até 100°C.'
        ],
        'correctAnswer': 'A água evapora, a base perde transparência e pode caramelizar.',
        'explanation': 'Acima de 75°C, a água e o álcool da base evaporam. Isso quebra a estrutura cristalina homogênea, deixando o sabão opaco e quebradiço.'
    },
    {
        'id': 'mp2',
        'type': 'true-false',
        'question': 'O fenômeno de "suor" na base glicerinada ocorre porque a glicerina é higroscópica e atrai umidade do ar.',
        'correctAnswer': True,
        'explanation': 'Correto. A glicerina é um umectante natural. Em ambientes com umidade relativa acima de 60%, ela absorve água da atmosfera, formando gotículas na superfície.'
    },
    {
        'id': 'mp3',
        'type': 'short',
        'question': 'Qual a principal diferença entre a base glicerinada e o Cold Process?',
        'correctAnswer': 'no cold process a saponificacao acontece na bancada',
        'explanation': 'Na base glicerinada, a saponificação já ocorreu industrialmente. No Cold Process, a reação entre óleos e NaOH acontece na bancada do saboeiro.'
    }
]
modules[0]['beforePracticeChecklist'] = [
    'Sei que o risco principal é queimadura por base quente (não soda).',
    'Sei que a variável crítica é a temperatura (não passar de 70°C).',
    'Sei que o erro comum é não embalar em filme PVC após o preparo.',
    'Sei que vou observar a transparência e a presença de bolhas.'
]

# Level 2
modules[1]['studyCards'] = [
    {
        'title': 'Degradação Térmica de Óleos',
        'definition': 'Durante a fritura, os triglicerídeos sofrem hidrólise, oxidação e polimerização, formando AGL (ácidos graxos livres), peróxidos e compostos polares.',
        'whyItMatters': 'Óleo degradado tem SAP incerto. Sem titulação, não se sabe exatamente quanto NaOH é necessário.',
        'commonMistake': 'Achar que qualquer óleo usado serve para sabonete corporal. Não serve — é produto de limpeza doméstica.',
        'practicalSignal': 'Sabão de óleo usado bem-feito é duro, escuro, com cheiro neutro ou de essência de limpeza.'
    },
    {
        'title': 'Superfat Alto para Segurança',
        'definition': 'Para compensar a incerteza do SAP do óleo degradado, usa-se superfat alto (10-15%). Isso garante que não sobre soda livre.',
        'whyItMatters': 'Soda livre causa queimaduras na pele. Em sabão de limpeza, excesso de soda é inaceitável.',
        'commonMistake': 'Usar superfat baixo (5%) igual ao sabonete cosmético. No óleo usado, corre-se risco de soda livre.',
        'practicalSignal': 'Sabão com pH acima de 10 ou que arde na língua no teste de zap = soda livre.'
    }
]
modules[1]['quickReview'] = [
    'Óleo usado sofre degradação térmica — SAP é imprevisível.',
    'Sabão de óleo usado é LIMPEZA DOMÉSTICA, não cosmético.',
    'Usar superfat alto (10-15%) para margem de segurança.',
    'Filtrar o óleo ainda morno. Óleo com água residual pode projetar soda.',
    'Cura: 4 semanas. Testar pH antes de usar.',
    'Nunca usar sabão de óleo usado no corpo.'
]
modules[1]['quiz'] = [
    {
        'id': 'ou1',
        'type': 'multiple-choice',
        'question': 'Por que o sabão de óleo usado não deve ser usado como sabonete corporal?',
        'options': [
            'Porque a cor escura mancha a pele.',
            'Porque contém impurezas, agentes oxidativos e risco de soda livre devido ao SAP incerto.',
            'Porque o cheiro é desagradável.',
            'Porque não faz espuma suficiente.'
        ],
        'correctAnswer': 'Porque contém impurezas, agentes oxidativos e risco de soda livre devido ao SAP incerto.',
        'explanation': 'Óleo de cozinha usado contém produtos de oxidação, resíduos de alimentos e polímeros de degradação. O SAP é incerto, então o cálculo de soda é menos preciso que com óleos virgens.'
    },
    {
        'id': 'ou2',
        'type': 'true-false',
        'question': 'Para compensar a variação do SAP no óleo usado, recomenda-se usar superfat baixo (0-3%).',
        'correctAnswer': False,
        'explanation': 'Falso. Para compensar a incerteza do SAP, usa-se superfat alto (10-15%). Isso garante que não haja soda livre no sabão final.'
    }
]
modules[1]['beforePracticeChecklist'] = [
    'Sei que este sabão é de LIMPEZA, não cosmético.',
    'Sei que o SAP do óleo usado é imprevisível.',
    'Sei que o erro comum é não filtrar o óleo adequadamente.',
    'Sei que vou usar superfat alto (10-15%) para segurança.'
]

# Level 3
modules[2]['studyCards'] = [
    {
        'title': 'Saponificação (Hidrólise Alcalina)',
        'definition': 'Reação onde um triglicerídeo reage com base forte (NaOH), quebrando a ligação éster e formando sal de ácido graxo (sabão) e glicerol.',
        'whyItMatters': 'É a reação fundamental. Sem entendê-la, não há como diagnosticar falhas de trace ou cura.',
        'commonMistake': 'Achar que a água participa da reação. A água é apenas solvente para a soda.',
        'practicalSignal': 'A massa engrossa (trace) conforme os reagentes se consomem e o sabão é formado.'
    },
    {
        'title': 'Superfat',
        'definition': 'Percentual de óleo planejado para permanecer não saponificado na fórmula final.',
        'whyItMatters': 'Cria margem de segurança contra excesso de soda e altera o sensorial da barra.',
        'commonMistake': 'Achar que mais é sempre melhor. Superfat alto reduz espuma, amolece a barra e aumenta risco de DOS.',
        'practicalSignal': 'Barras com DOS (manchas laranjas) podem ter superfat mal calculado para o perfil de óleos.'
    },
    {
        'title': 'Trace (Traço)',
        'definition': 'Estágio da emulsão onde a mistura engrossa o suficiente para deixar rastro na superfície ao ser mexida.',
        'whyItMatters': 'É o ponto de não retorno para aditivos. Define se o sabão vai fluido ou espesso para o molde.',
        'commonMistake': 'Confundir emulsão temporária com trace verdadeiro.',
        'practicalSignal': 'Trace leve: textura de leite. Trace médio: rastro claro. Trace pesado: textura de pudim.'
    },
    {
        'title': 'Cura',
        'definition': 'Período pós-moldagem (mínimo 4 semanas) onde o sabão perde água e a saponificação se completa.',
        'whyItMatters': 'Sabão jovem é macio, dissolve rápido e pode ser alcalino demais na pele.',
        'commonMistake': 'Usar o sabão antes da cura porque endureceu. Dureza não é sinônimo de cura química.',
        'practicalSignal': 'O sabão encolhe ligeiramente e a superfície fica seca ao toque após algumas semanas.'
    }
]
modules[2]['quickReview'] = [
    'NaOH = massa do óleo × SAP × (1 - superfat).',
    'SAP é uma média estatística, não verdade absoluta para todo lote.',
    'Emulsão (mistura física) não é igual a trace (início do espessamento químico).',
    'Temperatura altera a velocidade do trace (mais quente = mais rápido).',
    'Cura melhora dureza e desempenho (evaporação + reação completa).',
    'INS/DOS são estimativas heuristicas, não medidores laboratoriais.',
    'Soda SEMPRE vai na água, nunca o contrário.'
]
modules[2]['quiz'] = [
    {
        'id': 'cp1',
        'type': 'multiple-choice',
        'question': 'Por que a soda cáustica (NaOH) deve sempre ser adicionada à água, e não o contrário?',
        'options': [
            'Porque a água dissolve mais rápido a soda se for jogada por cima.',
            'Porque adicionar água na soda gera calor localizado extremo, causando ebulição instantânea e projeção corrosiva.',
            'Porque a reação química só ocorre nesta ordem.',
            'Porque facilita a medição de temperatura.'
        ],
        'correctAnswer': 'Porque adicionar água na soda gera calor localizado extremo, causando ebulição instantânea e projeção corrosiva.',
        'explanation': 'A dissolução do NaOH é altamente exotérmica. Adicionar água à soda aquece a superfície da soda instantaneamente, projetando solução corrosiva. Adicionar soda à água dissipa o calor na massa líquida maior.'
    },
    {
        'id': 'cp2',
        'type': 'true-false',
        'question': 'Se um sabonete endureceu no molde após 2 dias, significa que a saponificação terminou e está pronto para uso.',
        'correctAnswer': False,
        'explanation': 'Falso. O endurecimento é físico (perda inicial de água e cristalização). A saponificação residual e a evaporação continuam por semanas (cura). Usar antes resulta em sabão macio e agressivo à pele.'
    },
    {
        'id': 'cp3',
        'type': 'short',
        'question': 'Qual fenômeno de oxidação aparece como manchas alaranjadas no sabão, associado a óleos insaturados ou superfat alto?',
        'correctAnswer': 'DOS',
        'explanation': 'DOS (Dreaded Orange Spots) é a rancificação oxidativa dos óleos não saponificados. Comum em fórmulas com alto superfat e óleos insaturados armazenados em local quente e úmido.'
    }
]
modules[2]['beforePracticeChecklist'] = [
    'Sei que o risco principal é a manipulação da soda cáustica (corrosiva).',
    'Sei que a variável mais crítica é a precisão da pesagem e a temperatura.',
    'Sei que o erro comum é deixar o trace passar do ponto antes de moldar.',
    'Sei que vou observar o comportamento da fragrância (se acelera o trace) e a textura da massa.'
]

with open('data/learning-modules.json', 'w', encoding='utf-8') as f:
    json.dump(modules, f, ensure_ascii=False, indent=2)

print('learning-modules.json atualizado')
print(f'Nivel 1: {len(modules[0].get("studyCards",[]))} cards, {len(modules[0].get("quiz",[]))} quiz')
print(f'Nivel 2: {len(modules[1].get("studyCards",[]))} cards, {len(modules[1].get("quiz",[]))} quiz')
print(f'Nivel 3: {len(modules[2].get("studyCards",[]))} cards, {len(modules[2].get("quiz",[]))} quiz')
