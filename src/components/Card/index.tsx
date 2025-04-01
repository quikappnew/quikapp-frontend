import { Card, CardContent, Typography } from "@mui/material";

interface BasicCardProps {
    count: number;
    description: string;
    bgColor?: string; // Make bgColor optional or provide a default
}

const BasicCard = ({count, description, bgColor}: BasicCardProps) => {
    return (
        <Card sx={{ backgroundColor: bgColor || '#ffffff' }}> {/* Apply bgColor or default white */}
            <CardContent>
                <Typography variant="h5" component="h2" sx={{ color: '#ffffff' }}> {/* Ensure text is readable */} 
                   {count}
                </Typography>   
                <Typography variant="h6" component="h6" sx={{ color: '#ffffff' }}> {/* Ensure text is readable */}
                    {description}
                </Typography>   
            </CardContent>
        </Card>
    )
}

export default BasicCard;
