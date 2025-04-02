interface StatusInfo {
  label: string;
  color: string;
}

const tripStatusToReadable = (status: string): StatusInfo => {
  switch (status.toLowerCase()) {
    case 'active':
      return {
        label: 'Active',
        color: '#4CAF50' // Green
      };
    case 'in transit':
      return {
        label: 'In Transit',
        color: '#FFC107' // Yellow
      };
    case 'completed':
      return {
        label: 'Completed',
        color: '#2196F3' // Blue
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        color: '#F44336' // Red
      };
    default:
      return {
        label: status,
        color: '#9E9E9E' // Grey
      };
  }
};

export default tripStatusToReadable; 