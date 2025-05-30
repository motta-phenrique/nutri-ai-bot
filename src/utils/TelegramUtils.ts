export const messagePlanDeactivate = `Olá, para usar o Chat, você precisaria ativar seu plano 😄. Fale com nossa equipe de suporte. (43) 99917-9636`
export const firstMessageWelcome = `Olá 😄. Bem vindo ao Nutri-AI, esperamos ajudar você com seu propósito! 😄`
export const messageWarning = `Olá, para ter acesso as funcionalidades do bot, entre em contato com o suporte (43) 99917-9636 😄`


export function sanitizeTelegramHTML(html: string): string {
  let text = html;

  // <p> vira \n
  text = text.replace(/<\s*\/?p\s*>/gi, '\n');

  // <ul>/<ol>/<li>
  text = text.replace(/<\s*ul\s*>/gi, '');
  text = text.replace(/<\s*\/ul\s*>/gi, '');
  text = text.replace(/<\s*li\s*>/gi, '\n• ');
  text = text.replace(/<\s*\/li\s*>/gi, '');

  // Lista numerada <ol>...</ol> → 1., 2., etc.
  text = text.replace(/<ol>(.*?)<\/ol>/gis, (match, inner) => {
    const items = inner
      .split(/<li>/gi)
      .filter((item: string) => item.trim() !== '')
      .map((item: string, i: number) => `${i + 1}. ${item.replace(/<\/li>/gi, '').trim()}`);
    return items.join('\n');
  });

  // Tags permitidas
  text = text.replace(/<(strong)>/gi, '<b>');
  text = text.replace(/<\/(strong)>/gi, '</b>');
  text = text.replace(/<(em)>/gi, '<i>');
  text = text.replace(/<\/(em)>/gi, '</i>');

  // Remove o resto das tags
  text = text.replace(/<(?!\/?(b|i)\b)[^>]+>/gi, '');

  // Reduz múltiplas quebras de linha para no máximo 1
  text = text.replace(/\n{2,}/g, '\n');

  // Remove espaço em branco antes/depois do texto
  return text.trim();
}