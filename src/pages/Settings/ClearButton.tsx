import { clearDatabase, removeDatabases } from '../../database/backup_restore';
import { connectToDatabase } from '../../database/initialisation';
import { ConfirmationButton } from '../../components/ConfirmationButton';

const clear = async () =>{
    await clearDatabase(await connectToDatabase());
    await removeDatabases();
    // do a full page reload - reset the app
    window.location.reload();
}

export const ClearButton = ()=>{
    // TODO: Confirmation Dialog - you don't want to do this accidentally!

    return (
        <ConfirmationButton
        dialogTitle='Clear Data' 
        dialogText='Clearing your data will delete EVERYTHING in AET. Ensure you have backed everything up before continuing. Are you sure you want to do this?'
        confirmText='Yes, I understand'
        cancelText='Cancel'
        onConfirm={clear}
        >
            Clear Data
        </ConfirmationButton>
    );
}

