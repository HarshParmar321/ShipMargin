export type SiteLocale = 'pt-br' | 'es';

export const localizedSites = {
  'pt-br': {
    locale: 'pt-br' as const,
    homePath: '/pt-br/',
    optimizerPath: '/pt-br/otimizador-de-caixas/',
    home: {
      title: 'Calculadoras de Frete, Peso Cubado e Margem | ShippingMath',
      description: 'Ferramentas gratuitas para comparar caixas, peso cubado, custo de frete e margem. Sem cadastro e com processamento local.',
      eyebrow: 'Grátis · privado · em português',
      heading: 'Proteja sua margem antes de comprar a etiqueta.',
      intro: 'Compare embalagens, peso faturável e custo total. Os cálculos são feitos no seu navegador e os dados não são enviados.',
      cta: 'Comparar minhas caixas →',
      trust: ['Sem cadastro', 'Métrico + imperial', 'Processado localmente'],
      sectionEyebrow: 'Feito para decisões rápidas',
      sectionHeading: 'Um cálculo claro antes de cada envio.',
      sectionIntro: 'Veja a resposta, compare as opções e volte ao trabalho.',
      cards: [
        ['Veja o peso cobrado', 'Compare peso real, peso cubado e peso faturável sem decifrar regras confusas.'],
        ['Proteja a margem', 'Inclua embalagem, frete e taxas para descobrir o preço mínimo de venda.'],
        ['Compare suas caixas', 'Teste as embalagens disponíveis e escolha a opção válida com menor custo total.'],
      ],
    },
    optimizer: {
      title: 'Otimizador de caixas e margem — Comparar embalagens | ShippingMath',
      description: 'Compare caixas disponíveis, reduza o peso cubado, estime a economia mensal e calcule o preço necessário para atingir sua margem.',
      crumb: 'Otimizador de caixas', eyebrow: 'Grátis · local · pensado para celular',
      heading: 'Escolha a caixa que protege sua margem.',
      intro: 'Compare suas embalagens por tamanho, peso faturável e custo total. Veja imediatamente a melhor opção válida.',
      why: 'Por que a caixa mais barata nem sempre gera o frete mais barato',
      whyText: 'Uma embalagem barata pode aumentar o peso cubado. A ShippingMath compara o custo da embalagem com o frete estimado e elimina caixas nas quais o produto não cabe, mesmo após girá-lo.',
      includes: 'O que esta estimativa inclui',
      bullets: ['O maior valor entre o peso real e o peso cubado calculado.', 'O custo informado para cada embalagem disponível.', 'Seu custo estimado de transporte por unidade de peso faturável.', 'Custo do produto, outras taxas e margem desejada, quando informados.'],
      noticeTitle: 'Estimativa para planejamento:',
      notice: 'tarifas, adicionais, formas de medição e regras contratuais podem variar. Confirme a caixa escolhida e o preço real da etiqueta antes de alterar sua operação.',
    },
    info: {
      metodologia: {
        title: 'Metodologia de cálculo | ShippingMath', description: 'Como a ShippingMath calcula peso cubado, peso faturável, economia e margem.', eyebrow: 'Cálculos transparentes', heading: 'Metodologia', intro: 'Toda resposta deve ser reproduzível. Estas são as premissas usadas nas ferramentas gratuitas.',
        sections: [['Medidas da embalagem', 'Informe as dimensões externas da embalagem pronta, incluindo saliências e material de proteção. Quando o arredondamento está ativo, cada lado é arredondado para cima antes do cálculo do volume.'], ['Peso cubado', 'O volume é dividido pelo fator selecionado. Esse fator é uma referência de planejamento; use o divisor e o arredondamento definidos no seu contrato.'], ['Peso faturável', 'A calculadora compara o peso físico arredondado com o peso cubado arredondado e mostra o maior valor. Faturas reais podem incluir mínimos, adicionais e regras negociadas.'], ['Margem', 'O lucro estimado desconta produto, embalagem, frete e taxas do preço de venda. Impostos, devoluções, descontos e câmbio ficam fora desta estimativa simplificada.'], ['Brasil', 'Correios (SEDEX e PAC): fator 6.000; encomendas com peso volumétrico de até 5 kg são cobradas pelo peso físico (termo de condições dos Correios). Loggi: 167 kg/m³ (≈ 5.988). Amazon FBA Brasil: 6.000. Não confirmamos o fator do Mercado Livre, da Jadlog nem da Total Express em fonte oficial. Os Correios não publicam regra de arredondamento, então usamos as medidas exatas.'], ['Regras revisadas em 24 de outubro de 2026', 'UPS Daily Rates: divisor 139; UPS Retail Rates: 166; medidas arredondadas para cima (fonte: guia de dimensões da UPS). USPS: divisor 139, medidas arredondadas para cima e peso cubado apenas acima de 1.728 pol³, desde 12/07/2026 (fonte: Postal Bulletin 22705 da USPS). FedEx: divisor 139; a página da FedEx Canadá indica arredondar para cima e a página de ajuda dos EUA indica o inteiro mais próximo, por isso usamos “para cima” por padrão. Serviços expressos internacionais costumam usar 5.000 cm³/kg; alguns usam 6.000. Os links das fontes estão na página de metodologia em inglês.']],
      },
      privacidade: {
        title: 'Privacidade | ShippingMath', description: 'Como a ShippingMath mantém os dados das calculadoras no seu dispositivo.', eyebrow: 'Privacidade desde o projeto', heading: 'Seus dados de envio continuam sendo seus.', intro: 'As calculadoras e a auditoria CSV funcionam no navegador sem enviar os dados da embalagem.',
        sections: [['Cálculos locais', 'Medidas, pesos, preços e arquivos CSV são processados no dispositivo. A versão gratuita não exige conta nem armazena os dados informados em um servidor.'], ['Links compartilháveis', 'Um link pode incluir medidas básicas, sistema de unidades e divisor. Não inclua dados de clientes ou informações confidenciais.'], ['Análise de uso', '{cf}No momento não usamos cookies de análise. No futuro poderemos usar o Google Analytics 4; nesse caso, medidas, preços, nomes de arquivos, SKUs e conteúdo de CSV não serão enviados, e esta página será atualizada antes.'], ['Publicidade', 'No momento não exibimos anúncios. No futuro poderemos usar o Google AdSense; o Google e seus parceiros poderão então usar cookies para exibir anúncios, e você poderá desativar anúncios personalizados nas Configurações de anúncios do Google.'], ['Consentimento', 'Antes de usar cookies de análise ou publicidade, visitantes do EEE, Reino Unido e Suíça receberão um pedido de consentimento por uma ferramenta certificada pelo Google, e essas tags respeitarão a escolha.'], ['Hospedagem', 'O site é hospedado na Cloudflare, que processa dados técnicos, como endereços IP, para entregar as páginas com segurança.'], ['Contato', 'Dúvidas sobre privacidade: {email}. Responsável: Harsh Parmar.'], ['Atualização', 'Última atualização: 24 de outubro de 2026. Responsável: Harsh Parmar.']],
      },
      termos: {
        title: 'Termos de uso | ShippingMath', description: 'Termos para usar as calculadoras gratuitas da ShippingMath.', eyebrow: 'Termos objetivos', heading: 'Estimativas úteis, decisões verificadas.', intro: 'A ShippingMath ajuda a conferir os cálculos. O contrato com a transportadora continua sendo a fonte final.',
        sections: [['Uso das ferramentas', 'Você pode usar as calculadoras e a auditoria local para planejamento pessoal ou comercial. Não use o serviço para violar leis ou tentar acesso não autorizado.'], ['Estimativas, não cotações', 'Os resultados dependem das medidas, divisor, arredondamento e custos informados. Confirme decisões importantes na documentação atual da transportadora.'], ['Seus dados', 'Você é responsável pelos dados inseridos e por preservar a privacidade dos clientes.']],
      },
      sobre: {
        title: 'Sobre a ShippingMath', description: 'Por que a ShippingMath existe e como as ferramentas gratuitas ajudam vendedores.', eyebrow: 'Sobre o projeto', heading: 'Cálculos de frete devem levar a uma decisão.', intro: 'A ShippingMath transforma medidas de embalagem em sinais claros de custo e margem.',
        sections: [['Quem faz', 'A ShippingMath é criada e mantida por Harsh Parmar, desenvolvedor independente. O projeto nasceu ao ver quantos pequenos vendedores perdem margem com o peso cubado sem perceber.'], ['Por que criamos', 'Muitas calculadoras param na fórmula. A ShippingMath reúne peso real, peso cubado, peso faturável, volume e margem para ajudar você a decidir entre trocar a caixa, o preço ou a cobrança de frete.'], ['O que não somos', 'A ShippingMath é uma ferramenta independente de planejamento. Não somos transportadora, sistema contábil ou cotação de postagem.'], ['Grátis primeiro', 'O produto inicial é gratuito e não exige cadastro. Recursos pagos só serão considerados para necessidades recorrentes como catálogos salvos, integrações ou relatórios de equipe.']],
      },
      contato: {
        title: 'Contato | ShippingMath', description: 'Fale com a ShippingMath sobre correções, sugestões e parcerias.', eyebrow: 'Seu feedback melhora a ferramenta', heading: 'Encontrou uma regra que devemos revisar?', intro: 'Aceitamos correções de cálculo, sugestões de fluxo e propostas de parceria.',
        sections: [['E-mail', 'Escreva para {email}. A ShippingMath é mantida por Harsh Parmar e todas as mensagens são lidas pessoalmente.'], ['Como relatar um erro de cálculo', 'Informe transportadora, serviço, país de destino, as medidas e o peso utilizados e um link para a regra ou tabela pública com a qual você está comparando.'], ['Proteja a privacidade', 'Nunca envie nomes, endereços, códigos de rastreamento, notas fiscais ou exportações de pedidos sem remover dados pessoais.']],
      },
    },
  },
  es: {
    locale: 'es' as const,
    homePath: '/es/',
    optimizerPath: '/es/optimizador-de-cajas/',
    home: {
      title: 'Calculadoras de Envío, Peso Volumétrico y Margen | ShippingMath',
      description: 'Herramientas gratuitas para comparar cajas, peso volumétrico, costes de envío y margen. Sin registro y con procesamiento local.',
      eyebrow: 'Gratis · privado · en español',
      heading: 'Protege tu margen antes de comprar la etiqueta.',
      intro: 'Compara embalajes, peso facturable y coste total. Los cálculos se realizan en tu navegador y tus datos no se envían.',
      cta: 'Comparar mis cajas →',
      trust: ['Sin registro', 'Métrico + imperial', 'Procesado localmente'],
      sectionEyebrow: 'Creado para decisiones rápidas',
      sectionHeading: 'Un cálculo claro antes de cada envío.',
      sectionIntro: 'Consulta el resultado, compara las opciones y continúa con tu trabajo.',
      cards: [
        ['Mira el peso facturable', 'Compara el peso real, volumétrico y facturable sin descifrar reglas confusas.'],
        ['Protege el margen', 'Añade embalaje, envío y comisiones para conocer el precio mínimo de venta.'],
        ['Compara tus cajas', 'Prueba los embalajes disponibles y elige la opción válida con menor coste total.'],
      ],
    },
    optimizer: {
      title: 'Optimizador de cajas y margen — Comparar embalajes | ShippingMath',
      description: 'Compara cajas disponibles, reduce el peso volumétrico, estima el ahorro mensual y calcula el precio necesario para tu margen objetivo.',
      crumb: 'Optimizador de cajas', eyebrow: 'Gratis · local · pensado para móvil',
      heading: 'Elige la caja que protege tu margen.',
      intro: 'Compara tus embalajes por tamaño, peso facturable y coste total. Consulta inmediatamente la mejor opción válida.',
      why: 'Por qué la caja más barata no siempre produce el envío más barato',
      whyText: 'Una caja económica puede aumentar el peso volumétrico. ShippingMath compara el coste del embalaje con el envío estimado y descarta las cajas en las que el producto no cabe, incluso después de girarlo.',
      includes: 'Qué incluye esta estimación',
      bullets: ['El mayor valor entre el peso real y el peso volumétrico calculado.', 'El coste indicado para cada embalaje disponible.', 'Tu coste de transporte estimado por unidad de peso facturable.', 'Coste del producto, otras comisiones y margen objetivo cuando se facilitan.'],
      noticeTitle: 'Estimación para planificación:',
      notice: 'las tarifas, recargos, métodos de medición y reglas contractuales pueden variar. Confirma la caja elegida y el precio real de la etiqueta antes de modificar tu operación.',
    },
    info: {
      metodologia: {
        title: 'Metodología de cálculo | ShippingMath', description: 'Cómo calcula ShippingMath el peso volumétrico, el peso facturable, el ahorro y el margen.', eyebrow: 'Cálculos transparentes', heading: 'Metodología', intro: 'Cada respuesta debe poder reproducirse. Estas son las premisas de las herramientas gratuitas.',
        sections: [['Medidas del paquete', 'Introduce las dimensiones exteriores del paquete terminado, incluidos los salientes y el material protector. Con el redondeo activo, cada lado se redondea hacia arriba antes de calcular el volumen.'], ['Peso volumétrico', 'El volumen se divide por el factor elegido. Ese factor es una referencia de planificación; utiliza el divisor y el redondeo de tu contrato.'], ['Peso facturable', 'La calculadora compara el peso físico redondeado con el peso volumétrico redondeado y muestra el mayor. Las facturas reales pueden incluir mínimos, recargos y reglas negociadas.'], ['Margen', 'El beneficio estimado resta producto, embalaje, envío y comisiones del precio de venta. Impuestos, devoluciones, descuentos y cambio de divisa quedan fuera.'], ['España, México y Latinoamérica', 'Correos (Paq Estándar/Premium) y Correos Express: 167 kg/m³ (÷ 6.000). DHL Express: ÷ 5.000 por pieza. Estafeta: ÷ 5.000. FedEx México: ÷ 5.000 (guía de 2020) con redondeo al kilo. Correos de México: ÷ 6.000 con redondeo al kilo superior. Chilexpress: ÷ 4.000. Coordinadora: ÷ 2.500. No confirmamos un factor oficial para SEUR (península), GLS, MRW ni Mercado Libre. Cuando la empresa no publica el redondeo de las medidas, usamos las medidas exactas.'], ['Reglas revisadas el 24 de octubre de 2026', 'UPS Daily Rates: divisor 139; UPS Retail Rates: 166; medidas redondeadas hacia arriba (fuente: guía de dimensiones de UPS). USPS: divisor 139, medidas redondeadas hacia arriba y peso volumétrico solo por encima de 1.728 pulg³, desde el 12/07/2026 (fuente: Postal Bulletin 22705 de USPS). FedEx: divisor 139; la página de FedEx Canadá indica redondear hacia arriba y la página de ayuda de EE. UU. indica el entero más cercano, por eso usamos “hacia arriba” por defecto. Los servicios exprés internacionales suelen usar 5.000 cm³/kg; algunos usan 6.000. Los enlaces a las fuentes están en la página de metodología en inglés.']],
      },
      privacidad: {
        title: 'Privacidad | ShippingMath', description: 'Cómo mantiene ShippingMath los datos de las calculadoras en tu dispositivo.', eyebrow: 'Privacidad desde el diseño', heading: 'Tus datos de envío siguen siendo tuyos.', intro: 'Las calculadoras y la auditoría CSV funcionan en el navegador sin subir los datos del paquete.',
        sections: [['Cálculos locales', 'Las medidas, pesos, precios y archivos CSV se procesan en el dispositivo. La versión gratuita no exige una cuenta ni almacena los datos introducidos en un servidor.'], ['Enlaces compartibles', 'Un enlace puede incluir medidas básicas, sistema de unidades y divisor. No incluyas información de clientes ni datos confidenciales.'], ['Analítica', '{cf}Actualmente no usamos cookies de analítica. En el futuro podremos usar Google Analytics 4; en ese caso no se enviarán medidas, precios, nombres de archivo, SKU ni contenido de CSV, y esta página se actualizará antes.'], ['Publicidad', 'Actualmente no mostramos anuncios. En el futuro podremos usar Google AdSense; Google y sus socios podrán entonces usar cookies para mostrar anuncios, y podrás desactivar los anuncios personalizados en la Configuración de anuncios de Google.'], ['Consentimiento', 'Antes de usar cookies de analítica o publicidad, a los visitantes del EEE, Reino Unido y Suiza se les pedirá su consentimiento mediante una herramienta certificada por Google, y esas etiquetas respetarán su elección.'], ['Alojamiento', 'El sitio está alojado en Cloudflare, que procesa datos técnicos como direcciones IP para servir las páginas de forma segura.'], ['Contacto', 'Preguntas sobre privacidad: {email}. Responsable: Harsh Parmar.'], ['Actualización', 'Última actualización: 24 de octubre de 2026. Responsable: Harsh Parmar.']],
      },
      terminos: {
        title: 'Términos de uso | ShippingMath', description: 'Términos para utilizar las calculadoras gratuitas de ShippingMath.', eyebrow: 'Términos claros', heading: 'Estimaciones útiles, decisiones verificadas.', intro: 'ShippingMath ayuda a revisar los cálculos. El contrato con el transportista sigue siendo la fuente final.',
        sections: [['Uso de las herramientas', 'Puedes usar las calculadoras y la auditoría local para planificación personal o comercial. No utilices el servicio para infringir leyes ni intentar accesos no autorizados.'], ['Estimaciones, no cotizaciones', 'Los resultados dependen de las medidas, divisor, redondeo y costes introducidos. Confirma las decisiones importantes en la documentación actual del transportista.'], ['Tus datos', 'Eres responsable de los datos introducidos y de proteger la privacidad de los clientes.']],
      },
      'acerca-de': {
        title: 'Acerca de ShippingMath', description: 'Por qué existe ShippingMath y cómo ayudan sus herramientas gratuitas.', eyebrow: 'Acerca del proyecto', heading: 'Los cálculos de envío deben conducir a una decisión.', intro: 'ShippingMath convierte medidas de paquetes en señales claras de coste y margen.',
        sections: [['Quién lo crea', 'ShippingMath está creado y mantenido por Harsh Parmar, desarrollador independiente. Nació al ver cuántos pequeños vendedores pierden margen por el peso volumétrico sin darse cuenta.'], ['Por qué lo creamos', 'Muchas calculadoras terminan en la fórmula. ShippingMath reúne peso real, volumétrico, facturable, volumen y margen para ayudarte a decidir si cambiar la caja, el precio o el cobro del envío.'], ['Qué no somos', 'ShippingMath es una herramienta independiente de planificación. No somos un transportista, sistema contable ni cotizador de franqueo.'], ['Gratis primero', 'El producto inicial es gratuito y no exige registro. Solo consideraremos funciones de pago para necesidades recurrentes como catálogos guardados, integraciones o informes de equipo.']],
      },
      contacto: {
        title: 'Contacto | ShippingMath', description: 'Contacta con ShippingMath para correcciones, sugerencias y colaboraciones.', eyebrow: 'Tus comentarios mejoran la herramienta', heading: '¿Encontraste una regla que debemos revisar?', intro: 'Aceptamos correcciones de cálculo, sugerencias de flujo y propuestas de colaboración.',
        sections: [['Correo electrónico', 'Escribe a {email}. ShippingMath está gestionado por Harsh Parmar y todos los mensajes se leen personalmente.'], ['Cómo informar de un error de cálculo', 'Indica transportista, servicio, país de destino, las medidas y el peso utilizados y un enlace a la regla o tarifa pública con la que comparas.'], ['Protege la privacidad', 'Nunca envíes nombres, direcciones, números de seguimiento, facturas ni exportaciones de pedidos sin eliminar los datos personales.']],
      },
    },
  },
} as const;

export const languagePaths = {
  home: { en: '/', 'pt-br': '/pt-br/', es: '/es/' },
  optimizer: { en: '/box-margin-optimizer/', 'pt-br': '/pt-br/otimizador-de-caixas/', es: '/es/optimizador-de-cajas/' },
  methodology: { en: '/methodology/', 'pt-br': '/pt-br/metodologia/', es: '/es/metodologia/' },
  privacy: { en: '/privacy/', 'pt-br': '/pt-br/privacidade/', es: '/es/privacidad/' },
  terms: { en: '/terms/', 'pt-br': '/pt-br/termos/', es: '/es/terminos/' },
  about: { en: '/about/', 'pt-br': '/pt-br/sobre/', es: '/es/acerca-de/' },
  contact: { en: '/contact/', 'pt-br': '/pt-br/contato/', es: '/es/contacto/' },
} as const;
