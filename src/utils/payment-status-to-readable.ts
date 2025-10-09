export interface PaymentStatusInfo {
    label: string;
    color: string;
}

export default function paymentStatusToReadable(status: number): PaymentStatusInfo {
    switch (status) {
        case 0:
            return {
                label: 'Pending',
                color: '#FB8C00', // Orange
            };
        case 1:
            return {
                label: 'Paid',
                color: '#43A047', // Green
            };
        case 2:
            return {
                label: 'Partially Paid',
                color: '#3949AB', // Blue
            };
        case 3:
            return {
                label: 'Overdue',
                color: '#E53935', // Red
            };
        default:
            return {
                label: `Unknown (${status})`,
                color: '#757575', // Gray
            };
    }
}

// Export the enum values for reference
export const PaymentStatusEnum = {
    PENDING: 0,
    PAID: 1,
    PARTIALLY_PAID: 2,
    OVERDUE: 3,
} as const;

