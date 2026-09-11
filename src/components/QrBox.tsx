import QRCode from 'react-qr-code';

// Real scannable QR encoding the document payload, in a white quiet-zone box.
export default function QrBox({ value, size = 96, className = '' }: { value: string; size?: number; className?: string }) {
  return (
    <div className={'qr-box' + (className ? ' ' + className : '')}>
      <QRCode value={value} size={size} fgColor="#101418" bgColor="#ffffff" />
    </div>
  );
}
