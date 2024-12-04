import { MatSnackBarConfig } from "@angular/material/snack-bar";


export abstract class AppUtils {

  public static snackBarErrorConfig: MatSnackBarConfig<void> = {
    duration: 4000,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    panelClass: ['error-snackbar']
  }

  public static snackBarSuccessConfig: MatSnackBarConfig<void> = {
    duration: 4000,
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
    panelClass: ['success-snackbar']
  }

  public static isValidPassword(pass:string) {

    // Minimum eight characters:
    const regex = /^.{8,}$/;

    // Minimum eight characters, at least one letter and one number:
    // const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Minimum eight characters, at least one letter, one number and one special character:
    // const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
    // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

    return regex.test(String(pass).toLowerCase());
  }

  public static generatePassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
  }

  // Generate sha-256
  public static async digestString(str: string, callback: (result: string) => void) {
    const msgUint8 = new TextEncoder().encode(str);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    callback(hashHex);
  }

  public static decodeHtml(html: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  }

  public static esYoutubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(&.*)?$/;
    return youtubeRegex.test(url);
  }

  public static getYouTubeId(url: string): string | null {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

}