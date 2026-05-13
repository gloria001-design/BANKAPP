import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "users",
    initialState: [
       {
           id:Date.now(),
           fullName: "",
           email: "",
           password: ""

       }
            ],

    reducers: {
        transferFunds: (state, action) => {
            const { userID, senderAccountID, recipientAccountNumber, reciepientID, amount, memo } = action.payload;
            const sender = state.find(user => user.id === userID);
            const senderAccount = sender.accounts.find(account => account.id === senderAccountID);

            if(senderAccount.balance > amount) {
                senderAccount.balance -= amount;
                const recipient = state.find(user => user.id === reciepientID);
                const recipientAccount = recipient.accounts.find(account => account.accountNumber === recipientAccountNumber);
                recipientAccount.balance += amount;
                sender.transactions.push({
                    id: sender.transactions.length + 1,
                    type: "debit",
                    amount: amount,
                    memo: memo,
                    date: new Date().toISOString(),
                });
                recipient.transactions.push({
                    id: recipient.transactions.length + 1,
                    type: "credit",
                    amount: amount,
                    memo: memo,
                    date: new Date().toISOString(),
                });
                alert("Funds transferred successfully");
                return state;
            } else {
                alert("Insufficient balance");
                return state;
            }
        }, 
        createuser: (state, action) =>{
            const { fullName, email, password } = action.payload;
            const NewUser= {
                id: Date.now(),
                fullName,
                email,
                password,
                accountNumber: []
            };
            state.push(NewUser);
        }

    }
})

export const { transferFunds, createuser } = usersSlice.actions;
export default usersSlice.reducer;