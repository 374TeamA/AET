import { Button } from '@mui/material';
import { clearDatabase, exportToJson } from '../../database/backup_restore';
import { connectToDatabase } from '../../database/initialisation';

const clear = async () =>{
    await clearDatabase(await connectToDatabase())
}

export const ClearButton = ()=>{
    // TODO: Confirmation Dialog - you don't want to do this accidentally!

    return (
        <>
            <Button variant="contained" onClick={clear}>Clear</Button>
        </>
    );
}

