import { Card, CardContent, Typography } from "@mui/material";


const BasicCard = ({count, description}: {count: number, description: string}) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                   {count}
                </Typography>   
                <Typography variant="h6" component="h6">
                    {description}
                </Typography>   
            </CardContent>
        </Card>
    )
}

export default BasicCard;
