import arrowBackIcon from 'media/icons/arrow-back-outline.svg';

export default function Navbar({
  title,
  subTitle,
  onBackButtonClick,
}: {
  title: string;
  subTitle?: string;
  onBackButtonClick?: () => void;
}) {
  return (
    <div className="flex items-start gap-2 align-top mb-4">
      {onBackButtonClick && (
        <div className="cursor-pointer bg-gray-100 rounded-full p-1" onClick={onBackButtonClick}>
          <img src={arrowBackIcon} alt="Back" height={24} className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{subTitle}</p>
      </div>
    </div>
  );
}
