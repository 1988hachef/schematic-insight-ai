import { useTranslation } from 'react-i18next';

interface DeveloperSignatureProps {
  position?: 'left' | 'right';
  className?: string;
}

export const DeveloperSignature = ({ position = 'right', className = '' }: DeveloperSignatureProps) => {
  return (
    <div 
      className={`fixed bottom-6 ${position === 'left' ? 'left-6' : 'right-6'} z-50 ${className}`}
      style={{ direction: 'ltr' }}
    >
      <div className="text-gold text-xs font-semibold tracking-wider opacity-70 hover:opacity-100 transition-opacity">
        HACHEF OUSSAMA
      </div>
    </div>
  );
};
