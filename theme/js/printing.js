function onBeforePrint(){
  if (window.Tawk_API && window.Tawk_API.hideWidget)
    window.Tawk_API.hideWidget();
}

function onAfterPrint(){
  if (window.Tawk_API && window.Tawk_API.showWidget)
    window.Tawk_API.showWidget();

}

window.addEventListener('beforeprint', onBeforePrint);
window.addEventListener('afterprint', onAfterPrint);
window.matchMedia('print').addListener((mql) => mql.matches? this.onBeforePrint(): this.onAfterPrint() );
