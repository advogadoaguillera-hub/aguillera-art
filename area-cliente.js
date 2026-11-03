/* Área do Cliente — ligação do site com o sistema do escritório.
   1. Conta a visita no painel do escritório (aba "Site"), sem cookie e sem
      dado pessoal: só a página, o dia e de onde a pessoa chegou (Google,
      Instagram…). Atende à LGPD sem precisar de aviso de cookies.
   2. Os botões "Área do Cliente" e "Cadastre-se" já apontam para o sistema
      no próprio HTML; este arquivo não é necessário para eles funcionarem.

   Endereço do sistema: troque aqui se um dia mudar. */
(function () {
  var SISTEMA = 'https://area.aguillera.art.br';
  try {
    // "Visitante novo" = primeira página desta visita (a aba aberta).
    var nova = !sessionStorage.getItem('aguillera-visita');
    sessionStorage.setItem('aguillera-visita', '1');
    var dados = JSON.stringify({ pagina: location.pathname, referencia: document.referrer, nova: nova });
    if (navigator.sendBeacon) navigator.sendBeacon(SISTEMA + '/api/visita', new Blob([dados], { type: 'text/plain' }));
    else fetch(SISTEMA + '/api/visita', { method: 'POST', body: dados, keepalive: true, mode: 'no-cors' });
  } catch (e) { /* o contador nunca atrapalha o site */ }
})();
