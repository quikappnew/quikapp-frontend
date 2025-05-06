import { Card, CardContent, Typography } from "@mui/material";

interface BasicCardProps {
    count: number;
    description: string;
    bgColor?: string; // Make bgColor optional or provide a default
    color?: string;
}

const BasicCard = ({count, description, bgColor, color}: BasicCardProps) => {
    return (
        <Card sx={{ backgroundColor: '#ffffff', color:  '#000000' }}> {/* Apply bgColor or default white */}
            <CardContent>
                <Typography variant="h5" component="h2" sx={{ color: '#000000' }}> {/* Ensure text is readable */} 
                   {count}
                </Typography>   
                <Typography variant="h6" component="h6" sx={{ color: '#0000008f' }}> {/* Ensure text is readable */}
                    {description}
                </Typography>   
            </CardContent>
        </Card>
    )
}

export default BasicCard;
