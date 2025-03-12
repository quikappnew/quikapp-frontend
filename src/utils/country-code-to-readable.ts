export default function countryCodeToReadable(code: string): {
  label: string;
  color: string;
} {
  switch (code) {
    case 'IN':
      return {
        label: 'India',
        color: '#43A047',
      };
    case 'US':
      return {
        label: 'United States',
        color: '#FB8C00',
      };
    case 'Singapore':
    case 'SG':
      return {
        label: 'Singapore',
        color: '#FB8C00',
      };
    case 'PAPUA_NEW_GUINEA':
    case 'PG':
      return {
        label: 'Papua New Guinea',
        color: '#FB8C00',
      };
    default:
      return {
        label: code,
        color: '#000',
      };
  }
}
