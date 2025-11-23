import { useTranslation } from 'react-i18next';

interface DeveloperSignatureProps {
  position?: 'left' | 'right';
  className?: string;
}

export const DeveloperSignature = ({ position = 'right', className = '' }: DeveloperSignatureProps) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className={`fixed top-6 ${position === 'left' ? 'left-6' : 'right-6'} z-50 ${className}`}
      style={{ direction: 'ltr' }}
    >
      <div className="text-gold text-sm font-semibold tracking-wide animate-shimmer">
        {t('developer')}
      </div>
    </div>
  );
};
