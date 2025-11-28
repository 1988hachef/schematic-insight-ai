import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const captureImage = async (): Promise<string> => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    return image.dataUrl!;
  } catch (error) {
    console.error('Error capturing image:', error);
    throw error;
  }
};

export const pickImage = async (): Promise<string> => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl!;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
};

export const pickMultipleImages = async (): Promise<string[]> => {
  try {
    // For multiple images, we'll use the standard file input
    // as Capacitor Camera doesn't support multiple selection directly
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      
      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          reject(new Error('No files selected'));
          return;
        }

        const imagePromises = Array.from(files).map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        try {
          const images = await Promise.all(imagePromises);
          resolve(images);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  } catch (error) {
    console.error('Error picking multiple images:', error);
    throw error;
  }
};

export const pickPDF = async (): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) {
        reject(new Error('No file selected'));
        return;
      }
      resolve(Array.from(files));
    };

    input.click();
  });
};
