import 'html2canvas';

declare global {
  namespace Html2Canvas {
    interface Html2CanvasOptions {
      scale?: number;
    }
  }
}
