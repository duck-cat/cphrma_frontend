import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BrowserMultiFormatReader,
  IScannerControls
} from '@zxing/browser';
import {BarcodeServService} from "./barcode-serv.service"
@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css'
})
export class BarcodeScannerComponent {

  constructor(private barcodeServ:BarcodeServService){}
@ViewChild('videoElement')
  videoElement!: ElementRef<HTMLVideoElement>;

  @Output() scanned = new EventEmitter<any>();

  private reader = new BrowserMultiFormatReader();
  private controls?: IScannerControls;

  isScanning = false;
  errorMessage = '';

  async startScanner(): Promise<void> {
    try {
      this.errorMessage = '';
      alert("allow camera")
      await this.checkCameraPermission();
      alert("asked for camera permission")
      if (this.isScanning) return;

      this.controls = await this.reader.decodeFromVideoDevice(
        undefined,
        this.videoElement.nativeElement,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
           console.log("barcode detected");
           console.log(barcode);
           this.barcodeServ.getProductByBarcode(barcode).subscribe((res)=>{
           this.scanned.emit(res);
           });
            
            this.stopScanner();
          }
        }
      );

      this.isScanning = true;

    } catch (error) {
      console.error('Camera error:', error);
      this.errorMessage =
        'Unable to access camera. Please check camera permissions.';
    }
  }
  async checkCameraPermission() {

  console.log('HTTPS:', window.isSecureContext);
  console.log('Camera API:', !!navigator.mediaDevices?.getUserMedia);

  try {

    // Check existing camera permission
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({
        name: 'camera' as PermissionName
      });

      console.log('Current camera permission:', permission.state);
      alert('Current camera permission:'+ permission.state);

      permission.onchange = () => {
        console.log('Permission changed:', permission.state);
        alert('Current camera permission:'+ permission.state);
      };
    }

    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' }
      }
    });

    console.log('Camera successfully opened');

    stream.getTracks().forEach(track => track.stop());

  } catch (error: any) {

    console.error('Camera error name:', error.name);
    console.error('Camera error message:', error.message);

  }
}

  stopScanner(): void {
    this.controls?.stop();
    this.controls = undefined;
    this.isScanning = false;
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
