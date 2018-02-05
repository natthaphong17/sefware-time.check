import { Injectable } from '@angular/core';

@Injectable()
export class PrintingService {

  constructor() { }
  print(printId: string, title: string, styles: string) {
    const printContents = document.getElementById(printId).innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          ${styles}
        </style>
      </head>
       <body onload="window.print();window.close()">${printContents}</body>
     </html>`
    );
    popupWin.document.close();
  }
}
